/** @type {import('next').NextConfig} */
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

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  rewrites: async () => [
    {
      source: "/api/collibra/:path*",
      destination: getEnvironmentVariable("NEXT_PUBLIC_COLLIBRA_BASE_URL"),
    },
  ],
}

module.exports = nextConfig
