"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClipboardList, X, Minus, Plus, Trash2, Send } from "lucide-react";
import { useQuoteCart } from "@/lib/quote-cart";
import { buildQuoteWhatsAppLink } from "@/lib/whatsapp";

export function QuoteCartDrawer({ waNumber }: { waNumber: string }) {
  const { items, removeItem, updateQty, clear } = useQuoteCart();
  const [open, setOpen] = useState(false);

  if (items.length === 0 && !open) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full bg-clay-950 px-4 py-3 text-white shadow-lg hover:bg-clay-800"
      >
        <ClipboardList size={18} />
        <span className="text-sm font-medium">Quote ({items.length})</span>
      </button>

      <AnimatePresence>
        {open && (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[110] bg-clay-950/40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-[120] h-full w-full max-w-sm bg-white shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-clay-950/10 px-5 py-4">
                <h2 className="font-display text-lg text-clay-950">Permintaan Penawaran</h2>
                <button onClick={() => setOpen(false)} aria-label="Tutup">
                  <X size={20} className="text-clay-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {items.length === 0 ? (
                  <p className="text-sm text-clay-600">
                    Belum ada produk. Buka halaman detail produk lalu klik &quot;Tambah ke Quote&quot;.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b border-clay-950/5 pb-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-clay-950 truncate">{item.name}</p>
                        <p className="text-xs text-clay-500">{item.id}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="rounded-full border border-clay-950/20 p-1 hover:border-terracotta-600"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="rounded-full border border-clay-950/20 p-1 hover:border-terracotta-600"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Hapus"
                        className="text-clay-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-clay-950/10 p-5 space-y-2">
                  <a
                    href={buildQuoteWhatsAppLink(waNumber, items)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-600 py-3 text-sm font-medium text-white hover:bg-clay-800"
                  >
                    <Send size={16} />
                    Kirim Permintaan via WhatsApp
                  </a>
                  <button
                    onClick={clear}
                    className="w-full text-center text-xs text-clay-500 hover:text-red-600"
                  >
                    Kosongkan daftar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}