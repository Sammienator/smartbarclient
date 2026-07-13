import { useState } from "react";
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
    <div className="rounded-xl border border-ink-line bg-ink-soft p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="font-display font-semibold text-paper">Table {order.tableNumber}</p>
        <span className="text-xs font-mono text-paper/40">{minutesAgo}m ago</span>
      </div>
      <div className="space-y-1 mb-3">
        {order.items.map((it, i) => (
          <p key={i} className="text-sm text-paper/70">
            {it.quantity} × {it.name}
          </p>
        ))}
      </div>

      {!ending ? (
        <button
          onClick={() => setEnding(true)}
          className="w-full rounded-lg bg-amber text-ink text-sm font-medium py-2 hover:bg-amber/90 transition-colors"
        >
          End order
        </button>
      ) : (
        <form onSubmit={submitPin} className="flex flex-col gap-2">
          <input
            autoFocus
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="4-digit PIN"
            className="w-full rounded-lg bg-ink border border-ink-line text-paper font-mono text-center text-lg tracking-[0.3em] py-2 focus:outline-none focus:border-amber"
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
              className="flex-1 rounded-lg border border-ink-line text-paper/60 text-sm py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-amber text-ink text-sm font-medium py-2 disabled:opacity-60"
            >
              {submitting ? "Checking…" : "Confirm"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
