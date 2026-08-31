import { motion } from "framer-motion";
import { Copy, ArrowRight } from "lucide-react";
import Button from "./Button";

export default function PinTicket({ order, onClose, paymentMethod }) {
  const { pin, tableNumber, items, category } = order;

  function copyPin() {
    navigator.clipboard.writeText(pin);
  }

  function handleNewOrder() {
    onClose();
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-paper dark:bg-ink">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${paymentMethod === "mpesa" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            Paid via {paymentMethod === "mpesa" ? "M-Pesa" : "Card"}
          </span>
        </div>

        <div className="rounded-2xl border-3 border-ink dark:border-ink-line bg-white dark:bg-ink-soft p-8 shadow-pop text-center">
          <p className="text-sm text-ink/50 dark:text-paper/50 mb-4">Table {tableNumber}</p>

          <div className="mb-8">
            <p className="text-xs text-ink/50 dark:text-paper/50 uppercase tracking-widest mb-3">Your PIN</p>
            <div className="text-5xl font-bold font-mono text-ink dark:text-paper tracking-widest mb-4">
              {pin}
            </div>
            <button
              onClick={copyPin}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber hover:text-copper transition"
            >
              <Copy size={14} /> Copy PIN
            </button>
          </div>

          <div className="mb-6 pb-6 border-b-2 border-ink/10">
            <p className="text-xs text-ink/50 mb-2">Total: KES {totalAmount}</p>
          </div>

          <div className="mb-8">
            <p className="text-xs text-ink/50 uppercase mb-2">Items ({category})</p>
            <div className="space-y-1 text-sm text-ink dark:text-paper">
              {items.map((item, idx) => (
                <p key={idx}>{item.quantity}x {item.name}</p>
              ))}
            </div>
          </div>

          <p className="text-xs text-ink/50 dark:text-paper/50 mb-6">
            Show this PIN to your waiter
          </p>

          <Button onClick={handleNewOrder} className="w-full">
            Place Another Order <ArrowRight size={16} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}