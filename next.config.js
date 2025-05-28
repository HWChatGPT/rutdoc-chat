/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optional for Vercel optimization
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig;
