/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Mengabaikan error TypeScript saat build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Mengabaikan error ESLint saat build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
