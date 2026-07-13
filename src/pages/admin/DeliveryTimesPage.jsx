import { useEffect, useState } from "react";
import api from "../../lib/api";
import Section from "../../components/Section";

export default function DeliveryTimesPage() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/admin/delivery-times").then((res) => setRows(res.data));
  }, []);

  return (
    <Section title="Delivery time per waiter">
      {rows.length === 0 ? (
        <p className="text-ink/40 text-sm">No completed orders yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 text-xs uppercase tracking-wide">
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
      )}
    </Section>
  );
}
