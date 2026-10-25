import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireSession, requireRole } from '../middleware/auth.js';
import { prisma } from '../db/prisma.js';
import { ProjectService } from '../services/project.service.js';
import { ServiceService } from '../services/service.service.js';
import { IpService } from '../services/ip.service.js';
import { PersonnelService } from '../services/personnel.service.js';
import { RoleService, RoleError } from '../services/role.service.js';

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

// ป้องกันด้วย authentication ทุก endpoints
adminRouter.use(requireSession);
// สำหรับ operations ทั่วไปของ adminRouter ต้องมีสิทธิ์ระดับ admin (manage)
adminRouter.use(requireRole('manage'));

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

// 3. Persistent CRUD endpoints connected to PostgreSQL Database
adminRouter.post('/records', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = (req.body.category || 'research').toLowerCase();
    const record = req.body.record || req.body;

    let created: any = null;
    switch (category) {
      case 'research':
      case 'monitoring':
        created = await ProjectService.createResearch(record);
        break;
      case 'academic':
        created = await ProjectService.createAcademic(record);
        break;
      case 'publications':
        created = await ProjectService.createPublication(record);
        break;
      case 'service':
      case 'services':
        created = await ServiceService.create(record);
        break;
      case 'ip':
        created = await IpService.create(record);
        break;
      case 'personnel':
        created = await PersonnelService.create(record);
        break;
      default:
        res.status(400).json({ status: 'error', message: `Unknown category: ${category}` });
        return;
    }

    res.status(201).json({
      status: 'success',
      message: 'Record created and persisted successfully in database',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.put('/records/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = (req.body.category || 'research').toLowerCase();
    const targetId = String(req.params.id);
    const record = req.body.record || req.body;

    let updated: any = null;
    switch (category) {
      case 'research':
      case 'monitoring':
        updated = await ProjectService.updateResearch(targetId, record);
        break;
      case 'academic':
        updated = await ProjectService.updateAcademic(targetId, record);
        break;
      case 'publications':
        updated = await ProjectService.updatePublication(targetId, record);
        break;
      case 'service':
      case 'services':
        updated = await ServiceService.update(targetId, record);
        break;
      case 'ip':
        updated = await IpService.update(targetId, record);
        break;
      case 'personnel':
        updated = await PersonnelService.update(targetId, record);
        break;
      default:
        res.status(400).json({ status: 'error', message: `Unknown category: ${category}` });
        return;
    }

    res.json({
      status: 'success',
      message: `Record ${targetId} updated and persisted successfully in database`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.delete('/records/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = (req.query.category as string || 'research').toLowerCase();
    const targetId = String(req.params.id);

    switch (category) {
      case 'research':
      case 'monitoring':
        await ProjectService.deleteResearch(targetId);
        break;
      case 'academic':
        await ProjectService.deleteAcademic(targetId);
        break;
      case 'publications':
        await ProjectService.deletePublication(targetId);
        break;
      case 'service':
      case 'services':
        await ServiceService.delete(targetId);
        break;
      case 'ip':
        await IpService.delete(targetId);
        break;
      case 'personnel':
        await PersonnelService.delete(targetId);
        break;
      default:
        res.status(400).json({ status: 'error', message: `Unknown category: ${category}` });
        return;
    }

    res.json({
      status: 'success',
      message: `Record ${targetId} deleted and persisted successfully in database`,
    });
  } catch (err) {
    next(err);
  }
});

// 4. Role Management Endpoints (Admin & Super Admin)
adminRouter.get('/roles', requireRole('user_roles'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const role = typeof req.query.role === 'string' ? req.query.role : undefined;
    const page = req.query.page ? parseInt(String(req.query.page), 10) : undefined;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;

    const result = await RoleService.listRoles({ search, role, page, limit });
    res.json({
      status: 'success',
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
});

adminRouter.get('/roles/audit-logs', requireRole('user_roles'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 100;
    const logs = await RoleService.getAuditLogs(limit);
    res.json({ status: 'success', data: logs });
  } catch (err) {
    next(err);
  }
});

adminRouter.post('/roles', requireRole('user_roles'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actor = {
      username: req.user?.nontriAccount || 'system',
      role: (req.user?.role as any) || 'user',
    };

    const created = await RoleService.grantRole(actor, req.body);
    res.status(201).json({
      status: 'success',
      message: `เพิ่มสิทธิ์ให้ ${created.username} เรียบร้อยแล้ว`,
      data: created,
    });
  } catch (err: any) {
    if (err instanceof RoleError) {
      res.status(err.statusCode).json({
        status: 'error',
        code: err.code,
        message: err.message,
      });
      return;
    }
    next(err);
  }
});

adminRouter.patch('/roles/:username', requireRole('user_roles'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actor = {
      username: req.user?.nontriAccount || 'system',
      role: (req.user?.role as any) || 'user',
    };

    const targetUsername = String(req.params.username);
    const updated = await RoleService.changeRole(actor, targetUsername, req.body);
    res.json({
      status: 'success',
      message: `แก้ไขสิทธิ์ของ ${updated.username} เรียบร้อยแล้ว`,
      data: updated,
    });
  } catch (err: any) {
    if (err instanceof RoleError) {
      res.status(err.statusCode).json({
        status: 'error',
        code: err.code,
        message: err.message,
      });
      return;
    }
    next(err);
  }
});

adminRouter.delete('/roles/:username', requireRole('user_roles'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const actor = {
      username: req.user?.nontriAccount || 'system',
      role: (req.user?.role as any) || 'user',
    };

    const targetUsername = String(req.params.username);
    const result = await RoleService.revokeRole(actor, targetUsername);
    res.json({
      status: 'success',
      message: result.message,
    });
  } catch (err: any) {
    if (err instanceof RoleError) {
      res.status(err.statusCode).json({
        status: 'error',
        code: err.code,
        message: err.message,
      });
      return;
    }
    next(err);
  }
});
