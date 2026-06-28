const withPWA = require("next-pwa")({
  dest: "public",
  disable: true,
  register: false,
  skipWaiting: true,
});

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "api.kamping.az" },
      { protocol: "http", hostname: "api.kamping.az" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = withPWA(nextConfig);