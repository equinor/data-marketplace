import withBundleAnalyzer from "@next/bundle-analyzer"

const withBundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    appDir: true,
  },
  compiler: {
    styledComponents: true,
  },
}

export default withBundle(nextConfig)
