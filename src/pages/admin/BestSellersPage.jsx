import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

const BAR_COLORS = ["#FFC22E", "#FF8A00", "#FF3D7A", "#00C29A", "#3757FF"];

function BestSellerTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-ink text-paper rounded-lg px-3 py-2 text-xs shadow-pop border-2 border-ink">
      <p className="font-mono text-paper/50 mb-1">{d.name}</p>
      <p>Sold: <span className="font-mono">{d.totalQuantitySold}</span></p>
      <p>Revenue: <span className="font-mono">KES {d.totalRevenue.toLocaleString()}</span></p>
    </div>
  );
}

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
    <Section title="Best sellers" accent="moss">
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <div className="flex gap-2 mb-4 items-end">
        <label className="text-xs text-ink/50">
          From
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="block border-2 border-ink/15 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-ink" />
        </label>
        <label className="text-xs text-ink/50">
          To
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="block border-2 border-ink/15 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-ink" />
        </label>
        <button onClick={load} className="rounded-lg bg-amber text-ink border-2 border-ink font-display font-semibold text-sm px-3 py-1.5">Filter</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-ink/40 text-sm">No completed orders in this range.</p>
      ) : (
        <>
          <div style={{ height: Math.max(180, rows.length * 40) }} className="-ml-2 mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#11111410" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#11111466" }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 12, fill: "#111114" }}
                />
                <Tooltip content={<BestSellerTooltip />} cursor={{ fill: "#11111408" }} />
                <Bar dataKey="totalQuantitySold" name="Qty sold" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {rows.map((r, i) => (
                    <Cell key={r._id} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ol className="space-y-1.5">
            {rows.map((r, i) => (
              <li key={r._id} className="flex justify-between text-sm">
                <span className="text-ink"><span className="text-ink/30 font-mono mr-2">{i + 1}</span>{r.name}</span>
                <span className="font-mono text-ink/60">{r.totalQuantitySold} sold · KES {r.totalRevenue}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Section>
  );
}
