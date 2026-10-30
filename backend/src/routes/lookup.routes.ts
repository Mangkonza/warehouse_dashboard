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
