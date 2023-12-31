/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'ec2-15-236-206-53.eu-west-3.compute.amazonaws.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
