import { useEffect, useState } from "react";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

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
    return <p className="text-ink/40 text-sm">No menu items yet.</p>;
  }

  return (
    <div className="space-y-1.5">
      {error && <p className="text-danger text-xs mb-1">{error}</p>}
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-2"
        >
          <div className="text-sm">
            <span className="text-ink font-medium">{item.name}</span>
            <span className="text-ink/40 ml-2">
              {item.category} · KES {item.price} · {item.stockQty} in stock
            </span>
          </div>
          <button
            onClick={() => handleDelete(item)}
            disabled={deletingId === item._id}
            className="text-xs font-medium text-danger hover:underline disabled:opacity-50"
          >
            {deletingId === item._id ? "Deleting…" : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function QuickAddPage() {
  const [tab, setTab] = useState("item");
  const [status, setStatus] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  function loadMenu() {
    api
      .get("/menu")
      .then((res) => setMenuItems(asArray(res.data)))
      .catch(() => setStatus("Could not load menu items. Is the backend reachable?"));
  }
  useEffect(loadMenu, []);

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
        });
        loadMenu();
      } else if (tab === "waiter") {
        await api.post("/waiters", { name: form.get("name"), zone: form.get("zone") });
      } else if (tab === "table") {
        await api.post("/tables", { tableNumber: Number(form.get("tableNumber")), zone: form.get("zone") });
      }
      setStatus("Added.");
      e.target.reset();
    } catch (err) {
      setStatus(err.response?.data?.error || "Something went wrong.");
    }
  }

  return (
    <div className="space-y-5">
      <Section title="Quick add">
        <div className="flex gap-2 mb-4">
          {["item", "waiter", "table"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-sm px-3 py-1.5 rounded-lg ${tab === t ? "bg-ink text-paper" : "bg-ink/5 text-ink/60"}`}
            >
              {t === "item" ? "Menu item" : t === "waiter" ? "Waiter" : "Table"}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="space-y-2 max-w-sm">
          {tab === "item" && (
            <>
              <input name="name" placeholder="Name" required className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
              <select name="category" className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm">
                <option value="drink">Drink</option>
                <option value="food">Food</option>
              </select>
              <input name="price" type="number" placeholder="Price (KES)" required className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
              <input name="stockQty" type="number" placeholder="Starting stock" required className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
            </>
          )}
          {tab === "waiter" && (
            <>
              <input name="name" placeholder="Name" required className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
              <input name="zone" placeholder="Zone (optional)" className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
            </>
          )}
          {tab === "table" && (
            <>
              <input name="tableNumber" type="number" placeholder="Table number" required className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
              <input name="zone" placeholder="Zone (optional)" className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm" />
            </>
          )}
          <button type="submit" className="w-full rounded-lg bg-amber text-ink font-medium py-2 text-sm">Add</button>
          {status && <p className="text-xs text-ink/50">{status}</p>}
        </form>
      </Section>

      {tab === "item" && (
        <Section title="Current menu items">
          <p className="text-xs text-ink/40 mb-3">
            Remove an item once the store is no longer selling it, e.g. after it's permanently out
            of stock. Past and in-progress orders keep their own record regardless.
          </p>
          <MenuItemList items={menuItems} onDeleted={handleDeleted} />
        </Section>
      )}
    </div>
  );
}
