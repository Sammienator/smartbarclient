import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";
import Button from "../../components/Button";
import ImageUploader from "../../components/ImageUploader";

function MenuItemList({ items, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This can't be undone, but past orders keep their own record of it.`
    );
    if (!confirmed) return;

    setError("");
    setDeletingId(item._id);
    try {
      await api.delete(`/menu/${item._id}`);
      onDeleted(item._id);
    } catch (err) {
      setError(err.response?.data?.error || "Could not delete this item.");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return <p className="text-ink/40 dark:text-paper/40 text-sm">No menu items yet.</p>;
  }

  return (
    <div className="space-y-1.5">
      {error && <p className="text-danger text-xs mb-1">{error}</p>}
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border-2 border-ink/15 dark:border-ink-line px-3 py-2 hover:border-ink/30 dark:border-ink-line transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-paper-dim dark:bg-ink overflow-hidden shrink-0 flex items-center justify-center">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-ink/20 dark:text-paper/20 text-[9px] font-mono">n/a</span>
              )}
            </div>
            <div className="text-sm flex-1 min-w-0">
              <span className="text-ink dark:text-paper font-medium">{item.name}</span>
              <span className="text-ink/40 dark:text-paper/40 dark:text-paper/40 ml-2">
                {item.category} · KES {item.price} · {item.stockQty} in stock
              </span>
              {item.description && (
                <p className="text-ink/40 dark:text-paper/40 dark:text-paper/40 text-xs mt-0.5 truncate">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(item)}
              disabled={deletingId === item._id}
              className="text-xs font-medium text-danger hover:underline disabled:opacity-50 shrink-0"
            >
              {deletingId === item._id ? "Deleting…" : "Delete"}
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function WaiterList({ waiters }) {
  if (waiters.length === 0) {
    return <p className="text-ink/40 dark:text-paper/40 text-sm">No waiters yet.</p>;
  }
  return (
    <div className="space-y-1.5">
      {waiters.map((w) => (
        <div key={w._id} className="flex items-center gap-3 rounded-xl border-2 border-ink/15 dark:border-ink-line px-3 py-2 hover:border-ink/30 dark:border-ink-line transition-colors">
          <div className="w-9 h-9 rounded-full bg-paper-dim dark:bg-ink overflow-hidden shrink-0 flex items-center justify-center">
            {w.imageUrl ? (
              <img src={w.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-ink/25 dark:text-paper/25 text-xs font-display font-semibold">
                {w.name?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-sm flex-1 min-w-0">
            <span className="text-ink dark:text-paper font-medium">{w.name}</span>
            {w.zone && <span className="text-ink/40 dark:text-paper/40 ml-2">{w.zone}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function QuickAddPage() {
  const [tab, setTab] = useState("item");
  const [status, setStatus] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [waiterImageUrl, setWaiterImageUrl] = useState("");
  const [imageResetKey, setImageResetKey] = useState(0);

  function loadMenu() {
    api
      .get("/menu")
      .then((res) => setMenuItems(asArray(res.data)))
      .catch(() => setStatus("Could not load menu items. Is the backend reachable?"));
  }
  function loadWaiters() {
    api
      .get("/waiters")
      .then((res) => setWaiters(asArray(res.data)))
      .catch(() => setStatus("Could not load waiters. Is the backend reachable?"));
  }
  useEffect(() => {
    loadMenu();
    loadWaiters();
  }, []);

  function handleDeleted(id) {
    setMenuItems((prev) => prev.filter((m) => m._id !== id));
  }

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    setStatus("");
    try {
      if (tab === "item") {
        await api.post("/menu", {
          name: form.get("name"),
          category: form.get("category"),
          price: Number(form.get("price")),
          stockQty: Number(form.get("stockQty")),
          imageUrl: itemImageUrl,
          description: form.get("description"),
        });
        loadMenu();
      } else if (tab === "waiter") {
        await api.post("/waiters", {
          name: form.get("name"),
          zone: form.get("zone"),
          imageUrl: waiterImageUrl,
        });
        loadWaiters();
      } else if (tab === "table") {
        await api.post("/tables", { tableNumber: Number(form.get("tableNumber")), zone: form.get("zone") });
      }
      setStatus("Added.");
      e.target.reset();
      setItemImageUrl("");
      setWaiterImageUrl("");
      setImageResetKey((k) => k + 1); // forces the uploader preview to clear
    } catch (err) {
      setStatus(err.response?.data?.error || "Something went wrong.");
    }
  }

  const TABS = ["item", "waiter", "table"];

  return (
    <div className="space-y-5">
      <Section title="Quick add" accent="amber">
        <div className="flex gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t ? "text-paper" : "text-ink/60 dark:text-paper/60 hover:text-ink dark:text-paper dark:hover:text-paper"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="quickadd-tab-pill"
                  className="absolute inset-0 bg-ink rounded-lg border-2 border-ink dark:border-ink-line"
                  transition={{ duration: 0.2 }}
                />
              )}
              <span className="relative">
                {t === "item" ? "Menu item" : t === "waiter" ? "Waiter" : "Table"}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3 max-w-sm">
          {tab === "item" && (
            <>
              <ImageUploader
                key={`item-${imageResetKey}`}
                label="Photo of the food/drink"
                onUploaded={setItemImageUrl}
              />
              <input name="name" placeholder="Name" required className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
              <select name="category" className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors">
                <option value="drink">Drink</option>
                <option value="food">Food</option>
              </select>
              <input name="price" type="number" placeholder="Price (KES)" required className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
              <input name="stockQty" type="number" placeholder="Starting stock" required className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
              <textarea
                name="description"
                placeholder="Short description (shown to guests on the menu)"
                rows={2}
                maxLength={140}
                className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors resize-none"
              />
            </>
          )}
          {tab === "waiter" && (
            <>
              <ImageUploader
                key={`waiter-${imageResetKey}`}
                label="Photo of the waiter"
                shape="circle"
                onUploaded={setWaiterImageUrl}
              />
              <input name="name" placeholder="Name" required className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
              <input name="zone" placeholder="Zone (optional)" className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
            </>
          )}
          {tab === "table" && (
            <>
              <input name="tableNumber" type="number" placeholder="Table number" required className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
              <input name="zone" placeholder="Zone (optional)" className="w-full border-2 border-ink/15 dark:border-ink-line rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ink dark:border-ink-line transition-colors" />
            </>
          )}
          <Button type="submit" variant="amber" className="w-full py-2 text-sm">
            Add
          </Button>
          {status && <p className="text-xs text-ink/50 dark:text-paper/50">{status}</p>}
        </form>
      </Section>

      {tab === "item" && (
        <Section title="Current menu items" accent="copper">
          <p className="text-xs text-ink/40 dark:text-paper/40 mb-3">
            Remove an item once the store is no longer selling it, e.g. after it's permanently out
            of stock. Past and in-progress orders keep their own record regardless.
          </p>
          <MenuItemList items={menuItems} onDeleted={handleDeleted} />
        </Section>
      )}

      {tab === "waiter" && (
        <Section title="Current waiters" accent="moss">
          <WaiterList waiters={waiters} />
        </Section>
      )}
    </div>
  );
}
