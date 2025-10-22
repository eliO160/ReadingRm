//config for Next.js to handle API rewrites
/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // load root .env

const nextConfig = {
  images: {
    // Allow external images for covers, etc.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gutenberg.org',
        pathname: '/cache/epub/**',
      },
    ],
  },
    
  async rewrites() { //redirect the /api requests to the backend server at port 5051
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*` // Proxy to Backend API
      }
    ];
  }
};

export default nextConfig;
