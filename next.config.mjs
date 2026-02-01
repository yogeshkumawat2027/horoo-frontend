/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds to avoid circular dependency issues
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
