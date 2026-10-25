import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const errorMessages = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    res.status(400).json({
      status: 'error',
      message: `ข้อมูลที่ส่งมาไม่ถูกต้อง: ${errorMessages}`,
      issues: err.issues,
    });
    return;
  }

  // 2. Prisma Database Errors
  if (err?.code === 'P2002') {
    res.status(409).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาด: ข้อมูลนี้มีอยู่ในระบบแล้ว (ซ้ำกับรายการอื่น)',
    });
    return;
  }

  if (err?.code === 'P2025') {
    res.status(404).json({
      status: 'error',
      message: 'ไม่พบรายการที่ต้องการแก้ไขหรือลบในระบบ',
    });
    return;
  }

  // 3. PostgreSQL Raw Constraint Violations
  const msg = err?.message || '';
  if (msg.includes('chk_ip_type')) {
    res.status(400).json({
      status: 'error',
      message: 'ประเภททรัพย์สินทางปัญญาไม่ถูกต้อง (รองรับเฉพาะ: อนุสิทธิบัตร, สิทธิบัตร, ลิขสิทธิ์)',
    });
    return;
  }

  if (msg.includes('uq_ip_type_reg_num')) {
    res.status(409).json({
      status: 'error',
      message: 'เลขทะเบียนนี้มีอยู่ในระบบแล้วภายใต้ประเภทผลงานเดียวกัน',
    });
    return;
  }

  if (msg.includes('chk_service_category')) {
    res.status(400).json({
      status: 'error',
      message: 'ประเภทงานบริการวิชาการไม่ถูกต้องตาม 6 หมวดที่ระบบกำหนด',
    });
    return;
  }

  if (msg.includes('role_audit_logs is append-only')) {
    res.status(403).json({
      status: 'error',
      message: 'ตารางบันทึกประวัติการเปลี่ยนสิทธิ์เป็นแบบ Append-Only ห้ามแก้ไขหรือลบโดยเด็ดขาด',
    });
    return;
  }

  // 4. Client Errors (4xx) -> return exact helpful reason
  const statusCode = Number(err?.statusCode || err?.status || 500);
  if (statusCode >= 400 && statusCode < 500) {
    res.status(statusCode).json({
      status: 'error',
      code: err?.code,
      message: err?.message || err?.clientMessage || 'ข้อมูลที่ส่งมาไม่ถูกต้อง',
    });
    return;
  }

  // 5. Server Errors (5xx) -> log with unique requestId, return generic message
  const requestId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  console.error(`[Server Error] [${requestId}]:`, err?.stack || err?.message || err);

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    requestId,
    message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง',
  });
}
