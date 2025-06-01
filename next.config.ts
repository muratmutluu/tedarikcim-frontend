import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  ...(isDev
    ? {
        turbopack: {
          resolveAlias: {
            html2canvas: "html2canvas-pro",
          },
        },
      }
    : {
        webpack(config) {
          config.resolve.alias = {
            ...(config.resolve.alias ?? {}),
            html2canvas: "html2canvas-pro",
          };
          return config;
        },
      }),
};

export default nextConfig;
