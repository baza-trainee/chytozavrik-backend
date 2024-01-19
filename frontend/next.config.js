/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost:6501',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
