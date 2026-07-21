import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UtensilsCrossed, Martini, ArrowLeft } from "lucide-react";
import api from "../lib/api";
import { socket } from "../lib/socket";
import { asArray } from "../lib/asArray";
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
    <div className="min-h-screen flex flex-col bg-paper relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.04] text-ink" aria-hidden="true" />
      <NavBar />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm text-center"
        >
          <span className="tag-sticker inline-block bg-ink text-paper font-tag text-[10px] uppercase tracking-widest px-3 py-1 rounded-md border-2 border-ink shadow-pop-sm mb-4">
            Smart Bar
          </span>
          <h1 className="font-display font-bold text-2xl text-ink mb-6">Which table are you at?</h1>

          {loading ? (
            <p className="text-ink/50 text-sm">Loading tables…</p>
          ) : tables.length === 0 ? (
            <p className="text-ink/50 text-sm">
              No tables have been set up yet. Ask a staff member, or add one from the admin dashboard.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2.5">
              {tables.map((t, i) => (
                <motion.button
                  key={t._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ y: 1, x: 1 }}
                  onClick={() => onSelect(t.tableNumber)}
                  className="aspect-square rounded-xl border-3 border-ink bg-white font-display font-bold text-ink shadow-pop hover:bg-amber hover:shadow-pop-lg transition-colors"
                >
                  {t.tableNumber}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Category selection: after picking a table, a guest chooses whether
// they're ordering food or drinks. Each choice starts its own cart and,
// on submit, its own order — and therefore its own PIN — so kitchen and
// bar delivery times can be tracked independently. Guests can return
// here after each order to place another (of either category).
function CategoryPicker({ tableNumber, onSelect, onChangeTable }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.04] text-ink" aria-hidden="true" />
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">
            Table {tableNumber}
          </p>
          <h1 className="font-display font-bold text-2xl text-ink mb-8">What are you ordering?</h1>

          <div className="grid grid-cols-1 gap-4">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 1, x: 1 }}
              onClick={() => onSelect("food")}
              className="relative rounded-2xl border-3 border-ink bg-white px-6 py-8 shadow-pop hover:shadow-pop-lg hover:bg-copper/10 transition-all overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-copper" aria-hidden="true" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-copper/15 border-2 border-ink flex items-center justify-center shrink-0">
                  <UtensilsCrossed size={22} className="text-copper" strokeWidth={2.25} />
                </div>
                <div>
                  <span className="block font-display font-bold text-xl text-ink mb-1">Food</span>
                  <span className="block text-ink/50 text-sm">Order from the kitchen menu</span>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 1, x: 1 }}
              onClick={() => onSelect("drink")}
              className="relative rounded-2xl border-3 border-ink bg-white px-6 py-8 shadow-pop hover:shadow-pop-lg hover:bg-electric/10 transition-all overflow-hidden text-left"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-electric" aria-hidden="true" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-electric/15 border-2 border-ink flex items-center justify-center shrink-0">
                  <Martini size={22} className="text-electric" strokeWidth={2.25} />
                </div>
                <div>
                  <span className="block font-display font-bold text-xl text-ink mb-1">Drinks</span>
                  <span className="block text-ink/50 text-sm">Order from the bar menu</span>
                </div>
              </div>
            </motion.button>
          </div>

          <button onClick={onChangeTable} className="text-xs text-ink/40 hover:text-ink underline mt-8 flex items-center gap-1 mx-auto">
            <ArrowLeft size={12} /> Change table
          </button>
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
  const [category, setCategory] = useState(null); // "food" | "drink" | null
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tables")
      .then((res) => setTables(asArray(res.data)))
      .catch(() => setError("Could not load tables. Is the backend running?"))
      .finally(() => setTablesLoading(false));
  }, []);

  useEffect(() => {
    if (!tableNumber) return;

    api
      .get("/menu")
      .then((res) => setMenu(asArray(res.data)))
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
    setCategory(null);
    setCart([]);
  }

  function selectCategory(cat) {
    setCart([]);
    setCategory(cat);
  }

  function changeCategory() {
    setCart([]);
    setCategory(null);
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
      // Guard against a malformed/unexpected response (e.g. a proxy or
      // CORS misconfiguration returning something other than the order
      // object) rather than handing it straight to PinTicket to render.
      if (res.data && typeof res.data === "object" && res.data.pin) {
        setConfirmedOrder({
          ...res.data,
          items: Array.isArray(res.data.items) ? res.data.items : [],
          category,
        });
        setCart([]);
      } else {
        setError("Order may not have been placed correctly. Please check with a staff member before ordering again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Could not place the order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (!tableNumber) {
    return <TablePicker tables={tables} loading={tablesLoading} onSelect={selectTable} />;
  }

  if (!category) {
    return (
      <CategoryPicker tableNumber={tableNumber} onSelect={selectCategory} onChangeTable={changeTable} />
    );
  }

  const categoryLabel = category === "food" ? "Food" : "Drinks";
  const visibleItems = menu.filter((m) => m.category === category);

  return (
    <div className="min-h-screen pb-40 bg-paper relative">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.03] text-ink" aria-hidden="true" />
      <NavBar />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />
      <header className="relative px-5 pt-6 pb-6 flex items-start justify-between">
        <div>
          <span className="tag-sticker inline-block bg-ink text-paper font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border-2 border-ink mb-2">
            Table {tableNumber} · {categoryLabel}
          </span>
          <h1 className="font-tag text-3xl text-ink mt-1">Smart Bar</h1>
        </div>
        <div className="flex flex-col items-end gap-1 mt-1">
          <button onClick={changeCategory} className="text-xs text-ink/40 hover:text-ink underline">
            Switch menu
          </button>
          <button onClick={changeTable} className="text-xs text-ink/40 hover:text-ink underline">
            Change table
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-5 mb-4 rounded-xl bg-danger/10 text-danger text-sm px-4 py-3 border-2 border-danger/30 font-medium">{error}</div>
      )}

      {loading ? (
        <p className="px-5 text-ink/50 text-sm">Loading menu…</p>
      ) : (
        <div className="px-5 relative">
          {visibleItems.length === 0 ? (
            <p className="text-ink/50 text-sm">Nothing available in this menu right now.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {visibleItems.map((item) => (
                  <MenuItemCard key={item._id} item={item} onAdd={addToCart} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      <CartBar cart={cart} onRemove={removeFromCart} onPlaceOrder={placeOrder} placing={placing} />

      {confirmedOrder && (
        <PinTicket
          order={confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            setCategory(null);
          }}
        />
      )}
    </div>
  );
}
