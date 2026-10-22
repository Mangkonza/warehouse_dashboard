import { Router, Request, Response } from 'express';
import { PersonnelService } from '../services/personnel.service.js';

export const personnelRouter = Router();

// 1. ค้นหาและดึงรายชื่อบุคลากรทั้งหมด
personnelRouter.get('/', (req: Request, res: Response) => {
  const { department, search } = req.query;
  const list = PersonnelService.getAll(department as string, search as string);
  res.json({
    status: 'success',
    total: list.length,
    data: list,
  });
});

// 2. ดึงรายการภาควิชาและจำนวนบุคลากร
personnelRouter.get('/departments', (_req: Request, res: Response) => {
  const departments = PersonnelService.getDepartments();
  res.json({
    status: 'success',
    data: departments,
  });
});

// 3. จับคู่ชื่ออาจารย์จากข้อความ
personnelRouter.get('/match', (req: Request, res: Response) => {
  const { name } = req.query;
  const matched = PersonnelService.match(name as string);
  res.json({
    status: 'success',
    matched: Boolean(matched),
    data: matched,
  });
});

// 4. ดึงข้อมูลบุคลากรรายบุคคล
personnelRouter.get('/:id', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const person = PersonnelService.getById(id);
  if (!person) {
    res.status(404).json({ error: 'Personnel not found' });
    return;
  }
  res.json({
    status: 'success',
    data: person,
  });
});
