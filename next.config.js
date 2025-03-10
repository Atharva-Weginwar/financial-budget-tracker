/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  // Server Actions are available by default in Next.js 14.1.0+
  experimental: {
    // Remove serverActions as it's now available by default
  },
};

module.exports = nextConfig; 