import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-portfolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
