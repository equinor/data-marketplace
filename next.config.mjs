import withBundleAnalyzer from "@next/bundle-analyzer"

const getEnvironmentVariable = (environmentVariable) => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable]
  if (!unvalidatedEnvironmentVariable) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`,
    )
  } else {
    return unvalidatedEnvironmentVariable
  }
}

const withBundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["equinor.collibra.com", "gfx.nrk.no"],
  },
  rewrites: async () => [
    {
      source: "/api/collibra/:path*",
      destination: `${getEnvironmentVariable("NEXT_PUBLIC_COLLIBRA_BASE_URL")}/:path*`,
    },
  ],
}

export default withBundle(nextConfig)
