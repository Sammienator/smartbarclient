import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

export default function CartBar({ cart, onRemove, onPlaceOrder, placing }) {
  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
  const count = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <AnimatePresence>
      {cart.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 bg-ink text-paper rounded-t-3xl border-t-3 border-x-3 border-ink shadow-pop-lg px-5 pt-4 pb-5 z-40"
        >
          <div className="h-1.5 w-12 rounded-full urban-gradient mx-auto mb-3" aria-hidden="true" />
          <div className="max-w-lg mx-auto">
            <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
              {cart.map((c) => (
                <div key={c.menuItemId} className="flex justify-between items-center text-sm">
                  <span className="text-paper/80">
                    <span className="font-mono text-amber font-semibold">{c.quantity}×</span> {c.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-paper/60">KES {c.price * c.quantity}</span>
                    <button
                      onClick={() => onRemove(c.menuItemId)}
                      aria-label={`Remove ${c.name} from cart`}
                      className="text-paper/40 hover:text-danger transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: 1, x: 1 }}
              onClick={onPlaceOrder}
              disabled={placing}
              className="w-full rounded-xl bg-amber text-ink font-display font-bold py-3.5 flex items-center justify-center gap-2 border-3 border-paper/20 shadow-pop hover:bg-amber-deep hover:text-paper transition-colors disabled:opacity-60"
            >
              {placing ? (
                "Placing order…"
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Place order · {count} item{count === 1 ? "" : "s"} · KES {total}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
