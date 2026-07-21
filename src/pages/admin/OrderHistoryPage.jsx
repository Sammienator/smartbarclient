import { useEffect, useState } from "react";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";
import ReceiptModal from "../../components/ReceiptModal";

function timeCell(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [receiptOrder, setReceiptOrder] = useState(null);

  function load() {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    setError("");
    api
      .get("/admin/orders/history", { params })
      .then((res) => setOrders(asArray(res.data)))
      .catch(() => setError("Could not load order history. Is the backend reachable?"));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  return (
    <Section title="Order history" accent="electric">
      <p className="text-xs text-ink/40 mb-3">
        A permanent record of every completed order, most recent first — when it was placed, when
        the kitchen and bar each finished prepping their side, and when the waiter closed it out.
      </p>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <div className="flex gap-2 mb-4 items-end">
        <label className="text-xs text-ink/50">
          From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="block border-2 border-ink/15 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-ink" />
        </label>
        <label className="text-xs text-ink/50">
          To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="block border-2 border-ink/15 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-ink" />
        </label>
        <button onClick={load} className="rounded-lg bg-amber text-ink border-2 border-ink font-display font-semibold text-sm px-3 py-1.5">Filter</button>
      </div>
      {orders.length === 0 ? (
        <p className="text-ink/40 text-sm">No completed orders in this range yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b-2 border-ink/10">
                <th className="pb-2">Table</th>
                <th className="pb-2">Waiter</th>
                <th className="pb-2">Items</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Placed</th>
                <th className="pb-2">Kitchen ready</th>
                <th className="pb-2">Bar ready</th>
                <th className="pb-2">Closed</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId} className="border-t border-ink/5">
                  <td className="py-2 text-ink">{o.tableNumber}</td>
                  <td className="py-2 text-ink/70">{o.waiterName}</td>
                  <td className="py-2 text-ink/50">
                    {(o.items || []).map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                  </td>
                  <td className="py-2 font-mono text-ink/70">KES {o.totalAmount}</td>
                  <td className="py-2 font-mono text-ink/50 text-xs">{timeCell(o.placedAt)}</td>
                  <td className="py-2 font-mono text-ink/50 text-xs">{timeCell(o.kitchenReadyAt)}</td>
                  <td className="py-2 font-mono text-ink/50 text-xs">{timeCell(o.barReadyAt)}</td>
                  <td className="py-2 font-mono text-ink/50 text-xs">{timeCell(o.completedAt)}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => setReceiptOrder(o)}
                      className="text-xs rounded-lg bg-white border-2 border-ink/20 text-ink/70 px-2.5 py-1 hover:border-ink hover:text-ink transition-colors"
                    >
                      Print receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {receiptOrder && <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />}
    </Section>
  );
}
