/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {

        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {

        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",

      },
    ],
  },

}

module.exports = nextConfig
