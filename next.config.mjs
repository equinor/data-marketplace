import withBundleAnalyzer from "@next/bundle-analyzer"

const withBundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  serverRuntimeConfig: {
    firstTimeVisitor: process.env.COLLIBRA_FIRST_TIME_VISITOR,
  },
}

export default withBundle(nextConfig)
