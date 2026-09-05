"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface QuoteItem {
  id: string;
  name: string;
  category: string;
  qty: number;
}

interface QuoteCartContextValue {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "qty">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
}

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null);
const STORAGE_KEY = "gm_quote_cart";

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage tidak tersedia — cart tetap jalan untuk sesi ini.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((item: Omit<QuoteItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return (
    <QuoteCartContext.Provider value={{ items, addItem, removeItem, updateQty, clear }}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) throw new Error("useQuoteCart must be used within QuoteCartProvider");
  return ctx;
}