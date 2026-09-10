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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vofsmretmpxinnkfiqsk.supabase.co",
      },
    ],
  },
};

export default nextConfig;