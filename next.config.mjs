/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Image optimization — allow Cloudinary images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Webpack configuration for viem/wagmi compatibility
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
