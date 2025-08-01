import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.google.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'elektra.vtexassets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
            {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
