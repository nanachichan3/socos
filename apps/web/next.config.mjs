// @ts-check

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@socos/shared'],
  turbopack: {
    root: resolve(__dirname, '../..'),
  },
  async rewrites() {
    const apiHost = process.env.API_INTERNAL_URL || 'http://localhost:3001'
    const platformHost = process.env.PLATFORM_INTERNAL_URL || 'http://localhost:5173'
    return [
      {
        source: '/api/:path*',
        destination: `${apiHost}/:path*`,
      },
      {
        source: '/platform',
        destination: `${platformHost}/platform/`,
      },
      {
        source: '/platform/:path*',
        destination: `${platformHost}/platform/:path*`,
      },
    ]
  },
}

export default nextConfig
