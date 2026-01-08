import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";

const WithBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  allowedDevOrigins: ["10.1.117.234"],
};

export default WithBundleAnalyzer(nextConfig);
