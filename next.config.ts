import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  devIndicators: false,
  images: {
    unoptimized: true,
  },
}


export default nextConfig
