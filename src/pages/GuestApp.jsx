import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { socket } from "../lib/socket";
import MenuItemCard from "../components/MenuItemCard";
import CartBar from "../components/CartBar";
import PinTicket from "../components/PinTicket";
import NavBar from "../components/NavBar";

// Table selection: a guest picks their table from a list rather than
// scanning a QR code or following a link (no QR code service required).
// The URL query string (?table=12) still works too, as a shortcut for
// anyone who does set up QR codes later - it just pre-fills the choice.
function TablePicker({ tables, loading, onSelect }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">Smart Bar</p>
          <h1 className="font-display font-bold text-2xl text-ink mb-6">Which table are you at?</h1>

          {loading ? (
            <p className="text-ink/50 text-sm">Loading tables…</p>
          ) : tables.length === 0 ? (
            <p className="text-ink/50 text-sm">
              No tables have been set up yet. Ask a staff member, or add one from the admin dashboard.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {tables.map((t) => (
                <button
                  key={t._id}
                  onClick={() => onSelect(t.tableNumber)}
                  className="aspect-square rounded-xl border border-ink/15 bg-white font-display font-semibold text-ink hover:border-amber-deep hover:bg-amber/10 transition-colors"
                >
                  {t.tableNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuestApp() {
  const [tableNumber, setTableNumber] = useState(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("table");
    if (fromUrl) return Number(fromUrl);
    const stored = sessionStorage.getItem("smartbar_table_number");
    return stored ? Number(stored) : null;
  });
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tables")
      .then((res) => setTables(res.data))
      .finally(() => setTablesLoading(false));
  }, []);

  useEffect(() => {
    if (!tableNumber) return;

    api
      .get("/menu")
      .then((res) => setMenu(res.data))
      .catch(() => setError("Could not load the menu. Is the backend running?"))
      .finally(() => setLoading(false));

    socket.emit("join:guest");
    function onStockUpdate({ menuItemId, stockQty, isAvailable }) {
      setMenu((prev) =>
        prev.map((m) => (m._id === menuItemId ? { ...m, stockQty, isAvailable } : m))
      );
    }
    function onMenuRemoved({ menuItemId }) {
      setMenu((prev) => prev.filter((m) => m._id !== menuItemId));
    }
    socket.on("stock:update", onStockUpdate);
    socket.on("menu:removed", onMenuRemoved);
    return () => {
      socket.off("stock:update", onStockUpdate);
      socket.off("menu:removed", onMenuRemoved);
    };
  }, [tableNumber]);

  function selectTable(num) {
    sessionStorage.setItem("smartbar_table_number", String(num));
    setTableNumber(num);
  }

  function changeTable() {
    sessionStorage.removeItem("smartbar_table_number");
    setTableNumber(null);
    setCart([]);
  }

  function addToCart(item, quantity) {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item._id);
      if (existing) {
        return prev.map((c) =>
          c.menuItemId === item._id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prev, { menuItemId: item._id, name: item.name, price: item.price, quantity }];
    });
  }

  function removeFromCart(menuItemId) {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  }

  async function placeOrder() {
    setError("");
    setPlacing(true);
    try {
      const res = await api.post("/orders", {
        tableNumber,
        items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
      });
      setConfirmedOrder(res.data);
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.error || "Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (!tableNumber) {
    return <TablePicker tables={tables} loading={tablesLoading} onSelect={selectTable} />;
  }

  const drinks = menu.filter((m) => m.category === "drink");
  const food = menu.filter((m) => m.category === "food");

  return (
    <div className="min-h-screen pb-40">
      <NavBar />
      <header className="px-5 pt-6 pb-6 flex items-start justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40">Table {tableNumber}</p>
          <h1 className="font-display font-bold text-3xl text-ink mt-1">Smart Bar</h1>
        </div>
        <button onClick={changeTable} className="text-xs text-ink/40 hover:text-ink underline mt-1">
          Change table
        </button>
      </header>

      {error && (
        <div className="mx-5 mb-4 rounded-lg bg-danger/10 text-danger text-sm px-4 py-3">{error}</div>
      )}

      {loading ? (
        <p className="px-5 text-ink/50 text-sm">Loading menu…</p>
      ) : (
        <div className="px-5 space-y-8">
          {drinks.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-ink/80 text-sm uppercase tracking-wide mb-3">
                Drinks
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {drinks.map((item) => (
                    <MenuItemCard key={item._id} item={item} onAdd={addToCart} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
          {food.length > 0 && (
            <section>
              <h2 className="font-display font-semibold text-ink/80 text-sm uppercase tracking-wide mb-3">
                Food
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {food.map((item) => (
                    <MenuItemCard key={item._id} item={item} onAdd={addToCart} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      )}

      <CartBar cart={cart} onRemove={removeFromCart} onPlaceOrder={placeOrder} placing={placing} />

      {confirmedOrder && (
        <PinTicket order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />
      )}
    </div>
  );
}
