import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "../../lib/api";
import { asArray } from "../../lib/asArray";
import Section from "../../components/Section";

const MOSS = "#00C29A";

function fmtSeconds(s) {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function DeliveryTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-ink text-paper rounded-lg px-3 py-2 text-xs shadow-pop border-2 border-ink">
      <p className="font-mono text-paper/50 mb-1">{d.waiterName}</p>
      <p>Avg. close time: <span className="font-mono">{fmtSeconds(d.avgSeconds)}</span></p>
      <p>Orders: <span className="font-mono">{d.orderCount}</span></p>
    </div>
  );
}

export default function DeliveryTimesPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/admin/delivery-times")
      .then((res) => setRows(asArray(res.data)))
      .catch(() => setError("Could not load delivery times. Is the backend reachable?"));
  }, []);

  return (
    <Section title="Delivery time per waiter" accent="electric">
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {rows.length === 0 ? (
        <p className="text-ink/40 text-sm">No completed orders yet.</p>
      ) : (
        <>
        <div style={{ height: Math.max(160, rows.length * 44) }} className="-ml-2 mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#11111410" horizontal={false} />
              <XAxis type="number" tickFormatter={fmtSeconds} tick={{ fontSize: 11, fill: "#11111466" }} />
              <YAxis type="category" dataKey="waiterName" width={100} tick={{ fontSize: 12, fill: "#111114" }} />
              <Tooltip content={<DeliveryTooltip />} cursor={{ fill: "#11111408" }} />
              <Bar dataKey="avgSeconds" name="Avg. close time" fill={MOSS} radius={[0, 6, 6, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b-2 border-ink/10">
              <th className="pb-2">Waiter</th>
              <th className="pb-2">Avg. time to close</th>
              <th className="pb-2">Orders</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.waiterId} className="border-t border-ink/5">
                <td className="py-2 text-ink">{r.waiterName}</td>
                <td className="py-2 font-mono text-ink/70">{Math.round(r.avgSeconds)}s</td>
                <td className="py-2 font-mono text-ink/70">{r.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
    </Section>
  );
}
