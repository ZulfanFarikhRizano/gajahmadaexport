import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTrafficSummary } from "@/lib/analytics-store";
import { TrafficCharts } from "@/components/admin/traffic-charts";

export default async function AnalyticsPage() {
  const summary = await getTrafficSummary(30);

  return (
    <main className="min-h-screen bg-cream-50">
      <header className="flex items-center justify-between border-b border-clay-950/10 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-clay-600 hover:text-terracotta-600" aria-label="Kembali ke dashboard">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-lg font-medium text-clay-950">Traffic Pengunjung</h1>
        </div>
        <span className="text-xs text-clay-500">30 hari terakhir</span>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <TrafficCharts summary={summary} />
      </div>
    </main>
  );
}