import { Router, Request, Response, NextFunction } from 'express';
import { LookupService } from '../services/lookup.service.js';
import { requireSession } from '../middleware/auth.js';

export const lookupRouter = Router();

// ต้องมี Session เพื่อเรียกดู Lookup
lookupRouter.use(requireSession);

lookupRouter.get('/departments', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await LookupService.getDepartments();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.get('/funding-sources', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await LookupService.getFundingSources();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.get('/courses', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await LookupService.getCourses();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.get('/personnel', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await LookupService.getPersonnel();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.get('/kpi-options', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fieldKey = typeof req.query.fieldKey === 'string' ? req.query.fieldKey : undefined;
    const result = await LookupService.getKpiOptions(fieldKey);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.post('/kpi-options', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fieldKey, value, label } = req.body || {};
    if (!fieldKey || !value || !String(value).trim()) {
      res.status(400).json({ status: 'error', message: 'fieldKey and value are required' });
      return;
    }
    const result = await LookupService.addKpiOption(String(fieldKey), String(value), label ? String(label) : undefined);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.get('/strategic-hierarchy', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await LookupService.getStrategicHierarchy();
    res.json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.post('/strategic-strategies', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, code, name, pillarGroup } = req.body || {};
    if (!code || !name) {
      res.status(400).json({ status: 'error', message: 'code and name are required' });
      return;
    }
    const result = await LookupService.createStrategicStrategy(
      id || `strat-${Date.now()}`,
      String(code),
      String(name),
      pillarGroup ? String(pillarGroup) : undefined
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

lookupRouter.post('/strategic-plans', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, strategyId, code, name } = req.body || {};
    if (!strategyId || !code || !name) {
      res.status(400).json({ status: 'error', message: 'strategyId, code, and name are required' });
      return;
    }
    const result = await LookupService.createStrategicPlan(
      id || `plan-${Date.now()}`,
      String(strategyId),
      String(code),
      String(name)
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});
