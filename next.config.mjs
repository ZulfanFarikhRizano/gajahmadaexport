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

export default nextConfig;