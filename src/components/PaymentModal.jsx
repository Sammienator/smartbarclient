import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CreditCard, ChevronRight, Loader } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, onConfirm, loading, cartTotal }) {
  const [step, setStep] = useState(1); // 1: method selection, 2: details input
  const [paymentMethod, setPaymentMethod] = useState(""); // "mpesa" | "card"
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const resetModal = () => {
    setStep(1);
    setPaymentMethod("");
    setPhone("");
    setEmail("");
    setError("");
  };

  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  const handleMethodSelect = (method) => {
    setPaymentMethod(method);
    setStep(2);
    setError("");
  };

  // Validate Kenyan phone number (254 format)
  const validatePhone = (phone) => {
    const phoneRegex = /^254\d{9}$|^\+254\d{9}$|^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Format phone to 254 format
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.substring(1);
    } else if (!cleaned.startsWith("254")) {
      cleaned = "254" + cleaned;
    }
    return cleaned;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleConfirm = () => {
    if (paymentMethod === "mpesa") {
      if (!phone.trim()) {
        setError("Please enter your phone number");
        return;
      }
      if (!validatePhone(phone)) {
        setError("Please enter a valid Kenyan phone number (e.g., 0712345678)");
        return;
      }
      onConfirm({
        paymentMethod: "mpesa",
        phone: formatPhoneNumber(phone),
        amount: cartTotal,
      });
    } else if (paymentMethod === "card") {
      if (!email.trim()) {
        setError("Please enter your email address");
        return;
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
      onConfirm({
        paymentMethod: "card",
        email,
        amount: cartTotal,
      });
    }
  };

  const handleGoBack = () => {
    if (!loading) {
      setStep(1);
      setPhone("");
      setEmail("");
      setError("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              className="w-full max-w-sm bg-paper rounded-2xl shadow-2xl border-3 border-ink overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b-3 border-ink bg-ink text-paper">
                <h2 className="font-display font-bold text-lg">
                  {step === 1 ? "Select Payment Method" : paymentMethod === "mpesa" ? "M-Pesa Payment" : "Card Payment"}
                </h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="text-paper/60 hover:text-paper disabled:opacity-50 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {step === 1 ? (
                  // Payment Method Selection
                  <motion.div
                    key="method-select"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={() => handleMethodSelect("mpesa")}
                      disabled={loading}
                      className="w-full p-4 rounded-xl border-3 border-ink bg-white hover:bg-green-500/10 active:bg-green-500/20 transition-colors disabled:opacity-50 text-left flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-500/15 border-2 border-green-500 flex items-center justify-center shrink-0 group-hover:bg-green-500/25 transition-colors">
                        <Smartphone size={24} className="text-green-600" strokeWidth={2.25} />
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-bold text-ink">M-Pesa</div>
                        <div className="text-ink/50 text-sm">Pay with your phone number</div>
                      </div>
                      <ChevronRight size={18} className="text-ink/30 group-hover:text-ink/60 transition-colors" />
                    </button>

                    <button
                      onClick={() => handleMethodSelect("card")}
                      disabled={loading}
                      className="w-full p-4 rounded-xl border-3 border-ink bg-white hover:bg-blue-500/10 active:bg-blue-500/20 transition-colors disabled:opacity-50 text-left flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-500/15 border-2 border-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition-colors">
                        <CreditCard size={24} className="text-blue-600" strokeWidth={2.25} />
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-bold text-ink">Credit Card</div>
                        <div className="text-ink/50 text-sm">Pay with card via Paystack</div>
                      </div>
                      <ChevronRight size={18} className="text-ink/30 group-hover:text-ink/60 transition-colors" />
                    </button>

                    {/* Amount Display */}
                    <div className="mt-4 p-3 bg-amber/10 rounded-lg border-2 border-amber">
                      <p className="text-sm text-ink/60">Total Amount</p>
                      <p className="font-display font-bold text-2xl text-ink">KES {cartTotal}</p>
                    </div>
                  </motion.div>
                ) : paymentMethod === "mpesa" ? (
                  // M-Pesa Phone Input
                  <motion.div
                    key="mpesa-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Phone Number (M-Pesa)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setError("");
                        }}
                        placeholder="0712345678"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border-2 border-ink focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:opacity-50 font-mono text-sm"
                      />
                      <p className="text-ink/50 text-xs mt-1">Format: 0712345678 or +254712345678</p>
                      {error && (
                        <p className="text-danger text-sm mt-2 font-medium">{error}</p>
                      )}
                    </div>

                    <div className="bg-green-500/10 rounded-lg p-3 border-2 border-green-500/30">
                      <p className="font-semibold text-green-700 text-sm mb-1">How it works</p>
                      <ul className="text-ink/70 text-xs space-y-1">
                        <li>✓ You'll be directed to M-Pesa payment</li>
                        <li>✓ Enter your M-Pesa PIN to confirm</li>
                        <li>✓ Once paid, your order PIN appears instantly</li>
                      </ul>
                    </div>

                    <div className="bg-ink/5 rounded-lg p-3 text-sm text-ink/70">
                      <p className="font-semibold text-ink mb-1">Amount to Pay</p>
                      <p className="font-display font-bold text-ink text-lg">KES {cartTotal}</p>
                    </div>
                  </motion.div>
                ) : (
                  // Card Email Input
                  <motion.div
                    key="card-input"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-ink mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="your.email@example.com"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border-2 border-ink focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 font-mono text-sm"
                      />
                      {error && (
                        <p className="text-danger text-sm mt-2 font-medium">{error}</p>
                      )}
                    </div>

                    <div className="bg-blue-500/10 rounded-lg p-3 border-2 border-blue-500/30">
                      <p className="font-semibold text-blue-700 text-sm mb-1">How it works</p>
                      <ul className="text-ink/70 text-xs space-y-1">
                        <li>✓ You'll be directed to Paystack payment</li>
                        <li>✓ Enter your card details securely</li>
                        <li>✓ Once paid, your order PIN appears instantly</li>
                      </ul>
                    </div>

                    <div className="bg-ink/5 rounded-lg p-3 text-sm text-ink/70">
                      <p className="font-semibold text-ink mb-1">Amount to Pay</p>
                      <p className="font-display font-bold text-ink text-lg">KES {cartTotal}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-5 border-t-3 border-ink bg-ink/5">
                {step === 2 && (
                  <button
                    onClick={handleGoBack}
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-ink text-ink font-semibold hover:bg-ink/5 active:bg-ink/10 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  disabled={
                    loading ||
                    (step === 2 &&
                      ((paymentMethod === "mpesa" && !phone) ||
                        (paymentMethod === "card" && !email)))
                  }
                  className="flex-1 px-4 py-3 rounded-lg bg-amber text-ink font-bold hover:bg-amber-deep active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Processing…
                    </>
                  ) : step === 1 ? (
                    <>
                      Next <ChevronRight size={16} />
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
