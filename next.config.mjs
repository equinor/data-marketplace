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
    myRuntimeEnv: process.env.COLLIBRA_BASE_URL, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    publicRuntimeEnv: process.env.COLLIBRA_BASE_URL,
  },
}

export default withBundle(nextConfig)
