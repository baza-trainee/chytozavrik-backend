/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'backendhost',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
