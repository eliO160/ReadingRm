//config for Next.js to handle API rewrites
const API_URL = process.env.API_URL || 'http://localhost:5051';

/** @type {import('next').NextConfig} */

const nextConfig = {
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
