import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader } from "lucide-react";
import api from "../lib/api";
import Button from "./Button";

export default function PaymentModal({ orderId, totalAmount, onCancel }) {
  const [method, setMethod] = useState(null); // "mpesa" | "paystack"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function handleMPesa() {
    if (!phone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    setLoading(true);
    try {
      await api.post("/payments/mpesa/stk-push", { orderId, phone });
      setProcessing(true);
      setError("");
      // Guest will see STK prompt on their phone
    } catch (err) {
      setError(err.response?.data?.error || "M-Pesa payment failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePaystack() {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/payments/paystack/initiate", { orderId, email });
      // Redirect to Paystack payment page
      window.location.href = res.data.paymentLink;
    } catch (err) {
      setError(err.response?.data?.error || "Paystack payment failed");
      setLoading(false);
    }
  }

  if (processing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-ink-soft rounded-2xl border-3 border-ink p-8 max-w-sm text-center"
        >
          <div className="flex justify-center mb-4">
            <Loader className="animate-spin text-amber" size={32} />
          </div>
          <h2 className="text-xl font-bold text-ink dark:text-paper mb-2">Check Your Phone</h2>
          <p className="text-ink/50 dark:text-paper/50 text-sm">
            M-Pesa payment prompt sent. Enter your PIN on your phone to confirm.
          </p>
        </motion.div>
      </div>
    );
  }

  if (method === "mpesa") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-ink-soft rounded-2xl border-3 border-ink p-6 max-w-sm w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-ink dark:text-paper">M-Pesa Payment</h2>
            <button onClick={() => setMethod(null)} className="p-1 hover:bg-ink/10 rounded">
              <X size={20} />
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <p className="text-sm font-medium text-ink/70 dark:text-paper/70 mb-2">Amount: KES {totalAmount}</p>
            <input
              type="tel"
              placeholder="0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:border-amber"
            />
          </div>
          <Button
            onClick={handleMPesa}
            loading={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Send STK Prompt
          </Button>
        </motion.div>
      </div>
    );
  }

  if (method === "paystack") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-ink-soft rounded-2xl border-3 border-ink p-6 max-w-sm w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-ink dark:text-paper">Card / Mobile Money</h2>
            <button onClick={() => setMethod(null)} className="p-1 hover:bg-ink/10 rounded">
              <X size={20} />
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <p className="text-sm font-medium text-ink/70 dark:text-paper/70 mb-2">Amount: KES {totalAmount}</p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-ink rounded-lg focus:outline-none focus:border-amber"
            />
          </div>
          <Button
            onClick={handlePaystack}
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Pay with Paystack
          </Button>
        </motion.div>
      </div>
    );
  }

  // Payment method selection
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-ink-soft rounded-2xl border-3 border-ink p-8 max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-ink dark:text-paper mb-2">Choose Payment Method</h2>
        <p className="text-ink/50 dark:text-paper/50 mb-6">KES {totalAmount}</p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setMethod("mpesa")}
            className="w-full p-4 border-2 border-ink rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition text-left"
          >
            <p className="font-bold text-ink dark:text-paper">M-Pesa</p>
            <p className="text-sm text-ink/60 dark:text-paper/60">Quick & easy</p>
          </button>
          <button
            onClick={() => setMethod("paystack")}
            className="w-full p-4 border-2 border-ink rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition text-left"
          >
            <p className="font-bold text-ink dark:text-paper">Card / Mobile Money</p>
            <p className="text-sm text-ink/60 dark:text-paper/60">Visa, MTN, Airtel</p>
          </button>
        </div>

        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </motion.div>
    </div>
  );
}