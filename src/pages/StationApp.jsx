import { useEffect, useState } from "react";
import api from "../lib/api";
import { socket } from "../lib/socket";
import { asArray } from "../lib/asArray";
import NavBar from "../components/NavBar";
import StationOrderCard from "../components/StationOrderCard";

const STATION_LABELS = { kitchen: "Kitchen", bar: "Bar" };

export default function StationApp({ station }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/stations/${station}/orders`)
      .then((res) => {
        // The endpoint returns every item in this category regardless of
        // prep status; only show what's still pending.
        const pending = asArray(res.data)
          .map((o) => ({ ...o, items: asArray(o.items).filter((i) => !i.prepared) }))
          .filter((o) => o.items.length > 0);
        setOrders(pending);
      })
      .catch(() => setError("Could not load orders. Is the backend running?"))
      .finally(() => setLoading(false));

    socket.emit("join:station", station);

    function onNewOrder(order) {
      setOrders((prev) => [...prev, order]);
    }

    function onItemReady({ orderId, itemId }) {
      setOrders((prev) =>
        prev
          .map((o) =>
            o.orderId === orderId
              ? { ...o, items: o.items.filter((i) => i.itemId !== itemId) }
              : o
          )
          // Drop the whole order card once every item on it is ready.
          .filter((o) => o.items.length > 0)
      );
    }

    socket.on("station:neworder", onNewOrder);
    socket.on("station:itemReady", onItemReady);

    return () => {
      socket.emit("leave:station", station);
      socket.off("station:neworder", onNewOrder);
      socket.off("station:itemReady", onItemReady);
    };
  }, [station]);

  return (
    <div className="min-h-screen bg-ink pb-10">
      <NavBar dark />
      <header className="px-5 pt-6 pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-paper/40">Smart Bar</p>
        <h1 className="font-display font-bold text-2xl text-paper mt-1">
          {STATION_LABELS[station] || station}
        </h1>
      </header>

      {error && <p className="px-5 text-danger text-sm mb-4">{error}</p>}

      <div className="px-5 space-y-3">
        {loading && <p className="text-paper/40 text-sm">Loading orders…</p>}
        {!loading && orders.length === 0 && (
          <p className="text-paper/40 text-sm">Nothing pending right now.</p>
        )}
        {orders.map((order) => (
          <StationOrderCard
            key={order.orderId}
            station={station}
            order={order}
            onItemReady={setError}
          />
        ))}
      </div>
    </div>
  );
}
