import { Router, Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';
import { requireSession, requireRole } from '../middleware/auth.js';

export const dashboardRouter = Router();

// ทุก Endpoint ในแดชบอร์ดต้องมี Session และสิทธิ์เข้าถึง (ระดับ user ขึ้นไป)
dashboardRouter.use(requireSession);
dashboardRouter.use(requireRole('overview'));

// 1. ภาพรวมสถิติและ KPIs
dashboardRouter.get('/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quarter } = req.query;
    const overview = await DashboardService.getOverview(quarter as string);
    res.json({ status: 'success', data: overview });
  } catch (err) {
    next(err);
  }
});

// 2. โครงการวิจัย
dashboardRouter.get('/research', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DashboardService.getResearchProjects();
    res.json({ status: 'success', data, total: data.length });
  } catch (err) {
    next(err);
  }
});

// 3. โครงการพัฒนาวิชาการ
dashboardRouter.get('/academic', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DashboardService.getAcademicProjects();
    res.json({ status: 'success', data, total: data.length });
  } catch (err) {
    next(err);
  }
});

// 4. ผลงานตีพิมพ์
dashboardRouter.get('/publications', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DashboardService.getPublications();
    res.json({ status: 'success', data, total: data.length });
  } catch (err) {
    next(err);
  }
});

// 5. บริการวิชาการ
dashboardRouter.get('/services', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DashboardService.getServices();
    res.json({ status: 'success', data, total: data.length });
  } catch (err) {
    next(err);
  }
});

// 6. ทรัพย์สินทางปัญญา
dashboardRouter.get('/ip', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await DashboardService.getIntellectualProperties();
    res.json({ status: 'success', data, total: data.length });
  } catch (err) {
    next(err);
  }
});
