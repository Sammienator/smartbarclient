import { useEffect, useState } from "react";
import api from "../../lib/api";
import { socket } from "../../lib/socket";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

export default function LowStockPage() {
  const [items, setItems] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [error, setError] = useState("");

  function load() {
    api
      .get("/admin/low-stock")
      .then((res) => {
        setItems(asArray(res.data?.items));
        setThreshold(res.data?.threshold ?? 5);
      })
      .catch(() => setError("Could not load low-stock items. Is the backend reachable?"));
  }
  useEffect(() => {
    load();
    socket.emit("join:admin");
    socket.on("inventory:lowstock", load);
    return () => socket.off("inventory:lowstock", load);
  }, []);

  return (
    <Section title={`Low stock (below ${threshold})`} accent="ink">
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {items.length === 0 ? (
        <p className="text-ink/40 text-sm">Everything is well stocked.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it._id} className="flex justify-between items-center text-sm border-2 border-danger/20 bg-danger/5 rounded-lg px-3 py-2">
              <span className="text-ink font-medium">{it.name}</span>
              <span className="font-mono font-bold text-danger">{it.stockQty} left</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
