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

  return (
    <div className="rounded-xl border border-ink-line bg-ink-soft p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-display font-semibold text-paper">Table {order.tableNumber}</p>
        <span className="text-xs font-mono text-paper/40">{minutesAgo}m ago</span>
      </div>
      <div className="space-y-2">
        {(order.items || []).map((item) => (
          <div
            key={item.itemId}
            className="flex items-center justify-between rounded-lg bg-ink/40 px-3 py-2"
          >
            <span className="text-sm text-paper/80">
              {item.quantity} × {item.name}
            </span>
            <button
              onClick={() => markReady(item.itemId)}
              className="text-xs font-medium rounded-md bg-amber text-ink px-2.5 py-1.5 hover:bg-amber/90 transition-colors"
            >
              Mark ready
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
