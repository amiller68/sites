/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jax.alexplain.me",
      },
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3001",
  },
};

module.exports = nextConfig;
