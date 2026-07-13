import { useState } from "react";
import { motion } from "framer-motion";

export default function MenuItemCard({ item, onAdd }) {
  const [qty, setQty] = useState(1);

  const safeItem = item || {};
  const outOfStock = safeItem.stockQty <= 0;
  const lowStock = !outOfStock && safeItem.stockQty <= 5;

  function decrement() {
    setQty((q) => Math.max(1, q - 1));
  }
  function increment() {
    setQty((q) => Math.min(safeItem.stockQty || 1, q + 1));
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="rounded-2xl bg-white border border-ink/10 p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-square w-full rounded-xl bg-paper-dim overflow-hidden flex items-center justify-center mb-3">
        {safeItem.imageUrl ? (
          <img src={safeItem.imageUrl} alt={safeItem.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-ink/25 text-xs font-mono">no image</span>
        )}
      </div>

      <p className="font-display font-semibold text-ink text-sm leading-tight mb-1 truncate">
        {safeItem.name || "Unknown Item"}
      </p>

      <div className="flex items-center justify-between mb-3">
        <span className="text-ink/60 text-sm font-mono">
          KES {safeItem.price || 0}
        </span>
        <span
          className={
            "text-xs font-mono " +
            (outOfStock ? "text-ink/35" : lowStock ? "text-danger" : "text-ink/40")
          }
        >
          {outOfStock ? "sold out" : `${safeItem.stockQty || 0} left`}
        </span>
      </div>

      {outOfStock ? (
        <button
          disabled
          className="w-full rounded-lg bg-ink/5 text-ink/35 text-sm font-medium py-2 cursor-not-allowed mt-auto"
        >
          Unavailable
        </button>
      ) : (
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={decrement}
              className="w-7 h-7 rounded-lg border border-ink/15 text-ink hover:bg-ink/5 transition-colors text-sm"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-mono text-ink">{qty}</span>
            <button
              onClick={increment}
              className="w-7 h-7 rounded-lg border border-ink/15 text-ink hover:bg-ink/5 transition-colors text-sm"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onAdd(safeItem, qty)}
            className="w-full rounded-lg bg-ink text-paper text-sm font-medium py-2 hover:bg-ink/85 transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </motion.div>
  );
}