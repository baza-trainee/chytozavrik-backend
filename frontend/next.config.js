/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost:8000',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
