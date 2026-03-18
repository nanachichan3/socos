// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ['@ts-monorepo-boilerplate/common'],
  async rewrites() {
    return [
      // Proxy /api/* to NestJS backend
      {
        source: '/api/:path*',
        destination: 'http://socos-api:3000/:path*',
      },
      // React platform (not mobile)
      {
        source: '/platform/:path*',
        destination: 'http://socos-platform:5173/:path*',
      },
    ]
  },
}

export default nextConfig
