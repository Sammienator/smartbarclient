import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  UtensilsCrossed,
  Martini,
  ArrowLeft,
  ArrowLeftRight,
  Loader,
  X,
} from "lucide-react";
import api from "../lib/api";
import { socket } from "../lib/socket";
import { asArray } from "../lib/asArray";
import MenuItemCard from "../components/MenuItemCard";
import CartBar from "../components/CartBar";
import PaymentModal from "../components/PaymentModal";
import PinTicket from "../components/PinTicket";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

function TablePicker({ tables, loading, onSelect }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-ink relative overflow-hidden transition-colors">
      <div
        className="pointer-events-none absolute inset-0 urban-dots opacity-[0.04] text-ink dark:text-paper"
        aria-hidden="true"
      />
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
          <h1 className="font-display font-bold text-2xl text-ink dark:text-paper mb-6">
            Which table are you at?
          </h1>

          {loading ? (
            <p className="text-ink/50 dark:text-paper/50 text-sm">Loading tables…</p>
          ) : tables.length === 0 ? (
            <p className="text-ink/50 dark:text-paper/50 text-sm">
              No tables have been set up yet. Ask a staff member, or add one from
              the admin dashboard.
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
                  className="aspect-square rounded-xl border-3 border-ink dark:border-ink-line bg-white dark:bg-ink-soft shadow-pop hover:shadow-pop-lg font-display font-bold text-lg text-ink dark:text-paper transition-all"
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
      <div
        className="pointer-events-none absolute inset-0 urban-dots opacity-[0.04] text-ink dark:text-paper"
        aria-hidden="true"
      />
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink/40 dark:text-paper/40 mb-2">
            Table {tableNumber}
          </p>
          <h1 className="font-display font-bold text-2xl text-ink dark:text-paper mb-8">
            What are you ordering?
          </h1>

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
                  <span className="block font-display font-bold text-xl text-ink dark:text-paper mb-1">
                    Food
                  </span>
                  <span className="block text-ink/50 dark:text-paper/50 text-sm">
                    Order from the kitchen menu
                  </span>
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
                  <span className="block font-display font-bold text-xl text-ink dark:text-paper mb-1">
                    Drinks
                  </span>
                  <span className="block text-ink/50 dark:text-paper/50 text-sm">
                    Order from the bar menu
                  </span>
                </div>
              </div>
            </motion.button>
          </div>

          <div className="mt-14">
            <Button
              variant="outline"
              onClick={onChangeTable}
              className="px-4 py-2 text-sm inline-flex items-center gap-1.5"
            >
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
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // New payment flow states
  const [paymentStatus, setPaymentStatus] = useState(null); // null | "pending" | "completed" | "failed"
  const [paymentError, setPaymentError] = useState("");
  const [activePaymentId, setActivePaymentId] = useState(null);

  // Load tables
  useEffect(() => {
    api
      .get("/tables")
      .then((res) => setTables(asArray(res.data)))
      .catch(() => setError("Could not load tables. Is the backend running?"))
      .finally(() => setTablesLoading(false));
  }, []);

  // Load menu + socket listeners when table is selected
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
        prev.map((m) =>
          m._id === menuItemId ? { ...m, stockQty, isAvailable } : m
        )
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

  // Handle Paystack redirect success (URL params)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const orderId = params.get("orderId") || params.get("order_id");
    const pin = params.get("pin");

    if (status === "success" && (orderId || pin)) {
      setConfirmedOrder({
        orderId: orderId || "—",
        pin: pin || "—",
        tableNumber,
        category,
        items: [],
        totalAmount: 0,
      });
      setCart([]);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [tableNumber, category]);

  // Poll payment status while waiting for customer to enter M-Pesa PIN
  useEffect(() => {
    if (!activePaymentId || paymentStatus !== "pending") return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40; // ~2 minutes (40 × 3s)

    const interval = setInterval(async () => {
      if (cancelled) return;
      attempts += 1;

      try {
        const res = await api.get(`/payments/${activePaymentId}`);
        const {
          status,
          pin,
          orderId,
          failureReason,
          mpesaReceiptNumber,
        } = res.data;

        if (status === "completed") {
          clearInterval(interval);
          setPaymentStatus("completed");

          // Show the PIN ticket
          setConfirmedOrder({
            orderId: orderId || activePaymentId,
            pin: pin,
            tableNumber,
            category,
            items: cart.map((c) => ({
              name: c.name,
              quantity: c.quantity,
              price: c.price,
            })),
            totalAmount: cart.reduce((s, c) => s + c.price * c.quantity, 0),
            mpesaReceiptNumber,
          });
          setCart([]);
          setActivePaymentId(null);
        } else if (status === "failed") {
          clearInterval(interval);
          setPaymentStatus("failed");
          setPaymentError(
            failureReason || "Payment was cancelled or failed."
          );
          setActivePaymentId(null);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setPaymentStatus("failed");
          setPaymentError(
            "Payment timed out. If money was deducted, contact the waiter with your M-Pesa message."
          );
          setActivePaymentId(null);
        }
      } catch (err) {
        console.error("Polling error:", err);
        // keep trying until maxAttempts
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [activePaymentId, paymentStatus, cart, tableNumber, category]);

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
          c.menuItemId === item._id
            ? { ...c, quantity: c.quantity + quantity }
            : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity,
        },
      ];
    });
  }

  function removeFromCart(menuItemId) {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  // Step 1: Show payment modal
  function onPlaceOrder() {
    setShowPaymentModal(true);
  }

  // Step 2: User confirms payment method
  async function onPaymentConfirm(paymentData) {
    setError("");
    setPaymentError("");
    setProcessing(true);
    setPaymentStatus(null);

    try {
      const response = await api.post("/payments/initiate", {
        tableNumber,
        items: cart.map((c) => ({
          menuItemId: c.menuItemId,
          quantity: c.quantity,
        })),
        paymentMethod: paymentData.paymentMethod,
        phone: paymentData.phone || null,
        email: paymentData.email || null,
        amount: paymentData.amount,
        category,
      });

      const data = response.data;

      // ---------- CARD (Paystack) – redirect ----------
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      // ---------- M-PESA STK – poll for result ----------
      if (data.success && data.paymentId) {
        setActivePaymentId(data.paymentId);
        setPaymentStatus("pending");
        setShowPaymentModal(false);
      } else {
        setError(data.error || "Could not initiate payment. Please try again.");
        setShowPaymentModal(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Payment initiation failed. Please try again."
      );
      setShowPaymentModal(false);
    } finally {
      setProcessing(false);
    }
  }

  // ---------- Render guards ----------
  if (!tableNumber) {
    return (
      <TablePicker
        tables={tables}
        loading={tablesLoading}
        onSelect={selectTable}
      />
    );
  }

  if (!category) {
    return (
      <CategoryPicker
        tableNumber={tableNumber}
        onSelect={selectCategory}
        onChangeTable={changeTable}
      />
    );
  }

  const categoryLabel = category === "food" ? "Food" : "Drinks";
  const visibleItems = menu.filter((m) => m.category === category);

  return (
    <div className="min-h-screen pb-40 bg-paper dark:bg-ink relative transition-colors">
      <div
        className="pointer-events-none absolute inset-0 urban-dots opacity-[0.03] text-ink dark:text-paper"
        aria-hidden="true"
      />
      <NavBar />
      <div className="h-1.5 urban-gradient" aria-hidden="true" />

      <header className="relative px-5 pt-6 pb-6 flex items-start justify-between gap-3">
        <div>
          <span className="tag-sticker inline-block bg-ink text-paper font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md border-2 border-ink mb-2">
            Table {tableNumber} · {categoryLabel}
          </span>
          <h1 className="font-tag text-3xl text-ink dark:text-paper mt-1">
            Smart Bar
          </h1>
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
        <div className="mx-5 mb-4 rounded-xl bg-danger/10 text-danger text-sm px-4 py-3 border-2 border-danger/30 font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <p className="px-5 text-ink/50 dark:text-paper/50 text-sm">
          Loading menu…
        </p>
      ) : (
        <div className="px-5 relative">
          {visibleItems.length === 0 ? (
            <p className="text-ink/50 dark:text-paper/50 text-sm">
              Nothing available in this menu right now.
            </p>
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

      <CartBar
        cart={cart}
        onRemove={removeFromCart}
        onPlaceOrder={onPlaceOrder}
        placing={processing}
      />

      {/* Payment method selection modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={onPaymentConfirm}
        loading={processing}
        cartTotal={cartTotal}
      />

      {/* Waiting for customer to enter M-Pesa PIN */}
      {paymentStatus === "pending" && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-paper w-full max-w-sm rounded-2xl border-3 border-ink p-6 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 border-2 border-green-500 flex items-center justify-center">
              <Loader className="animate-spin text-green-600" size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-ink mb-2">
              Check your phone
            </h3>
            <p className="text-ink/70 text-sm mb-4">
              An M-Pesa prompt has been sent. Enter your PIN to complete the
              payment.
            </p>
            <p className="text-ink/40 text-xs">
              This screen will update automatically…
            </p>
            <button
              onClick={() => {
                setPaymentStatus(null);
                setActivePaymentId(null);
              }}
              className="mt-6 text-sm text-ink/50 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Payment failed */}
      {paymentStatus === "failed" && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-paper w-full max-w-sm rounded-2xl border-3 border-ink p-6 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/15 border-2 border-red-500 flex items-center justify-center">
              <X className="text-red-600" size={28} />
            </div>
            <h3 className="font-display font-bold text-xl text-ink mb-2">
              Payment Failed
            </h3>
            <p className="text-ink/70 text-sm mb-6">
              {paymentError ||
                "The payment was cancelled or could not be completed."}
            </p>
            <button
              onClick={() => {
                setPaymentStatus(null);
                setPaymentError("");
                setShowPaymentModal(true);
              }}
              className="w-full rounded-xl bg-amber text-ink font-bold py-3 border-3 border-ink"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setPaymentStatus(null);
                setPaymentError("");
              }}
              className="mt-3 text-sm text-ink/50 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success – PIN Ticket */}
      {confirmedOrder && (
        <PinTicket
          order={confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            setCategory(null);
            setPaymentStatus(null);
          }}
        />
      )}
    </div>
  );
}
