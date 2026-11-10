/**
 * Helper รวมสำหรับดึง URL ของ Backend บนฝั่ง Server (Next.js BFF API Routes & serverAuth)
 *
 * กฎการทำงาน:
 * - อ่านจาก BACKEND_INTERNAL_URL หรือ BACKEND_URL
 * - ใน Production (NODE_ENV === 'production'):
 *   หากไม่มีค่า ต้อง throw Error ชัดเจน ห้าม fallback เป็น localhost หรือสตริงว่าง
 * - ใน Development (NODE_ENV === 'development'):
 *   หากไม่มีค่า ให้ fallback เป็น 'http://127.0.0.1:8000'
 */
export function getBackendUrl(): string {
  const raw = (process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || '').trim();

  if (raw) {
    // ตัด trailing slash และ /api/v1 ที่อาจติดมา เพื่อไม่ให้ซ้ำซ้อนกับ path ที่ route นำไปต่อ
    return raw.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[backendUrl] ไม่พบตัวแปรสภาพแวดล้อม BACKEND_URL (หรือ BACKEND_INTERNAL_URL) ใน Production! ' +
      'กรุณากำหนด URL ของ Backend Service เพื่อให้ Next.js สามารถส่งต่อคำขอ (Proxy) ได้อย่างถูกต้อง'
    );
  }

  return 'http://127.0.0.1:8000';
}
