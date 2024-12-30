import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cloudflare-ipfs.com",
      "loremflickr.com",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
