/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chytozavryk.top',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
