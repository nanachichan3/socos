// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ['@socos/shared'],
  async rewrites() {
    return [
      // Proxy /api/* to NestJS backend
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
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
