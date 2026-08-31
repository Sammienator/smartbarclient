import { motion } from "framer-motion";
import { Check, Timer } from "lucide-react";
import api from "../lib/api";

export default function StationOrderCard({ station, order, onItemReady }) {
  async function markReady(itemId) {
    try {
      await api.post(`/stations/${station}/orders/${order.orderId}/items/${itemId}/ready`);
      // No local state update needed here - the server broadcasts
      // station:itemReady back to this same room, which the parent page
      // is already listening for.
    } catch (err) {
      onItemReady(err.response?.data?.error || "Could not mark this item ready");
    }
  }

  const minutesAgo = Math.max(0, Math.round((Date.now() - new Date(order.createdAt)) / 60000));
  const urgent = minutesAgo >= 10;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glow-panel rounded-xl border-2 bg-white dark:bg-ink-soft p-4 ${urgent ? "border-danger" : "border-ink/15 dark:border-ink-line"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="font-display font-bold text-ink dark:text-paper">Table {order.tableNumber}</p>
        <span
          className={`text-xs font-mono flex items-center gap-1 px-2 py-0.5 rounded-md ${
            urgent ? "text-danger bg-danger/10" : "text-ink/40 dark:text-paper/40"
          }`}
        >
          <Timer size={11} /> {minutesAgo}m ago
        </span>
      </div>
      <div className="space-y-2">
        {(order.items || []).map((item) => (
          <div
            key={item.itemId}
            className="flex items-center justify-between rounded-lg bg-paper-dim dark:bg-ink border border-ink/15 dark:border-ink-line px-3 py-2"
          >
            <span className="text-sm text-ink/80 dark:text-paper/80">
              <span className="font-mono text-amber font-semibold">{item.quantity}×</span> {item.name}
            </span>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => markReady(item.itemId)}
              className="text-xs font-display font-semibold rounded-md bg-moss text-ink px-2.5 py-1.5 border-2 border-ink hover:brightness-105 transition-all flex items-center gap-1"
            >
              <Check size={12} strokeWidth={3} /> Ready
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
