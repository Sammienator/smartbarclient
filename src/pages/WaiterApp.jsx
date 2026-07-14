import { useEffect, useState } from "react";
import api from "../lib/api";
import { socket } from "../lib/socket";
import { asArray } from "../lib/asArray";
import WaiterOrderCard from "../components/WaiterOrderCard";
import NavBar from "../components/NavBar";

export default function WaiterApp() {
  const [waiters, setWaiters] = useState([]);
  const [waiterId, setWaiterId] = useState(localStorage.getItem("smartbar_waiter_id") || "");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/waiters")
      .then((res) => setWaiters(asArray(res.data)))
      .catch(() => setError("Could not load waiters. Is the backend running?"));
  }, []);

  useEffect(() => {
    if (!waiterId) return;

    localStorage.setItem("smartbar_waiter_id", waiterId);
    setLoading(true);
    api
      .get(`/orders/waiter/${waiterId}`)
      .then((res) => setOrders(asArray(res.data)))
      .catch(() => setError("Could not load orders. Is the backend running?"))
      .finally(() => setLoading(false));

    socket.emit("join:waiter", waiterId);

    function onNewOrder(order) {
      setOrders((prev) => [...prev, order]);
    }
    socket.on("order:new", onNewOrder);

    return () => {
      socket.emit("leave:waiter", waiterId);
      socket.off("order:new", onNewOrder);
    };
  }, [waiterId]);

  function handleEnded(orderId) {
    setOrders((prev) => prev.filter((o) => (o.orderId || o._id) !== orderId));
  }

  if (!waiterId) {
    return (
      <div className="min-h-screen bg-ink flex flex-col">
        <NavBar dark />
        <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xs">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40 mb-2">Smart Bar</p>
          <h1 className="font-display font-bold text-2xl text-paper mb-6">Who's working?</h1>
          {error && <p className="text-danger text-sm mb-3">{error}</p>}
          <div className="space-y-2">
            {waiters.map((w) => (
              <button
                key={w._id}
                onClick={() => setWaiterId(w._id)}
                className="w-full text-left rounded-lg border border-ink-line bg-ink-soft text-paper px-4 py-3 hover:border-amber transition-colors"
              >
                {w.name}
                {w.zone && <span className="text-paper/40 text-sm"> · {w.zone}</span>}
              </button>
            ))}
            {waiters.length === 0 && (
              <p className="text-paper/40 text-sm">No waiters found. Add one from the admin dashboard.</p>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  }

  const currentWaiter = waiters.find((w) => w._id === waiterId);

  return (
    <div className="min-h-screen bg-ink pb-10">
      <NavBar dark />
      <header className="px-5 pt-6 pb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40">Smart Bar</p>
          <h1 className="font-display font-bold text-2xl text-paper mt-1">
            {currentWaiter?.name || "Waiter"}
          </h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("smartbar_waiter_id");
            setWaiterId("");
            setOrders([]);
          }}
          className="text-paper/40 text-sm hover:text-paper"
        >
          Switch
        </button>
      </header>

      <div className="px-5 space-y-3">
        {error && <p className="text-danger text-sm">{error}</p>}
        {loading && <p className="text-paper/40 text-sm">Loading orders…</p>}
        {!loading && orders.length === 0 && (
          <p className="text-paper/40 text-sm">No active orders right now.</p>
        )}
        {orders.map((order) => (
          <WaiterOrderCard key={order.orderId || order._id} order={order} onEnded={handleEnded} />
        ))}
      </div>
    </div>
  );
}
