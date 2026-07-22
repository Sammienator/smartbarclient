import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

const AMBER = "#FFC22E";
const MOSS = "#00C29A";

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const revenue = payload.find((p) => p.dataKey === "revenue")?.value ?? 0;
  const orderCount = payload.find((p) => p.dataKey === "orderCount")?.value ?? 0;
  return (
    <div className="bg-ink text-paper rounded-lg px-3 py-2 text-xs shadow-pop border-2 border-ink dark:border-ink-line">
      <p className="font-mono text-paper/50 mb-1">{label}</p>
      <p>Revenue: <span className="font-mono text-amber">KES {revenue.toLocaleString()}</span></p>
      <p>Orders: <span className="font-mono">{orderCount}</span></p>
    </div>
  );
}

function SummaryCard({ label, revenue, orderCount }) {
  return (
    <div className="relative bg-white dark:bg-ink-soft rounded-2xl border-3 border-ink dark:border-ink-line shadow-pop p-5 overflow-hidden">
      <div className="absolute top-0 left-0 h-1.5 w-full bg-amber" />
      <p className="text-xs uppercase tracking-wide text-ink/40 dark:text-paper/40 mb-1 flex items-center gap-1">
        <TrendingUp size={12} /> {label}
      </p>
      <p className="font-display font-bold text-2xl text-ink dark:text-paper">KES {revenue.toLocaleString()}</p>
      <p className="text-ink/40 dark:text-paper/40 text-xs mt-1">{orderCount} order{orderCount === 1 ? "" : "s"}</p>
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

      <Section title="Revenue breakdown" accent="amber">
        <div className="flex flex-wrap gap-2 mb-4 items-end">
          <div className="flex gap-2">
            {["day", "week", "month"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-sm px-3 py-1.5 rounded-lg capitalize font-medium border-2 transition-colors ${
                  period === p ? "bg-ink text-paper border-ink dark:border-ink-line" : "bg-white dark:bg-ink-soft text-ink/60 dark:text-paper/60 border-ink/15 dark:border-ink-line hover:border-ink dark:border-ink-line dark:hover:border-paper"
                }`}
              >
                By {p}
              </button>
            ))}
          </div>
          <label className="text-xs text-ink/50 dark:text-paper/50">
            From
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="block border-2 border-ink/15 dark:border-ink-line rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-ink dark:border-ink-line" />
          </label>
          <label className="text-xs text-ink/50 dark:text-paper/50">
            To
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="block border-2 border-ink/15 dark:border-ink-line rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-ink dark:border-ink-line" />
          </label>
          <button onClick={loadBreakdown} className="rounded-lg bg-amber text-ink dark:text-paper border-2 border-ink dark:border-ink-line text-sm font-display font-semibold px-3 py-1.5">Filter</button>
        </div>

        {rows.length === 0 ? (
          <p className="text-ink/40 dark:text-paper/40 text-sm">No completed orders in this range yet.</p>
        ) : (
          <>
            <div className="h-72 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#11111410" vertical={false} />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#11111466" }} />
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fontSize: 11, fill: "#11111466" }}
                    tickFormatter={(v) => `KES ${v >= 1000 ? `${v / 1000}k` : v}`}
                  />
                  <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11, fill: "#11111466" }} allowDecimals={false} />
                  <Tooltip content={<SalesTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="revenue" dataKey="revenue" name="Revenue (KES)" fill={AMBER} radius={[4, 4, 0, 0]} maxBarSize={48} />
                  <Line yAxisId="orders" dataKey="orderCount" name="Orders" stroke={MOSS} strokeWidth={2.5} dot={{ r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-5">
              {rows.map((r) => (
                <div key={r.period} className="flex items-center gap-3">
                  <span className="w-24 text-xs font-mono text-ink/50 dark:text-paper/50 shrink-0">{r.period}</span>
                  <div className="flex-1 bg-ink/5 rounded h-6 overflow-hidden border border-ink/10">
                    <div
                      className="bg-amber h-full rounded"
                      style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="w-28 text-right text-sm font-mono text-ink dark:text-paper shrink-0">
                    KES {r.revenue.toLocaleString()}
                  </span>
                  <span className="w-16 text-right text-xs text-ink/40 dark:text-paper/40 shrink-0">{r.orderCount} ord.</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
