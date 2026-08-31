import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UtensilsCrossed, Martini, ArrowLeft, ArrowLeftRight } from "lucide-react";
import api from "../lib/api";
import { socket } from "../lib/socket";
import { asArray } from "../lib/asArray";
import MenuItemCard from "../components/MenuItemCard";
import CartBar from "../components/CartBar";
import PinTicket from "../components/PinTicket";
import PaymentModal from "../components/PaymentModal";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

function TablePicker({ tables, loading, onSelect }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-ink relative overflow-hidden transition-colors">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.04] text-ink dark:text-paper" aria-hidden="true" />
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
          <h1 className="font-display font-bold text-2xl text-ink dark:text-paper mb-6">Which table are you at?</h1>

          {loading ? (
            <p className="text-ink/50 dark:text-paper/50 text-sm">Loading tables…</p>
          ) : tables.length === 0 ? (
            <p className="text-ink/50 dark:text-paper/50 text-sm">
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
                  className="aspect-square rounded-xl border-3 border-ink dark:border-ink-line bg-white dark:bg-ink-soft font-display font-bold text-ink dark:text-paper shadow-pop hover:bg-amber hover:text-ink hover:shadow-pop-lg transition-colors"
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

function CategoryPicker({ tableNumber, onSelect, onChangeTable }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-ink relative overflow-hidden transition-colors">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.04] text-ink dark:text-paper" aria-hidden="true" />
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40 dark:text-paper/40 mb-2">
            Table {tableNumber}
          </p>
          <h1 className="font-display font-bold text-2xl text-ink dark:text-paper mb-8">What are you ordering?</h1>

          <div className="grid grid-cols-1 gap-4">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 1, x: 1 }}
              onClick={() => onSelect("food")}
              className="relative rounded-2xl border-3 border-ink dark:border-ink-line bg-white dark:bg-ink-soft px-6 py-8 shadow-pop hover:shadow-pop-lg hover:bg-copper/10 dark:hover:bg-copper/10 transition-all overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-copper" aria-hidden="true" />
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-copper/15 border-2 border-ink dark:border-ink-line flex items-center justify-center shrink-0">
                  <UtensilsCrossed size={22} className="text-copper" strokeWidth={2.25} />
                </div>
                <div>
                  <span className="block font-display font-bold text-xl text-ink dark:text-paper mb-1">Food</span>
                  <span className="block text-ink/50 dark:text-paper/50 text-sm">Order from the kitchen menu</span>
                </div>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ y: 1, x: 1 }}
              onClick={() => onSelect("drink")}
              className="relative rounded-2xl border-3 border-ink dark:border-ink-line bg-white dark:bg-ink-soft px-6 py-8 shadow-pop hover:shadow-pop-lg hover:bg-electric/10 dark:hover:bg-electric/10 transition-all overflow-hidden text-center"
            >
              <div className="absolute top-0 left-0 h-1.5 w-full bg-electric" aria-hidden="true" />
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-electric/15 border-2 border-ink dark:border-ink-line flex items-center justify-center shrink-0">
                  <Martini size={22} className="text-electric" strokeWidth={2.25} />
                </div>
                <div>
                  <span className="block font-display font-bold text-xl text-ink dark:text-paper mb-1">Drinks</span>
                  <span className="block text-ink/50 dark:text-paper/50 text-sm">Order from the bar menu</span>
                </div>
              </div>
            </motion.button>
          </div>

          <div className="mt-14">
            <Button variant="outline" onClick={onChangeTable} className="px-4 py-2 text-sm inline-flex items-center gap-1.5">
              <ArrowLeft size={13} /> Change table
            </Button>
          </div>
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
  const [category, setCategory] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tables")
      .then((res) => setTables(asArray(res.data)))
      .catch(() => setError("Could not load tables"))
      .finally(() => setTablesLoading(false));
  }, []);

  useEffect(() => {
    if (!tableNumber) return;

    api
      .get("/menu")
      .then((res) => setMenu(asArray(res.data)))
      .catch(() => setError("Could not load menu"))
      .finally(() => setLoading(false));

    socket.emit("join:guest");
    
    function onPaymentConfirmed({ orderId: id, pin, paymentMethod }) {
      if (id === orderId) {
        setPendingOrder({ orderId: id, pin, paymentMethod, items: cart, category });
        setOrderId(null);
        setCart([]);
      }
    }

    function onStockUpdate({ menuItemId, stockQty, isAvailable }) {
      setMenu((prev) =>
        prev.map((m) => (m._id === menuItemId ? { ...m, stockQty, isAvailable } : m))
      );
    }

    function onMenuRemoved({ menuItemId }) {
      setMenu((prev) => prev.filter((m) => m._id !== menuItemId));
    }

    socket.on("payment:confirmed", onPaymentConfirmed);
    socket.on("stock:update", onStockUpdate);
    socket.on("menu:removed", onMenuRemoved);
    return () => {
      socket.off("payment:confirmed", onPaymentConfirmed);
      socket.off("stock:update", onStockUpdate);
      socket.off("menu:removed", onMenuRemoved);
    };
  }, [tableNumber, orderId, cart, category]);

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
      if (res.data && res.data.orderId) {
        setOrderId(res.data.orderId);
      } else {
        setError("Order creation failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order");
    } finally {
      setPlacing(false);
    }
  }

  function cancelPayment() {
    setOrderId(null);
  }

  function newOrder() {
    setPendingOrder(null);
    setCart([]);
    setCategory(null);
  }

  if (!tableNumber) {
    return <TablePicker tables={tables} loading={tablesLoading} onSelect={selectTable} />;
  }

  if (!category) {
    return <CategoryPicker tableNumber={tableNumber} onSelect={selectCategory} onChangeTable={changeTable} />;
  }

  if (pendingOrder) {
    return <PinTicket order={pendingOrder} onClose={newOrder} paymentMethod={pendingOrder.paymentMethod} />;
  }

  if (orderId) {
    return (
      <PaymentModal
        orderId={orderId}
        totalAmount={cart.reduce((sum, c) => sum + c.price * c.quantity, 0)}
        onCancel={cancelPayment}
      />
    );
  }

  const categoryLabel = category === "food" ? "Food" : "Drinks";
  const visibleItems = menu.filter((m) => m.category === category && m.isAvailable);

  return (
    <div className="min-h-screen pb-40 bg-paper dark:bg-ink relative transition-colors">
      <div className="pointer-events-none absolute inset-0 urban-dots opacity-[0.03] text-ink dark:text-paper" aria-hidden="true" />
      <NavBar />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />
      <header className="relative px-5 pt-6 pb-6 flex items-start justify-between gap-3">
        <div>
          <span className="tag-sticker inline-block bg-ink text-paper font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border-2 border-ink mb-2">
            Table {tableNumber} · {categoryLabel}
          </span>
          <h1 className="font-tag text-3xl text-ink dark:text-paper mt-1">Smart Bar</h1>
        </div>
        <Button
          variant="outline"
          onClick={changeCategory}
          className="mt-1 px-3.5 py-2 text-sm shrink-0 inline-flex items-center gap-1.5"
        >
          <ArrowLeftRight size={14} /> Switch menu
        </Button>
      </header>

      {error && (
        <div className="mx-5 mb-4 rounded-xl bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 text-sm px-4 py-3 border-2 border-red-500/30 font-medium">{error}</div>
      )}

      {loading ? (
        <p className="px-5 text-ink/50 dark:text-paper/50 text-sm">Loading menu…</p>
      ) : (
        <div className="px-5 relative">
          {visibleItems.length === 0 ? (
            <p className="text-ink/50 dark:text-paper/50 text-sm">Nothing available in this menu right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}