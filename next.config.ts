import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/browse.html", destination: "/browse", permanent: true },
      { source: "/auth.html", destination: "/auth", permanent: true },
      { source: "/safety.html", destination: "/safety", permanent: true },
      {
        source: "/listings/:id.html",
        destination: "/listings/:id",
        permanent: true,
      },
      {
        source: "/browse@make=:make.html",
        destination: "/browse?make=:make",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
