import { Router, Request, Response, NextFunction } from 'express';
import { PersonnelService } from '../services/personnel.service.js';
import { requireSession, requireRole } from '../middleware/auth.js';

export const personnelRouter = Router();

// ต้องผ่าน requireSession
personnelRouter.use(requireSession);

// 1. ค้นหาและดึงรายชื่อบุคลากรทั้งหมด (ระดับ management ขึ้นไป)
personnelRouter.get('/', requireRole('personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { department, search } = req.query;
    const list = await PersonnelService.getAll(department as string, search as string);
    res.json({
      status: 'success',
      total: list.length,
      data: list,
    });
  } catch (err) {
    next(err);
  }
});

// 2. ดึงรายการภาควิชาและจำนวนบุคลากร
personnelRouter.get('/departments', requireRole('personnel'), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await PersonnelService.getDepartments();
    res.json({
      status: 'success',
      data: departments,
    });
  } catch (err) {
    next(err);
  }
});

// 3. จับคู่ชื่ออาจารย์จากข้อความ
personnelRouter.get('/match', requireRole('personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.query;
    const matched = await PersonnelService.match(name as string);
    res.json({
      status: 'success',
      matched: Boolean(matched),
      data: matched,
    });
  } catch (err) {
    next(err);
  }
});

// 4. ดึงข้อมูลบุคลากรรายบุคคล
personnelRouter.get('/:id', requireRole('personnel'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const person = await PersonnelService.getById(id);
    if (!person) {
      res.status(404).json({ status: 'error', message: 'Personnel not found' });
      return;
    }
    res.json({
      status: 'success',
      data: person,
    });
  } catch (err) {
    next(err);
  }
});

// 5. เพิ่มข้อมูลบุคลากร (admin)
personnelRouter.post('/', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await PersonnelService.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'บันทึกข้อมูลบุคลากรเรียบร้อยแล้ว',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// 6. แก้ไขข้อมูลบุคลากร (admin)
personnelRouter.put('/:id', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await PersonnelService.update(String(req.params.id), req.body);
    res.json({
      status: 'success',
      message: 'แก้ไขข้อมูลบุคลากรเรียบร้อยแล้ว',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// 7. ลบข้อมูลบุคลากร (admin)
personnelRouter.delete('/:id', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await PersonnelService.delete(String(req.params.id));
    res.json({
      status: 'success',
      message: 'ลบข้อมูลบุคลากรเรียบร้อยแล้ว',
      id: deleted.id,
    });
  } catch (err) {
    next(err);
  }
});
