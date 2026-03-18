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
      // React platform app
      {
        source: '/platform/:path*',
        destination: 'http://localhost:5173/platform/:path*',
      },
    ]
  },
}

export default nextConfig
