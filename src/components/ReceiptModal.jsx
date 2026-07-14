function timeCell(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:static print:bg-transparent print:backdrop-blur-none print:p-0">
      <div
        id="receipt-print-area"
        className="bg-paper w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none print:max-w-full print:w-full"
      >
        <div className="bg-ink text-paper px-6 py-5 print:bg-white print:text-ink print:border-b print:border-dashed print:border-ink/40">
          <p className="font-mono text-xs tracking-widest text-paper/50 uppercase print:text-ink/50">
            Receipt — Order #{String(order.orderId).slice(-6)}
          </p>
          <p className="font-display font-semibold text-lg mt-1">Table {order.tableNumber}</p>
        </div>

        <div className="px-6 pt-5 pb-2 space-y-1 text-xs font-mono text-ink/50">
          <div className="flex justify-between"><span>Waiter</span><span>{order.waiterName}</span></div>
          <div className="flex justify-between"><span>Placed</span><span>{timeCell(order.placedAt)}</span></div>
          <div className="flex justify-between"><span>Closed</span><span>{timeCell(order.completedAt)}</span></div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="border-t border-dashed border-ink/15 pt-4 space-y-1.5 mb-5">
            {(order.items || []).map((it, i) => (
              <div key={i} className="flex justify-between text-sm text-ink/70">
                <span>{it.quantity} × {it.name}</span>
                <span className="font-mono">KES {(it.price ?? 0) * it.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold text-ink pt-2 border-t border-dashed border-ink/15 mt-2">
              <span>Total</span>
              <span className="font-mono">KES {order.totalAmount}</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-ink/30 font-mono mb-5">Thank you — Smart Bar</p>

          <div className="flex gap-2 print:hidden">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-ink/5 text-ink text-sm font-medium py-3 hover:bg-ink/10 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-lg bg-ink text-paper text-sm font-medium py-3 hover:bg-ink/85 transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
