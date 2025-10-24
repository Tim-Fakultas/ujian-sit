import type { NextConfig } from "next";

import withBundleAnalyzer from "@next/bundle-analyzer";

const WithBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {};

export default WithBundleAnalyzer(nextConfig);
