"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Users, Globe2, Smartphone, FileText, type LucideIcon } from "lucide-react";
import type { TrafficSummary } from "@/lib/analytics-store";

const SOURCE_COLORS: Record<string, string> = {
  Direct: "#6B4A34",
  Google: "#A85C3F",
  Facebook: "#4267B2",
  Instagram: "#C13584",
  WhatsApp: "#25D366",
  "Twitter/X": "#14171A",
  TikTok: "#010101",
  Bing: "#008373",
};
const FALLBACK_COLOR = "#B8935A";

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-clay-950/5">
      <div className="flex items-center gap-2 text-clay-500 mb-1">
        <Icon size={16} />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display text-2xl text-clay-950">{value}</p>
    </div>
  );
}

export function TrafficCharts({ summary }: { summary: TrafficSummary }) {
  const topSource = summary.bySource[0];
  const topDevice = summary.byDevice[0];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Users} label="Total Kunjungan" value={summary.totalViews} />
        <StatCard icon={Globe2} label="Sumber Terbesar" value={topSource?.source ?? "-"} />
        <StatCard icon={Smartphone} label="Device Terbanyak" value={topDevice?.device ?? "-"} />
        <StatCard icon={FileText} label="Halaman Terpantau" value={summary.byPath.length} />
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-clay-950/5">
        <h2 className="font-display text-base text-clay-950 mb-4">Tren Kunjungan Harian</h2>
        {summary.byDay.length === 0 ? (
          <p className="text-sm text-clay-500">Belum ada data. Grafik akan terisi begitu situs mulai dikunjungi.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={summary.byDay}>
              <defs>
                <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A85C3F" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#A85C3F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E201814" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B4A34" }} tickFormatter={(d) => String(d).slice(5)} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6B4A34" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2E201820", fontSize: 13 }} labelStyle={{ color: "#2E2018" }} />
              <Area type="monotone" dataKey="count" stroke="#A85C3F" strokeWidth={2} fill="url(#trafficFill)" name="Kunjungan" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-clay-950/5">
          <h2 className="font-display text-base text-clay-950 mb-4">Sumber Trafik</h2>
          {summary.bySource.length === 0 ? (
            <p className="text-sm text-clay-500">Belum ada data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, summary.bySource.length * 36)}>
              <BarChart data={summary.bySource} layout="vertical" margin={{ left: 24 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" width={100} tick={{ fontSize: 12, fill: "#2E2018" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2E201820", fontSize: 13 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                  {summary.bySource.map((entry, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[entry.source] ?? FALLBACK_COLOR} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-clay-950/5">
          <h2 className="font-display text-base text-clay-950 mb-4">Perangkat Pengunjung</h2>
          {summary.byDevice.length === 0 ? (
            <p className="text-sm text-clay-500">Belum ada data.</p>
          ) : (
            <div className="space-y-3">
              {summary.byDevice.map((d) => {
                const pct = summary.totalViews > 0 ? Math.round((d.count / summary.totalViews) * 100) : 0;
                return (
                  <div key={d.device}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-clay-800">{d.device}</span>
                      <span className="text-clay-500">{d.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-cream-100 overflow-hidden">
                      <div className="h-full rounded-full bg-brass-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-clay-950/5">
        <h2 className="font-display text-base text-clay-950 mb-4">Halaman Paling Sering Dikunjungi</h2>
        {summary.byPath.length === 0 ? (
          <p className="text-sm text-clay-500">Belum ada data.</p>
        ) : (
          <div className="divide-y divide-clay-950/5">
            {summary.byPath.map((p, i) => (
              <div key={p.path} className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-sm text-clay-800">
                  <span className="text-clay-400 w-4">{i + 1}</span>
                  {p.path}
                </span>
                <span className="text-sm font-medium text-terracotta-600">{p.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}