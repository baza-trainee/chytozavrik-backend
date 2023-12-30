/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '172.19.0.4',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
