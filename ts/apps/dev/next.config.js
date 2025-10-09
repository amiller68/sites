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
    ],
  },
  env: {
    // default base url
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  },
};

module.exports = nextConfig;
