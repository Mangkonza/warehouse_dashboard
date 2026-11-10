/** Returns the client-side base path prefix (e.g. "/research" or ""). */
export const getClientBasePath = (): string => {
  return (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');
};

/** Returns full public asset URL supporting dynamic basePath in deployment */
export const getAssetUrl = (assetPath: string): string => {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://') || assetPath.startsWith('data:')) {
    return assetPath;
  }
  const basePath = getClientBasePath();
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${basePath}${normalized}`;
};

export const getApiBaseUrl = (): string => {
  // รองรับ Subpath (เช่น /research_and_inovation) และ root domain
  // คืน relative path เสมอ (basePath + NEXT_PUBLIC_API_URL || '/api/v1') เพื่อให้ deploy ได้ทุก domain โดยไม่ต้อง build ใหม่
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '').replace(/\/+$/, '');
  const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').trim();
  const cleanApiUrl = rawApiUrl.replace(/\/+$/, '') || '/api/v1';
  const normalizedPath = cleanApiUrl.startsWith('/') ? cleanApiUrl : `/${cleanApiUrl}`;
  return `${basePath}${normalizedPath}`;
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
  if (typeof window !== 'undefined' && !headers['Authorization'] && !headers['authorization']) {
    const token = localStorage.getItem('ku_token') || localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

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
      `ไม่สามารถเชื่อมต่อ Backend API ได้ (${baseUrl}) - กรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend เปิดทำงานและตั้งค่า BACKEND_URL ถูกต้องหรือไม่`
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
