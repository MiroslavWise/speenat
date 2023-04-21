/** @type {import('next').NextConfig} */

const withPrefix = (prefix, staticAssetPath) => {
  const assetsUrl = new URL(staticAssetPath, prefix).toString()
  return {
    assetPrefix: assetsUrl.startsWith('//') ? `https:${assetsUrl}` : assetsUrl
  }
}

const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGE]
  },
}

module.exports = nextConfig
