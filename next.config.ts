import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  poweredByHeader: false,
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
