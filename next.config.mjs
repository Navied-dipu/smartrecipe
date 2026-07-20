/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const nextConfig = {
  // Proxy every /api/* request (including Better Auth's /api/auth/*) to the
  // Express backend. This keeps the browser on the same origin (localhost:3000),
  // so the Better Auth session cookie set by the backend is shared by all
  // protected recipe/AI endpoints and CORS is a non-issue.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
