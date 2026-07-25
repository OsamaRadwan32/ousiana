import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // TODO: replace with the Cloudflare R2 public hostname at Phase 4.
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
