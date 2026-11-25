import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable styled-components SWC transform (webpack)
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: false,
    },
  },
  // Disable Turbopack for dev — use webpack instead
  // (Turbopack does not yet support the styledComponents SWC plugin)
  turbopack: undefined,
};

export default nextConfig;
