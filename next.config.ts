import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The café lived at /cafe while it was being built; old links still work.
  async redirects() {
    return [{ source: "/cafe", destination: "/", permanent: true }];
  },
};

export default nextConfig;
