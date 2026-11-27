import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    return [
      {
        source: "/component/colors",
        destination: "/foundations",
        permanent: true,
      },
      {
        source: "/component/charts",
        destination: "/component/bar-chart",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
