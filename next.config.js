/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  rewrites: async () => [
    {
      source: "/api/collibra/:path*",
      destination: process.env.NEXT_PUBLIC_COLLIBRA_BASE_URL ?? "",
    },
  ],
}

module.exports = nextConfig
