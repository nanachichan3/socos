// @ts-check

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ['@socos/shared'],
  turbopack: {
    root: resolve(__dirname, '../..'),
  },
  // Nginx handles all routing - use relative paths
  // These rewrites are for SSR and internal Next.js routing
  async rewrites() {
    return [
      // API routes are handled by nginx reverse proxy on same host
      // No rewrites needed - client goes to /api/* which nginx routes to NestJS
    ]
  },
}

export default nextConfig