import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RankedItem } from "../../lib/analysis/rankings";

type Props = {
  title: string;
  data: RankedItem[];
};

export default function BarChartCard({ title, data }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {data.length ? (
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="label">No data yet.</p>
      )}
    </div>
  );
}
