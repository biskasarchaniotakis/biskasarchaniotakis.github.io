import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
