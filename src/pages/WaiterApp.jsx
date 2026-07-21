import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
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
      <div className="min-h-screen bg-ink flex flex-col relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.05] text-paper" aria-hidden="true" />
        <NavBar dark />
        <div className="h-1.5 urban-gradient" aria-hidden="true" />
        <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-xs">
          <span className="tag-sticker inline-block bg-amber text-ink font-tag text-[10px] uppercase tracking-widest px-3 py-1 rounded-md border-2 border-ink shadow-pop-sm mb-4">
            Smart Bar
          </span>
          <h1 className="font-display font-bold text-2xl text-paper mb-6">Who's working?</h1>
          {error && <p className="text-danger text-sm mb-3">{error}</p>}
          <div className="space-y-2">
            {waiters.map((w, i) => (
              <motion.button
                key={w._id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setWaiterId(w._id)}
                className="w-full flex items-center gap-3 text-left rounded-xl border-2 border-ink-line bg-ink-soft text-paper px-4 py-3 hover:border-amber transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-ink-line overflow-hidden shrink-0 flex items-center justify-center border-2 border-ink-line">
                  {w.imageUrl ? (
                    <img src={w.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-paper/40 text-xs font-display font-semibold">
                      {w.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <span>
                  {w.name}
                  {w.zone && <span className="text-paper/40 text-sm"> · {w.zone}</span>}
                </span>
              </motion.button>
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
    <div className="min-h-screen bg-ink pb-10 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.05] text-paper" aria-hidden="true" />
      <NavBar dark />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />
      <header className="relative px-5 pt-6 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-ink-soft border-2 border-amber overflow-hidden shrink-0 flex items-center justify-center">
            {currentWaiter?.imageUrl ? (
              <img src={currentWaiter.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-paper/40 text-sm font-display font-semibold">
                {currentWaiter?.name?.[0]?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-paper/40">Smart Bar</p>
            <h1 className="font-display font-bold text-2xl text-paper mt-1">
              {currentWaiter?.name || "Waiter"}
            </h1>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("smartbar_waiter_id");
            setWaiterId("");
            setOrders([]);
          }}
          className="text-paper/50 text-sm hover:text-paper flex items-center gap-1.5 border-2 border-ink-line rounded-lg px-3 py-1.5 hover:border-amber transition-colors"
        >
          <LogOut size={13} /> Switch
        </button>
      </header>

      <div className="relative px-5 space-y-3">
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
