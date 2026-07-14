import { useEffect, useState } from "react";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

function SummaryCard({ label, revenue, orderCount }) {
  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-5">
      <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">{label}</p>
      <p className="font-display font-bold text-2xl text-ink">KES {revenue.toLocaleString()}</p>
      <p className="text-ink/40 text-xs mt-1">{orderCount} order{orderCount === 1 ? "" : "s"}</p>
    </div>
  );
}

export default function SalesPage() {
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState("day");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    api
      .get("/admin/sales/summary")
      .then((res) => setSummary(res.data && typeof res.data === "object" ? res.data : null))
      .catch(() => setError("Could not load sales summary. Is the backend reachable?"));
  }, []);

  function loadBreakdown() {
    const params = { period };
    if (start) params.start = start;
    if (end) params.end = end;
    setError("");
    api
      .get("/admin/sales", { params })
      .then((res) => setRows(asArray(res.data)))
      .catch(() => setError("Could not load the revenue breakdown. Is the backend reachable?"));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadBreakdown, [period]);

  const maxRevenue = Math.max(1, ...rows.map((r) => r.revenue));

  return (
    <div className="space-y-5">
      {error && <p className="text-danger text-sm">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard label="Today" revenue={summary?.today.revenue || 0} orderCount={summary?.today.orderCount || 0} />
        <SummaryCard label="This week" revenue={summary?.thisWeek.revenue || 0} orderCount={summary?.thisWeek.orderCount || 0} />
        <SummaryCard label="This month" revenue={summary?.thisMonth.revenue || 0} orderCount={summary?.thisMonth.orderCount || 0} />
      </div>

      <Section title="Revenue breakdown">
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <div className="flex gap-2">
            {["day", "week", "month"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-sm px-3 py-1.5 rounded-lg capitalize ${period === p ? "bg-ink text-paper" : "bg-ink/5 text-ink/60"}`}
              >
                By {p}
              </button>
            ))}
          </div>
          <label className="text-xs text-ink/50">
            From
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="block border border-ink/15 rounded-lg px-2 py-1 mt-1" />
          </label>
          <label className="text-xs text-ink/50">
            To
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="block border border-ink/15 rounded-lg px-2 py-1 mt-1" />
          </label>
          <button onClick={loadBreakdown} className="rounded-lg bg-ink text-paper text-sm px-3 py-1.5">Filter</button>
        </div>

        {rows.length === 0 ? (
          <p className="text-ink/40 text-sm">No completed orders in this range yet.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.period} className="flex items-center gap-3">
                <span className="w-24 text-xs font-mono text-ink/50 shrink-0">{r.period}</span>
                <div className="flex-1 bg-ink/5 rounded h-6 overflow-hidden">
                  <div
                    className="bg-amber h-full rounded"
                    style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="w-28 text-right text-sm font-mono text-ink shrink-0">
                  KES {r.revenue.toLocaleString()}
                </span>
                <span className="w-16 text-right text-xs text-ink/40 shrink-0">{r.orderCount} ord.</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
