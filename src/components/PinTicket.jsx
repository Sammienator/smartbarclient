import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export default function PinTicket({ order, onClose }) {
  const categoryLabel = order.category === "food" ? "Food" : order.category === "drink" ? "Drink" : null;

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-paper dark:bg-ink w-full max-w-sm rounded-2xl overflow-hidden border-3 border-ink dark:border-ink-line shadow-pop-lg"
      >
        <div className="bg-ink text-paper px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 urban-dots opacity-10 text-paper" aria-hidden="true" />
          <p className="relative font-tag text-[10px] tracking-widest text-amber uppercase flex items-center gap-1.5">
            <PartyPopper size={12} />
            {categoryLabel ? `${categoryLabel} order placed` : "Order placed"}
          </p>
          <p className="relative font-display font-bold text-lg mt-1">Table {order.tableNumber}</p>
        </div>

        <div className="relative px-6 pt-8 pb-6 text-center">
          <p className="text-ink/50 dark:text-paper/50 text-xs font-mono uppercase tracking-widest mb-2">
            Give this PIN to your waiter when your {categoryLabel ? categoryLabel.toLowerCase() : "order"} is complete
          </p>
          <p className="inline-block font-mono font-bold text-6xl tracking-[0.2em] text-ink dark:text-paper py-2 px-4 rounded-xl bg-amber border-3 border-ink dark:border-ink-line shadow-pop-sm rotate-[-1deg]">
            {order.pin}
          </p>
          <p className="text-ink/40 dark:text-paper/40 text-xs mt-3">Order #{String(order.orderId).slice(-6)}</p>
        </div>

        <div className="px-6 pb-6">
          <div className="border-t-2 border-dashed border-ink/20 pt-4 space-y-1.5 mb-5">
            {(order.items || []).map((it, i) => (
              <div key={i} className="flex justify-between text-sm text-ink/70 dark:text-paper/70">
                <span>{it.quantity} × {it.name}</span>
                <span className="font-mono">KES {it.price * it.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold text-ink dark:text-paper pt-2">
              <span>Total</span>
              <span className="font-mono">KES {order.totalAmount}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-ink text-paper text-sm font-display font-semibold py-3 border-3 border-ink dark:border-ink-line hover:bg-ink-soft transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
