import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import api from "../../lib/api";
import { socket } from "../../lib/socket";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

export default function OrderPinsPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  function load() {
    api
      .get("/admin/orders/active")
      .then((res) => {
        setOrders(asArray(res.data));
        setError("");
      })
      .catch(() => setError("Could not load active orders. Is the backend reachable?"));
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
    <Section title="Order PINs (forgot-PIN lookup)" accent="copper">
      <p className="text-xs text-ink/40 dark:text-paper/40 mb-3">
        For staff use only - look up a guest's PIN here if they've misplaced it.
      </p>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-ink/40 dark:text-paper/40 text-sm">No active orders right now.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 dark:text-paper/40 text-xs uppercase tracking-wide border-b-2 border-ink/10">
              <th className="pb-2">Table</th>
              <th className="pb-2">PIN</th>
              <th className="pb-2">Waiter</th>
              <th className="pb-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId} className="border-t border-ink/5">
                <td className="py-2 text-ink dark:text-paper font-medium">{o.tableNumber}</td>
                <td className="py-2">
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-ink dark:text-paper tracking-widest bg-amber/30 border border-ink/20 rounded-md px-2 py-0.5">
                    <KeyRound size={11} /> {o.pin}
                  </span>
                </td>
                <td className="py-2 text-ink/70 dark:text-paper/70">{o.waiterName}</td>
                <td className="py-2 text-ink/50 dark:text-paper/50">
                  {(o.items || []).map((it) => `${it.quantity}× ${it.name}`).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Section>
  );
}
