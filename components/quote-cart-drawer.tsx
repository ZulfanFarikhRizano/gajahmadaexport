"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ClipboardList, X, Trash2, Send } from "lucide-react";
import { useQuoteCart } from "@/lib/quote-cart";
import { buildQuoteWhatsAppLink } from "@/lib/whatsapp";

export function QuoteCartDrawer({ waNumber }: { waNumber: string }) {
  const { items, removeItem, clear } = useQuoteCart();
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
              className="fixed left-0 top-0 z-[120] flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-clay-950/10 px-5 py-4">
                <h2 className="font-display text-lg text-clay-950">
                  Permintaan Penawaran Wholesale
                </h2>
                <button onClick={() => setOpen(false)} aria-label="Tutup">
                  <X size={20} className="text-clay-600" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <p className="text-sm text-clay-600">
                    Belum ada produk. Buka halaman detail produk lalu klik
                    &quot;Minta Penawaran&quot;.
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-clay-950/5 pb-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-clay-950">
                          {item.name}
                        </p>
                        <p className="text-xs text-clay-500">SKU/ID: {item.id}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Hapus"
                        className="ml-2 text-clay-400 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="space-y-2 border-t border-clay-950/10 p-5">
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