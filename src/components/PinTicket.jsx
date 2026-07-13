export default function PinTicket({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-paper w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-ink text-paper px-6 py-5">
          <p className="font-mono text-xs tracking-widest text-paper/50 uppercase">Order placed</p>
          <p className="font-display font-semibold text-lg mt-1">Table {order.tableNumber}</p>
        </div>

        <div className="relative px-6 pt-8 pb-6 text-center">
          <p className="text-ink/50 text-xs font-mono uppercase tracking-widest mb-2">
            Give this PIN to your waiter when your order is complete
          </p>
          <p className="font-mono font-semibold text-6xl tracking-[0.2em] text-amber-deep py-2">
            {order.pin}
          </p>
          <p className="text-ink/40 text-xs mt-2">Order #{String(order.orderId).slice(-6)}</p>
        </div>

        <div className="px-6 pb-6">
          <div className="border-t border-dashed border-ink/15 pt-4 space-y-1.5 mb-5">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm text-ink/70">
                <span>{it.quantity} × {it.name}</span>
                <span className="font-mono">KES {it.price * it.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold text-ink pt-2">
              <span>Total</span>
              <span className="font-mono">KES {order.totalAmount}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-lg bg-ink text-paper text-sm font-medium py-3 hover:bg-ink/85 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
