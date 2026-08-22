import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // ── Image Optimization ────────────────────────────────────────────────────
  // Allow Next.js <Image> to optimize images from S3, Cloudflare R2, Cloudinary,
  // local CMS servers (ports 5000, 5001, etc.), and external CDN domains.
  images: {
    remotePatterns: [
      // Local development servers (CMS backend on 5000, Storefront backend on 5001, etc.)
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
      },
      // AWS S3 buckets
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      // Cloudflare R2 / Workers CDN
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Imgix
      {
        protocol: 'https',
        hostname: '**.imgix.net',
      },
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // General HTTP & HTTPS fallback for dynamic merchant images
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
