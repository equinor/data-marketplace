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
  publicRuntimeConfig: {
    MY_VAR: process.env.APP_INSIGHTS_CONNECTION_STRING,
  },
}

export default withBundle(nextConfig)
