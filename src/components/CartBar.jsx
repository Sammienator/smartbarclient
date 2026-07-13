import { motion } from "framer-motion";

export default function CartBar({ cart = [], onRemove, onPlaceOrder, placing }) {
  // Ensure cart is always an array
  const safeCart = Array.isArray(cart) ? cart : [];

  const total = safeCart.reduce((sum, c) => sum + (c.price || 0) * (c.quantity || 0), 0);
  const count = safeCart.reduce((sum, c) => sum + (c.quantity || 0), 0);

  if (safeCart.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ink text-paper rounded-t-2xl shadow-2xl px-5 pt-4 pb-5 z-40">
      <div className="max-w-lg mx-auto">
        <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
          {safeCart.map((c) => (
            <div key={c.menuItemId} className="flex justify-between items-center text-sm">
              <span className="text-paper/80">
                {c.quantity} × {c.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-paper/60">
                  KES {(c.price || 0) * (c.quantity || 0)}
                </span>
                <button
                  onClick={() => onRemove(c.menuItemId)}
                  className="text-paper/40 hover:text-paper text-xs"
                >
                  remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onPlaceOrder}
          disabled={placing}
          className="w-full rounded-lg bg-amber text-ink font-display font-semibold py-3 flex items-center justify-center gap-2 hover:bg-amber/90 transition-colors disabled:opacity-60"
        >
          {placing 
            ? "Placing order…" 
            : `Place order · ${count} item${count === 1 ? "" : "s"} · KES ${total}`}
        </button>
      </div>
    </div>
  );
}