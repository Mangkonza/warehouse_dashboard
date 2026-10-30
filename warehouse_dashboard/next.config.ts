import type { NextConfig } from "next";

const basePath = (process.env.BASE_PATH ?? '').trim();
const normalizedBasePath = basePath && basePath !== '/' ? basePath : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: normalizedBasePath,
  assetPrefix: normalizedBasePath,
  env: {
    BASE_PATH: normalizedBasePath || '',
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
    // Resolved at build time into routes-manifest.json in Next.js standalone mode
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
