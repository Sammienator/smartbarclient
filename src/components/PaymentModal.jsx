import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CreditCard, ChevronRight } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, onConfirm, loading }) {
  const [step, setStep] = useState(1); // 1: method selection, 2: email input
  const [paymentMethod, setPaymentMethod] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const resetModal = () => {
    setStep(1);
    setPaymentMethod("");
    setEmail("");
    setEmailError("");
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
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleConfirm = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    onConfirm({
      paymentMethod,
      email,
    });
  };

  const handleGoBack = () => {
    if (!loading) {
      setStep(1);
      setEmail("");
      setEmailError("");
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
                  {step === 1 ? "Select Payment Method" : "Enter Email"}
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
                      className="w-full p-4 rounded-xl border-3 border-ink bg-white hover:bg-copper/10 active:bg-copper/20 transition-colors disabled:opacity-50 text-left flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-500/15 border-2 border-green-500 flex items-center justify-center shrink-0 group-hover:bg-green-500/25 transition-colors">
                        <Smartphone size={24} className="text-green-600" strokeWidth={2.25} />
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-bold text-ink">M-Pesa</div>
                        <div className="text-ink/50 text-sm">Pay via phone number</div>
                      </div>
                      <ChevronRight size={18} className="text-ink/30 group-hover:text-ink/60 transition-colors" />
                    </button>

                    <button
                      onClick={() => handleMethodSelect("card")}
                      disabled={loading}
                      className="w-full p-4 rounded-xl border-3 border-ink bg-white hover:bg-copper/10 active:bg-copper/20 transition-colors disabled:opacity-50 text-left flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-500/15 border-2 border-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition-colors">
                        <CreditCard size={24} className="text-blue-600" strokeWidth={2.25} />
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-bold text-ink">Card</div>
                        <div className="text-ink/50 text-sm">Credit or debit card</div>
                      </div>
                      <ChevronRight size={18} className="text-ink/30 group-hover:text-ink/60 transition-colors" />
                    </button>
                  </motion.div>
                ) : (
                  // Email Input
                  <motion.div
                    key="email-input"
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
                          setEmailError("");
                        }}
                        placeholder="your.email@example.com"
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border-2 border-ink focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 disabled:opacity-50 font-mono text-sm"
                      />
                      {emailError && (
                        <p className="text-danger text-sm mt-2 font-medium">{emailError}</p>
                      )}
                    </div>

                    <div className="bg-ink/5 rounded-lg p-3 text-sm text-ink/70">
                      <p className="font-semibold text-ink mb-1">Payment Method</p>
                      <p className="font-mono">
                        {paymentMethod === "mpesa" ? "M-Pesa" : "Card Payment"}
                      </p>
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
                  onClick={step === 1 ? (() => {}) : handleConfirm}
                  disabled={loading || (step === 1 && !paymentMethod) || (step === 2 && !email)}
                  className="flex-1 px-4 py-3 rounded-lg bg-amber text-ink font-bold hover:bg-amber-deep active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full"
                      />
                      Processing…
                    </>
                  ) : step === 1 ? (
                    <>
                      Next <ChevronRight size={16} />
                    </>
                  ) : (
                    "Confirm & Pay"
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
