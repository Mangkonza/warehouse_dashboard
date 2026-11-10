import type { NextConfig } from "next";

const rawBasePath = (process.env.BASE_PATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '').trim();
const normalizedBasePath = rawBasePath && rawBasePath !== '/'
  ? (rawBasePath.startsWith('/') ? rawBasePath.replace(/\/+$/, '') : `/${rawBasePath.replace(/\/+$/, '')}`)
  : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: normalizedBasePath,
  assetPrefix: normalizedBasePath,
  env: {
    BASE_PATH: normalizedBasePath || '',
    NEXT_PUBLIC_BASE_PATH: normalizedBasePath || '',
  },
  allowedDevOrigins: [
    "192.168.56.1",
    "192.168.56.1:3000",
    "localhost:3000",
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.loca.lt",
    "*.trycloudflare.com",
  ],
  async rewrites() {
    const rawBackend = (process.env.BACKEND_URL || process.env.BACKEND_INTERNAL_URL || '').trim();

    if (!rawBackend && process.env.NODE_ENV === 'production') {
      throw new Error(
        '[next.config.ts] Missing BACKEND_URL environment variable in production! ' +
        'Please set BACKEND_URL to your backend service endpoint (e.g. http://backend:8000).'
      );
    }

    // ตัด trailing slash และ /api/v1 ที่อาจติดมา เพื่อไม่ให้ปลายทางกลายเป็น /api/v1/api/v1
    const baseBackend = (rawBackend || 'http://127.0.0.1:8000')
      .replace(/\/+$/, '')
      .replace(/\/api\/v1\/?$/, '');

    return [
      {
        // ส่งต่อ /api/v1/:path* ไปยัง backend โดยไม่ชนกับ BFF routes ใน src/app/api/* ที่ไม่มีคำว่า /v1
        source: "/api/v1/:path*",
        destination: `${baseBackend}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
