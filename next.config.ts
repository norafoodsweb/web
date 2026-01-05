import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      new URL(
        "https://knqxqidenvvncnamdnwn.supabase.co/storage/v1/object/public/productimg/**"
      ),
    ],
  },
};

export default nextConfig;
