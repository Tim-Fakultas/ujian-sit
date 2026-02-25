import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";

const WithBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  allowedDevOrigins: ["192.168.100.181", "172.17.0.1"],
};

export default WithBundleAnalyzer(nextConfig);
