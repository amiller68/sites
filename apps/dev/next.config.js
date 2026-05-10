/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output for Node.js server with ISR support
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "autonomous-images.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d3s5tvvri2obkg.cloudfront.net",
      },
    ],
  },
  env: {
    // default base url
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  },
};

module.exports = nextConfig;
