/**
 * Helper รวมสำหรับดึง URL ของ Backend บนฝั่ง Server (Next.js BFF API Routes & serverAuth)
 *
 * กฎการทำงาน:
 * - อ่านจาก BACKEND_INTERNAL_URL หรือ BACKEND_URL
 * - ใน Production: หากไม่มีค่า ให้ fallback เป็น 'http://backend:8000' (ชื่อ service ใน Docker network)
 * - ใน Development: หากไม่มีค่า ให้ fallback เป็น 'http://127.0.0.1:8000'
 */
export function getBackendUrl(): string {
  const raw = (process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || '').trim();

  if (raw) {
    // ตัด trailing slash และ /api/v1 ที่อาจติดมา เพื่อไม่ให้ซ้ำซ้อนกับ path ที่ route นำไปต่อ
    return raw.replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    return 'http://backend:8000';
  }

  return 'http://127.0.0.1:8000';
}
