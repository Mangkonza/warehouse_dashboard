import { Router, Request, Response, NextFunction } from 'express';
import { KpiService } from '../services/kpi.service.js';
import { requireSession } from '../middleware/auth.js';

export const kpiRouter = Router();

// 1. GET /api/v1/kpi/rounds - รายการรอบรายงานผล
kpiRouter.get('/rounds', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.getReportingRounds();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/v1/kpi/rounds - เพิ่ม/แก้ไขรอบรายงานผล (ต้องการ Session)
kpiRouter.post('/rounds', requireSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.upsertReportingRound(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 3. DELETE /api/v1/kpi/rounds/:id - ลบรอบรายงานผล (ต้องการ Session)
kpiRouter.delete('/rounds/:id', requireSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.deleteReportingRound(String(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 3b. GET /api/v1/kpi/hierarchy - รายการยุทธศาสตร์และแผนงานทั้งหมดจากฐานข้อมูล
kpiRouter.get('/hierarchy', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.getStrategicHierarchy();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 3c. POST /api/v1/kpi/hierarchy - เพิ่ม/แก้ไข/ลบ ยุทธศาสตร์และแผนงานในฐานข้อมูล
kpiRouter.post('/hierarchy', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.mutateStrategicHierarchy(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 3d. GET /api/v1/kpi/options - ตัวเลือก Dropdown ตัวชี้วัดจากฐานข้อมูล
kpiRouter.get('/options', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldKey = typeof req.query.fieldKey === 'string' ? req.query.fieldKey : undefined;
    const result = await KpiService.getKpiOptions(fieldKey);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 3e. POST /api/v1/kpi/options - เพิ่มตัวเลือก Dropdown ตัวชี้วัดลงฐานข้อมูล
kpiRouter.post('/options', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fieldKey, value, label } = req.body || {};
    if (!fieldKey || !value || !String(value).trim()) {
      res.status(400).json({ status: 'error', message: 'fieldKey and value are required' });
      return;
    }
    const result = await KpiService.addKpiOption(
      String(fieldKey),
      String(value),
      label ? String(label) : undefined
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 4. GET /api/v1/kpi - รายการตัวชี้วัดทั้งหมด
kpiRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.getAll();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 5. GET /api/v1/kpi/:id - ตัวชี้วัดตาม ID
kpiRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.getById(String(req.params.id));
    if (!result) {
      res.status(404).json({ status: 'error', message: 'ไม่พบตัวชี้วัดที่ระบุ' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 6. POST /api/v1/kpi - สร้างตัวชี้วัดใหม่ (ต้องการ Session)
kpiRouter.post('/', requireSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// 7. PUT /api/v1/kpi/:id - แก้ไขตัวชี้วัด (ต้องการ Session)
kpiRouter.put('/:id', requireSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.update(String(req.params.id), req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 8. DELETE /api/v1/kpi/:id - ลบตัวชี้วัด (ต้องการ Session)
kpiRouter.delete('/:id', requireSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await KpiService.delete(String(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 9. POST /api/v1/kpi/:id/results - บันทึกผลรายงานตามรอบ + ตัวชี้วัดย่อย (ต้องการ Session)
kpiRouter.post('/:id/results', requireSession, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicatorId = String(req.params.id);
    const roundId = req.body.roundId || 'round-9m';
    const result = await KpiService.saveRoundResult(indicatorId, roundId, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
