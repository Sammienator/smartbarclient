import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Flame } from "lucide-react";

export default function MenuItemCard({ item, onAdd }) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = item.stockQty <= 0;
  const lowStock = !outOfStock && item.stockQty <= 5;

  function decrement() {
    setQty((q) => Math.max(1, q - 1));
  }
  function increment() {
    setQty((q) => Math.min(item.stockQty, q + 1));
  }
  function handleAdd() {
    onAdd(item, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 550);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl bg-white dark:bg-ink-soft border-3 border-ink dark:border-ink-line p-3 flex flex-col shadow-pop hover:shadow-pop-lg transition-shadow"
    >
      {lowStock && (
        <span className="tag-sticker absolute -top-2.5 -right-2.5 z-10 bg-danger text-paper text-[10px] font-tag px-2 py-1 rounded-md border-2 border-ink shadow-pop-sm flex items-center gap-1">
          <Flame size={10} /> {item.stockQty} left
        </span>
      )}

      <div className="aspect-square w-full rounded-xl bg-paper-dim dark:bg-ink overflow-hidden flex items-center justify-center mb-3 border-2 border-ink/10 dark:border-ink-line">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-ink/25 dark:text-paper/25 text-xs font-mono">no image</span>
        )}
      </div>

      <p className="font-display font-bold text-ink dark:text-paper text-sm leading-tight mb-1 truncate">
        {item.name}
      </p>
      {item.description && (
        <p className="text-ink/45 dark:text-paper/45 text-xs leading-snug mb-2 line-clamp-2">
          {item.description}
        </p>
      )}
      <div className="flex items-center justify-between mb-3">
        <span className="text-ink dark:text-paper font-mono font-semibold text-sm">KES {item.price}</span>
        {!lowStock && (
          <span className={"text-xs font-mono " + (outOfStock ? "text-ink/35 dark:text-paper/35" : "text-ink/40 dark:text-paper/40")}>
            {outOfStock ? "sold out" : `${item.stockQty} left`}
          </span>
        )}
      </div>

      {outOfStock ? (
        <button
          disabled
          className="w-full rounded-lg bg-ink/5 dark:bg-paper/5 text-ink/35 dark:text-paper/35 text-sm font-medium py-2 cursor-not-allowed mt-auto border-2 border-ink/10 dark:border-paper/10"
        >
          Unavailable
        </button>
      ) : (
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={decrement}
              aria-label={`Decrease quantity of ${item.name}`}
              className="w-7 h-7 rounded-lg border-2 border-ink dark:border-ink-line text-ink dark:text-paper hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors flex items-center justify-center"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="w-5 text-center text-sm font-mono font-semibold text-ink dark:text-paper">{qty}</span>
            <button
              onClick={increment}
              aria-label={`Increase quantity of ${item.name}`}
              className="w-7 h-7 rounded-lg border-2 border-ink dark:border-ink-line text-ink dark:text-paper hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors flex items-center justify-center"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.96 }}
            animate={justAdded ? { backgroundColor: "#17C978" } : {}}
            className="w-full rounded-lg bg-ink text-paper text-sm font-display font-semibold py-2 border-2 border-ink dark:border-ink-line hover:bg-ink-soft transition-colors"
          >
            {justAdded ? "Added ✓" : "Add"}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
