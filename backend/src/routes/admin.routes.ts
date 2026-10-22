import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.originalname.match(/\.(xlsx|xls)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  },
});

export const adminRouter = Router();

// ป้องกันด้วย authentication และ requireAdmin ทุก endpoints
adminRouter.use(authenticateJWT);
adminRouter.use(requireAdmin);

// 1. ตรวจสอบสิทธิ์ Admin
adminRouter.get('/verify', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Admin authorization verified',
    user: req.user,
  });
});

// 2. อัปโหลดไฟล์รายงาน Excel เข้าสู่ระบบ
adminRouter.post('/etl/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.json({
    status: 'success',
    message: 'File uploaded successfully and queued for ETL processing',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

// 3. Persistent CRUD endpoints
const FILE_MAP: Record<string, string> = {
  research: 'research.json',
  monitoring: 'research.json',
  academic: 'academic.json',
  publications: 'publications.json',
  service: 'services.json',
  services: 'services.json',
  ip: 'ip.json',
  personnel: 'personnel.json',
};

const getDataFilePath = (category: string) => {
  const baseName = FILE_MAP[category.toLowerCase()] || `${category.toLowerCase()}.json`;
  return path.resolve(process.cwd(), '..', 'warehouse_dashboard', 'src', 'data', baseName);
};

const getPersistedDataFilePath = (category: string) => {
  const baseName = FILE_MAP[category.toLowerCase()] || `${category.toLowerCase()}.json`;
  return path.resolve(process.cwd(), '..', 'warehouse_dashboard', 'src', 'data', `persisted_${baseName}`);
};

const readCategoryData = (category: string): any[] => {
  try {
    const pPath = getPersistedDataFilePath(category);
    const oPath = getDataFilePath(category);
    const targetPath = fs.existsSync(pPath) ? pPath : oPath;
    if (fs.existsSync(targetPath)) {
      const raw = fs.readFileSync(targetPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading data for ${category}:`, err);
  }
  return [];
};

const writeCategoryData = (category: string, items: any[]): boolean => {
  try {
    const pPath = getPersistedDataFilePath(category);
    const oPath = getDataFilePath(category);
    const content = JSON.stringify(items, null, 2);
    fs.writeFileSync(pPath, content, 'utf-8');
    fs.writeFileSync(oPath, content, 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing data for ${category}:`, err);
    return false;
  }
};

adminRouter.post('/records', (req: Request, res: Response) => {
  const category = (req.body.category || 'research').toLowerCase();
  const record = req.body.record || req.body;
  const items = readCategoryData(category);
  const newRecord = {
    ...record,
    _id: record._id || `${category}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    updatedAt: new Date().toISOString(),
  };
  items.unshift(newRecord);
  writeCategoryData(category, items);

  res.json({
    status: 'success',
    message: 'Record created and persisted successfully',
    data: newRecord,
  });
});

adminRouter.put('/records/:id', (req: Request, res: Response) => {
  const category = (req.body.category || 'research').toLowerCase();
  const targetId = req.params.id;
  const record = req.body.record || req.body;
  const items = readCategoryData(category);

  let updatedRecord = null;
  const updatedItems = items.map((item) => {
    if (item._id === targetId || item.id === targetId) {
      updatedRecord = { ...item, ...record, updatedAt: new Date().toISOString() };
      return updatedRecord;
    }
    return item;
  });

  if (!updatedRecord) {
    updatedRecord = { ...record, _id: targetId, updatedAt: new Date().toISOString() };
    updatedItems.unshift(updatedRecord);
  }

  writeCategoryData(category, updatedItems);

  res.json({
    status: 'success',
    message: `Record ${targetId} updated and persisted successfully`,
    data: updatedRecord,
  });
});

adminRouter.delete('/records/:id', (req: Request, res: Response) => {
  const category = (req.query.category as string || 'research').toLowerCase();
  const targetId = req.params.id;
  const items = readCategoryData(category);
  const filtered = items.filter((item) => item._id !== targetId && item.id !== targetId);

  writeCategoryData(category, filtered);

  res.json({
    status: 'success',
    message: `Record ${targetId} deleted and persisted successfully`,
  });
});

