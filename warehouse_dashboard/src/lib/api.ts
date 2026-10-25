export const getApiBaseUrl = (): string => {
  // ใช้ Relative path เพื่อให้ Next.js Reverse Proxy ไปหา Backend (พอร์ต 8000) ได้อัตโนมัติ
  // รองรับทั้ง localhost, ngrok, localtunnel และ domain จริง โดยไม่ต้องเปิดพอร์ต 8000 ให้ภายนอก
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
};

export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  total?: number;
  message?: string;
  error?: string;
  token?: string;
  user?: any;
  expiresAt?: number;
}

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const baseUrl = getApiBaseUrl();
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error(
      `ไม่สามารถเชื่อมต่อ Backend API ได้ (${baseUrl}) - กรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend (พอร์ต 8000) เปิดทำงานอยู่หรือไม่`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error(`ไม่สามารถอ่านข้อมูลตอบกลับจาก Server ได้ (Status: ${response.status})`);
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }

  return data;
};
