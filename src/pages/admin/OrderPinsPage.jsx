import { useEffect, useState } from "react";
import api from "../../lib/api";
import { socket } from "../../lib/socket";
import Section from "../../components/Section";

export default function OrderPinsPage() {
  const [orders, setOrders] = useState([]);

  function load() {
    api.get("/admin/orders/active").then((res) => setOrders(res.data));
  }

  useEffect(() => {
    load();
    socket.emit("join:admin");
    socket.on("order:completed", load);
    const interval = setInterval(load, 15000); // catch new orders even without a live event
    return () => {
      socket.off("order:completed", load);
      clearInterval(interval);
    };
  }, []);

  return (
    <Section title="Order PINs (forgot-PIN lookup)">
      <p className="text-xs text-ink/40 mb-3">
        For staff use only - look up a guest's PIN here if they've misplaced it.
      </p>
      {orders.length === 0 ? (
        <p className="text-ink/40 text-sm">No active orders right now.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide">
              <th className="pb-2">Table</th>
              <th className="pb-2">PIN</th>
              <th className="pb-2">Waiter</th>
              <th className="pb-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId} className="border-t border-ink/5">
                <td className="py-2 text-ink">{o.tableNumber}</td>
                <td className="py-2 font-mono font-semibold text-amber-deep tracking-widest">{o.pin}</td>
                <td className="py-2 text-ink/70">{o.waiterName}</td>
                <td className="py-2 text-ink/50">
                  {o.items.map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}
