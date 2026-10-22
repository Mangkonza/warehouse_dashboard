import { Router, Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export const dashboardRouter = Router();

// 1. ภาพรวมสถิติและ KPIs
dashboardRouter.get('/overview', (req: Request, res: Response) => {
  const { quarter } = req.query;
  const overview = DashboardService.getOverview(quarter as string);
  res.json({ status: 'success', data: overview });
});

// 2. โครงการวิจัย
dashboardRouter.get('/research', (_req: Request, res: Response) => {
  const data = DashboardService.getResearchProjects();
  res.json({ status: 'success', data, total: data.length });
});

// 3. โครงการพัฒนาวิชาการ
dashboardRouter.get('/academic', (_req: Request, res: Response) => {
  const data = DashboardService.getAcademicProjects();
  res.json({ status: 'success', data, total: data.length });
});

// 4. ผลงานตีพิมพ์
dashboardRouter.get('/publications', (_req: Request, res: Response) => {
  const data = DashboardService.getPublications();
  res.json({ status: 'success', data, total: data.length });
});

// 5. บริการวิชาการ
dashboardRouter.get('/services', (_req: Request, res: Response) => {
  const data = DashboardService.getServices();
  res.json({ status: 'success', data, total: data.length });
});

// 6. ทรัพย์สินทางปัญญา
dashboardRouter.get('/ip', (_req: Request, res: Response) => {
  const data = DashboardService.getIntellectualProperties();
  res.json({ status: 'success', data, total: data.length });
});
