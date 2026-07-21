function timeCell(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:static print:bg-transparent print:backdrop-blur-none print:p-0">
      <div
        id="receipt-print-area"
        className="bg-paper w-full max-w-sm rounded-2xl overflow-hidden border-3 border-ink shadow-pop-lg print:shadow-none print:border-0 print:rounded-none print:max-w-full print:w-full"
      >
        <div className="bg-ink text-paper px-6 py-5 print:bg-white print:text-ink print:border-b print:border-dashed print:border-ink/40">
          <p className="font-mono text-xs tracking-widest text-amber uppercase print:text-ink/50">
            Receipt — Order #{String(order.orderId).slice(-6)}
          </p>
          <p className="font-display font-bold text-lg mt-1">Table {order.tableNumber}</p>
        </div>

        <div className="px-6 pt-5 pb-2 space-y-1 text-xs font-mono text-ink/50">
          <div className="flex justify-between"><span>Waiter</span><span>{order.waiterName}</span></div>
          <div className="flex justify-between"><span>Placed</span><span>{timeCell(order.placedAt)}</span></div>
          <div className="flex justify-between"><span>Closed</span><span>{timeCell(order.completedAt)}</span></div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="border-t-2 border-dashed border-ink/20 pt-4 space-y-1.5 mb-5">
            {(order.items || []).map((it, i) => (
              <div key={i} className="flex justify-between text-sm text-ink/70">
                <span>{it.quantity} × {it.name}</span>
                <span className="font-mono">KES {(it.price ?? 0) * it.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t-2 border-dashed border-ink/20 mt-2">
              <span>Total</span>
              <span className="font-mono">KES {order.totalAmount}</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-ink/30 font-tag tracking-wide mb-5">Asante — Smart Bar</p>

          <div className="flex gap-2 print:hidden">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-paper text-ink text-sm font-display font-semibold py-3 border-3 border-ink hover:bg-ink/5 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-xl bg-ink text-paper text-sm font-display font-semibold py-3 border-3 border-ink hover:bg-ink-soft transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
