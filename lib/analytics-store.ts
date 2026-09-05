import "server-only";
import { supabaseAdmin } from "./supabase/admin";

export interface TrafficSummary {
  totalViews: number;
  bySource: { source: string; count: number }[];
  byDevice: { device: string; count: number }[];
  byPath: { path: string; count: number }[];
  byDay: { date: string; count: number }[];
}

// Interface untuk struktur baris tabel page_views
interface PageViewRow {
  path: string | null;
  referrer_source: string | null;
  device_type: string | null;
  created_at: string;
}

export async function getTrafficSummary(days = 30): Promise<TrafficSummary> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  // Berikan generic type <PageViewRow> ke method select()
  const { data, error } = await supabaseAdmin()
    .from("page_views")
    .select<string, PageViewRow>("path, referrer_source, device_type, created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  const rows: PageViewRow[] = data ?? [];

  const bySourceMap = new Map<string, number>();
  const byDeviceMap = new Map<string, number>();
  const byPathMap = new Map<string, number>();
  const byDayMap = new Map<string, number>();

  for (const row of rows) {
    // Beri fallback default string jika nilai kolom di DB bertipe null
    const source = row.referrer_source ?? "direct";
    const device = row.device_type ?? "unknown";
    const path = row.path ?? "/";

    bySourceMap.set(source, (bySourceMap.get(source) ?? 0) + 1);
    byDeviceMap.set(device, (byDeviceMap.get(device) ?? 0) + 1);
    byPathMap.set(path, (byPathMap.get(path) ?? 0) + 1);

    const day = String(row.created_at).slice(0, 10);
    byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1);
  }

  return {
    totalViews: rows.length,
    bySource: [...bySourceMap.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count),
    byDevice: [...byDeviceMap.entries()]
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count),
    byPath: [...byPathMap.entries()]
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    byDay: [...byDayMap.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}