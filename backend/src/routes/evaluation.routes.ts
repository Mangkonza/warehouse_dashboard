import { Router, Request, Response, NextFunction } from 'express';
import { EvaluationService } from '../services/evaluation.service.js';
import { requireSession, requireRole } from '../middleware/auth.js';

export const evaluationRouter = Router();

// การประเมินต้องผ่าน Session และมีสิทธิ์ระดับ management ขึ้นไป
evaluationRouter.use(requireSession);
evaluationRouter.use(requireRole('evaluation'));

// GET /api/v1/evaluation
// Supports ?category=... and optional &record_id=...
evaluationRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const recordId = req.query.record_id || req.query.recordId ? String(req.query.record_id || req.query.recordId) : undefined;

    const result = await EvaluationService.getEvaluations(category, recordId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/evaluation
evaluationRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await EvaluationService.saveEvaluation(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/evaluation/bulk
evaluationRouter.post('/bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await EvaluationService.bulkSave(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/evaluation
evaluationRouter.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category ? String(req.query.category) : undefined;
    const recordId = req.query.record_id || req.query.recordId || req.query.id
      ? String(req.query.record_id || req.query.recordId || req.query.id)
      : undefined;

    if (!category && !recordId) {
      res.status(400).json({ status: 'error', message: 'กรุณาระบุ category หรือ record_id เพื่อลบข้อมูลการประเมิน' });
      return;
    }

    const result = await EvaluationService.deleteEvaluation(category, recordId);
    res.json({ status: 'success', message: 'ลบผลการประเมินเรียบร้อยแล้ว', data: result });
  } catch (err) {
    next(err);
  }
});
