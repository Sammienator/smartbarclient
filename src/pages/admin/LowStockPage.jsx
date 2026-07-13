import { useEffect, useState } from "react";
import api from "../../lib/api";
import { socket } from "../../lib/socket";
import Section from "../../components/Section";

export default function LowStockPage() {
  const [items, setItems] = useState([]);
  const [threshold, setThreshold] = useState(5);

  function load() {
    api.get("/admin/low-stock").then((res) => {
      setItems(res.data.items);
      setThreshold(res.data.threshold);
    });
  }
  useEffect(() => {
    load();
    socket.emit("join:admin");
    socket.on("inventory:lowstock", load);
    return () => socket.off("inventory:lowstock", load);
  }, []);

  return (
    <Section title={`Low stock (below ${threshold})`}>
      {items.length === 0 ? (
        <p className="text-ink/40 text-sm">Everything is well stocked.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it._id} className="flex justify-between text-sm">
              <span className="text-ink">{it.name}</span>
              <span className="font-mono text-danger">{it.stockQty} left</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
