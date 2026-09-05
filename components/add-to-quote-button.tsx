"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useQuoteCart } from "@/lib/quote-cart";

export function AddToQuoteButton({ id, name, category }: { id: string; name: string; category: string }) {
  const { addItem } = useQuoteCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      onClick={() => {
        addItem({ id, name, category });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-clay-950/20 px-5 py-2.5 text-sm font-medium text-clay-800 hover:border-terracotta-600 hover:text-terracotta-600"
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? "Ditambahkan" : "Tambah ke Quote"}
    </button>
  );
}