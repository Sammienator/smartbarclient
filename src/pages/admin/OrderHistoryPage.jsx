import { useEffect, useState } from "react";
import api from "../../lib/api";
import Section from "../../components/Section";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function load() {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    api.get("/admin/orders/history", { params }).then((res) => setOrders(res.data));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  return (
    <Section title="Order history">
      <p className="text-xs text-ink/40 mb-3">
        A permanent record of every completed order, most recent first, with the time it was placed and the time it was closed out.
      </p>
      <div className="flex gap-2 mb-4 items-end">
        <label className="text-xs text-ink/50">
          From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="block border border-ink/15 rounded-lg px-2 py-1 mt-1" />
        </label>
        <label className="text-xs text-ink/50">
          To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="block border border-ink/15 rounded-lg px-2 py-1 mt-1" />
        </label>
        <button onClick={load} className="rounded-lg bg-ink text-paper text-sm px-3 py-1.5">Filter</button>
      </div>
      {orders.length === 0 ? (
        <p className="text-ink/40 text-sm">No completed orders in this range yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wide">
                <th className="pb-2">Table</th>
                <th className="pb-2">Waiter</th>
                <th className="pb-2">Items</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Placed</th>
                <th className="pb-2">Closed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId} className="border-t border-ink/5">
                  <td className="py-2 text-ink">{o.tableNumber}</td>
                  <td className="py-2 text-ink/70">{o.waiterName}</td>
                  <td className="py-2 text-ink/50">
                    {o.items.map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                  </td>
                  <td className="py-2 font-mono text-ink/70">KES {o.totalAmount}</td>
                  <td className="py-2 font-mono text-ink/50 text-xs">
                    {new Date(o.placedAt).toLocaleString()}
                  </td>
                  <td className="py-2 font-mono text-ink/50 text-xs">
                    {new Date(o.completedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
