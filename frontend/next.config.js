/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '35.180.254.37',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
