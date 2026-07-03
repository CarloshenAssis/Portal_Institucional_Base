import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Wildcard: casa com o bucket de qualquer projeto Supabase novo, sem
        // precisar editar este arquivo a cada cliente/deploy.
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
