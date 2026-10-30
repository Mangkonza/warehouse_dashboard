import { Router, Request, Response, NextFunction } from 'express';
import { IpService } from '../services/ip.service.js';
import { requireSession, requireRole } from '../middleware/auth.js';

export const ipRouter = Router();

ipRouter.use(requireSession);

// GET /api/v1/ip
ipRouter.get('/', requireRole('ip'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await IpService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/ip/:id
ipRouter.get('/:id', requireRole('ip'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await IpService.getById(String(req.params.id));
    if (!item) {
      res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูลทรัพย์สินทางปัญญา' });
      return;
    }
    res.json({ status: 'success', data: item });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/ip
ipRouter.post('/', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await IpService.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'บันทึกข้อมูลทรัพย์สินทางปัญญาเรียบร้อยแล้ว',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/ip/:id
ipRouter.put('/:id', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await IpService.update(String(req.params.id), req.body);
    res.json({
      status: 'success',
      message: 'แก้ไขข้อมูลทรัพย์สินทางปัญญาเรียบร้อยแล้ว',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/ip/:id
ipRouter.delete('/:id', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await IpService.delete(String(req.params.id));
    res.json({
      status: 'success',
      message: 'ลบข้อมูลทรัพย์สินทางปัญญาเรียบร้อยแล้ว',
      id: deleted.id,
    });
  } catch (err) {
    next(err);
  }
});
