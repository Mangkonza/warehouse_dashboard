import { Router, Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service.js';
import { requireSession, requireRole } from '../middleware/auth.js';

export const serviceRouter = Router();

serviceRouter.use(requireSession);

// GET /api/v1/services
serviceRouter.get('/', requireRole('service'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ServiceService.getAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/services/:id
serviceRouter.get('/:id', requireRole('service'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await ServiceService.getById(String(req.params.id));
    if (!item) {
      res.status(404).json({ status: 'error', message: 'ไม่พบข้อมูลงานบริการวิชาการ' });
      return;
    }
    res.json({ status: 'success', data: item });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/services
serviceRouter.post('/', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const created = await ServiceService.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'บันทึกข้อมูลงานบริการวิชาการเรียบร้อยแล้ว',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/services/:id
serviceRouter.put('/:id', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await ServiceService.update(String(req.params.id), req.body);
    res.json({
      status: 'success',
      message: 'แก้ไขข้อมูลงานบริการวิชาการเรียบร้อยแล้ว',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/services/:id
serviceRouter.delete('/:id', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await ServiceService.delete(String(req.params.id));
    res.json({
      status: 'success',
      message: 'ลบข้อมูลงานบริการวิชาการเรียบร้อยแล้ว',
      id: deleted.id,
    });
  } catch (err) {
    next(err);
  }
});
