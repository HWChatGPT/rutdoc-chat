/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // optional for Vercel optimization
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig;
