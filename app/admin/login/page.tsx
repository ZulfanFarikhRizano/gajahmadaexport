"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login gagal.");
      return;
    }

    router.push("/admin/dashboard");
  };

  // Fungsi handleLogout yang mengarahkan langsung ke Home ("/")
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-clay-950 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="font-display text-xl font-medium text-clay-950">
          Admin Login
        </h1>
        <p className="mt-1 text-sm text-clay-600">
          Kelola konten dan produk website.
        </p>

        <label className="mt-6 block text-sm font-medium text-clay-800">
          Password
        </label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-clay-950/20 px-3 py-2 outline-none focus:border-terracotta-600"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-terracotta-600 py-2.5 font-medium text-white hover:bg-clay-800 disabled:opacity-60"
        >
          {loading ? "Memeriksa..." : "Masuk"}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full text-center text-xs text-clay-600 hover:text-terracotta-600"
        >
          Sudah login di sesi lain? Keluar dari sesi ini
        </button>
      </form>
    </main>
  );
}