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
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // ⚡ Tambahkan rewrites untuk link PDF profesional ⚡
  async rewrites() {
    return [
      {
        source: "/catalog.pdf",
        destination:
          "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads/1789131095417-619477.pdf",
      },
      {
        source: "/e-catalog",
        destination:
          "https://vofsmretmpxinnkfiqsk.supabase.co/storage/v1/object/public/uploads/1789131095417-619477.pdf",
      },
    ];
  },
};

export default nextConfig;