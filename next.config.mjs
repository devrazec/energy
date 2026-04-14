/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/energy',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
