import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // For Phase 2: Add S3 bucket domains here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
    // Placeholder images for development
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
