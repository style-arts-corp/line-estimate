import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'build'
};

export default nextConfig;
