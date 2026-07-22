import { useState } from "react";
import { motion } from "framer-motion";
import { Timer, KeyRound } from "lucide-react";
import api from "../lib/api";

export default function WaiterOrderCard({ order, onEnded }) {
  const [ending, setEnding] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitPin(e) {
    e.preventDefault();
    setError("");
    if (!/^\d{4}$/.test(pin)) {
      setError("Enter the 4-digit PIN");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/orders/${order.orderId || order._id}/end`, { pin });
      onEnded(order.orderId || order._id);
    } catch (err) {
      setError(err.response?.data?.error || "Could not end the order");
    } finally {
      setSubmitting(false);
    }
  }

  const minutesAgo = Math.max(0, Math.round((Date.now() - new Date(order.createdAt)) / 60000));

  return (
    <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glow-panel rounded-xl border-2 border-ink/15 dark:border-ink-line bg-white dark:bg-ink-soft p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-display font-bold text-ink dark:text-paper">Table {order.tableNumber}</p>
        <span className="text-xs font-mono text-ink/40 dark:text-paper/40 flex items-center gap-1">
          <Timer size={11} /> {minutesAgo}m ago
        </span>
      </div>
      <div className="space-y-1 mb-3">
        {(order.items || []).map((it, i) => (
          <p key={i} className="text-sm text-ink/70 dark:text-paper/70">
            <span className="font-mono text-amber font-semibold">{it.quantity}×</span> {it.name}
          </p>
        ))}
      </div>

      {!ending ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setEnding(true)}
          className="w-full rounded-lg bg-amber text-ink text-sm font-display font-semibold py-2 border-2 border-ink hover:bg-amber-deep hover:text-paper transition-colors flex items-center justify-center gap-1.5"
        >
          <KeyRound size={14} /> End order
        </motion.button>
      ) : (
        <form onSubmit={submitPin} className="flex flex-col gap-2">
          <input
            autoFocus
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="4-digit PIN"
            className="w-full rounded-lg bg-paper-dim dark:bg-ink border-2 border-ink/15 dark:border-ink-line text-ink dark:text-paper font-mono text-center text-lg tracking-[0.3em] py-2 focus:outline-none focus:border-amber"
          />
          {error && <p className="text-danger text-xs">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEnding(false);
                setPin("");
                setError("");
              }}
              className="flex-1 rounded-lg border-2 border-ink/15 dark:border-ink-line text-ink/60 dark:text-paper/60 text-sm py-2 hover:text-ink dark:hover:text-paper transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-amber text-ink border-2 border-ink text-sm font-display font-semibold py-2 disabled:opacity-60"
            >
              {submitting ? "Checking…" : "Confirm"}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
