/** @type {import('next').NextConfig} */
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';

const nextConfig = {
  reactStrictMode: true,
  output: isGhPages ? 'export' : undefined,
  basePath: isGhPages ? '/forma-bureau' : '',
  assetPrefix: isGhPages ? '/forma-bureau/' : '',
  trailingSlash: isGhPages,
  images: { unoptimized: isGhPages },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? '/forma-bureau' : ''
  },
  experimental: {
    optimizePackageImports: ['gsap']
  }
};

export default nextConfig;
