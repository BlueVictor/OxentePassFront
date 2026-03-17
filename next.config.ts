import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: `${process.env.AWS_BUCKET_NAME}`,
    },
  ],
},
};

export default nextConfig;
