/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8090/api/:path*', // 代理到后端API
      },
      {
        source: '/users/:path*',
        destination: 'http://localhost:8090/users/:path*', // 代理用户API
      }
    ]
  }
};

module.exports = nextConfig; 