import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use standalone output for Docker/VPS; Vercel optimizes serverless functions natively
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow external images if needed for avatars or attachments
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
