import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false; // Disable caching during development
    }
    return config;
  },
};