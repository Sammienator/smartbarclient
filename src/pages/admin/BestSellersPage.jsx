import { useEffect, useState } from "react";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

export default function BestSellersPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function load() {
    const params = {};
    if (start) params.start = start;
    if (end) params.end = end;
    setError("");
    api
      .get("/admin/best-sellers", { params })
      .then((res) => setRows(asArray(res.data)))
      .catch(() => setError("Could not load best sellers. Is the backend reachable?"));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, []);

  return (
    <Section title="Best sellers">
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <div className="flex gap-2 mb-4 items-end">
        <label className="text-xs text-ink/50">
          From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="block border border-ink/15 rounded-lg px-2 py-1 mt-1" />
        </label>
        <label className="text-xs text-ink/50">
          To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="block border border-ink/15 rounded-lg px-2 py-1 mt-1" />
        </label>
        <button onClick={load} className="rounded-lg bg-ink text-paper text-sm px-3 py-1.5">Filter</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-ink/40 text-sm">No completed orders in this range.</p>
      ) : (
        <ol className="space-y-1.5">
          {rows.map((r, i) => (
            <li key={r._id} className="flex justify-between text-sm">
              <span className="text-ink"><span className="text-ink/30 font-mono mr-2">{i + 1}</span>{r.name}</span>
              <span className="font-mono text-ink/60">{r.totalQuantitySold} sold · KES {r.totalRevenue}</span>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
