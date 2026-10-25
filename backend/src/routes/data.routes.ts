import { Router, Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service.js';
import { ServiceService } from '../services/service.service.js';
import { IpService } from '../services/ip.service.js';
import { PersonnelService } from '../services/personnel.service.js';
import { requireSession, requireRole } from '../middleware/auth.js';
import { canAccess } from '../config/permissions.js';

export const dataRouter = Router();

// ทุก Endpoint ของ /data ต้องผ่าน requireSession
dataRouter.use(requireSession);

// Helper to normalize category name
function normCategory(cat: string): string {
  const c = String(cat || '').toLowerCase().trim();
  if (c === 'services') return 'service';
  return c;
}

// 1. GET /api/v1/data/:category
dataRouter.get('/:category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = normCategory(String(req.params.category));

    // ตรวจสอบสิทธิ์เฉพาะหมวด: personnel ต้องการระดับ management ขึ้นไป
    if (category === 'personnel') {
      if (!canAccess(req.user?.role, 'personnel')) {
        res.status(403).json({ status: 'error', message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลบุคลากร' });
        return;
      }
    } else {
      if (!canAccess(req.user?.role, 'overview')) {
        res.status(403).json({ status: 'error', message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลในส่วนนี้' });
        return;
      }
    }

    switch (category) {
      case 'research': {
        const result = await ProjectService.getResearchList(req.query);
        res.json({
          status: 'success',
          category,
          total: result.total,
          data: result.data,
        });
        break;
      }
      case 'academic': {
        const result = await ProjectService.getAcademicList(req.query);
        res.json({
          status: 'success',
          category,
          total: result.total,
          data: result.data,
        });
        break;
      }
      case 'publications': {
        const result = await ProjectService.getPublicationList(req.query);
        res.json({
          status: 'success',
          category,
          total: result.total,
          data: result.data,
        });
        break;
      }
      case 'service': {
        const result = await ServiceService.getAll(req.query);
        res.json({
          status: 'success',
          category,
          total: result.total,
          data: result.data,
        });
        break;
      }
      case 'ip': {
        const result = await IpService.getAll(req.query);
        res.json({
          status: 'success',
          category,
          total: result.total,
          data: result.data,
        });
        break;
      }
      case 'personnel': {
        const list = await PersonnelService.getAll(
          req.query.department as string,
          req.query.search as string
        );
        res.json({
          status: 'success',
          category,
          total: list.length,
          data: list,
        });
        break;
      }
      default:
        res.status(404).json({
          status: 'error',
          message: `Category "${category}" is not supported`,
        });
    }
  } catch (err) {
    next(err);
  }
});

// 2. POST /api/v1/data/:category (Single item or Batch import)
dataRouter.post('/:category', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = normCategory(String(req.params.category));
    const body = req.body;

    // Check if batch import
    if (body && Array.isArray(body.items)) {
      const items: any[] = body.items;
      const results: any[] = [];

      for (const item of items) {
        try {
          let saved: any = null;
          switch (category) {
            case 'research':
              saved = await ProjectService.createResearch(item);
              break;
            case 'academic':
              saved = await ProjectService.createAcademic(item);
              break;
            case 'publications':
              saved = await ProjectService.createPublication(item);
              break;
            case 'service':
              saved = await ServiceService.create(item);
              break;
            case 'ip':
              saved = await IpService.create(item);
              break;
            case 'personnel':
              saved = await PersonnelService.create(item);
              break;
          }
          if (saved) results.push(saved);
        } catch (itemErr: any) {
          console.warn(`[Batch Import] Item failed for ${category}:`, itemErr.message);
        }
      }

      res.json({
        status: 'success',
        message: `Imported ${results.length} records into ${category}`,
        total: results.length,
        data: results,
      });
      return;
    }

    // Single item create
    let created: any = null;
    switch (category) {
      case 'research':
        created = await ProjectService.createResearch(body);
        break;
      case 'academic':
        created = await ProjectService.createAcademic(body);
        break;
      case 'publications':
        created = await ProjectService.createPublication(body);
        break;
      case 'service':
        created = await ServiceService.create(body);
        break;
      case 'ip':
        created = await IpService.create(body);
        break;
      case 'personnel':
        created = await PersonnelService.create(body);
        break;
      default:
        res.status(404).json({ status: 'error', message: `Category "${category}" not supported` });
        return;
    }

    res.status(201).json({
      status: 'success',
      message: 'Record created successfully and persisted in database',
      data: created,
    });
  } catch (err) {
    next(err);
  }
});

// 3. PUT /api/v1/data/:category (Update item)
dataRouter.put('/:category', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = normCategory(String(req.params.category));
    const body = req.body;
    const targetId = body.dbId || body.id || body._id;

    if (!targetId) {
      res.status(400).json({ status: 'error', message: 'Target record ID is required for update' });
      return;
    }

    let updated: any = null;
    switch (category) {
      case 'research':
        updated = await ProjectService.updateResearch(targetId, body);
        break;
      case 'academic':
        updated = await ProjectService.updateAcademic(targetId, body);
        break;
      case 'publications':
        updated = await ProjectService.updatePublication(targetId, body);
        break;
      case 'service':
        updated = await ServiceService.update(targetId, body);
        break;
      case 'ip':
        updated = await IpService.update(targetId, body);
        break;
      case 'personnel':
        updated = await PersonnelService.update(targetId, body);
        break;
      default:
        res.status(404).json({ status: 'error', message: `Category "${category}" not supported` });
        return;
    }

    res.json({
      status: 'success',
      message: 'Record updated successfully and persisted in database',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// 4. DELETE /api/v1/data/:category (Delete item)
dataRouter.delete('/:category', requireRole('manage'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = normCategory(String(req.params.category));
    const targetId = (req.query.id as string) || (req.query.dbId as string) || req.body?.dbId || req.body?.id || req.body?._id;

    if (!targetId) {
      res.status(400).json({ status: 'error', message: 'Target record ID is required' });
      return;
    }

    let deleted: any = null;
    switch (category) {
      case 'research':
        deleted = await ProjectService.deleteResearch(targetId);
        break;
      case 'academic':
        deleted = await ProjectService.deleteAcademic(targetId);
        break;
      case 'publications':
        deleted = await ProjectService.deletePublication(targetId);
        break;
      case 'service':
        deleted = await ServiceService.delete(targetId);
        break;
      case 'ip':
        deleted = await IpService.delete(targetId);
        break;
      case 'personnel':
        deleted = await PersonnelService.delete(targetId);
        break;
      default:
        res.status(404).json({ status: 'error', message: `Category "${category}" not supported` });
        return;
    }

    res.json({
      status: 'success',
      message: `Record ${targetId} deleted successfully`,
      deleted: true,
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
});
