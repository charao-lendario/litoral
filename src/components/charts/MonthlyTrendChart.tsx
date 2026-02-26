import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import type { DashboardStats } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  stats: DashboardStats;
}

export function MonthlyTrendChart({ stats }: Props) {
  const data = stats.monthlyTrend.map(m => ({
    label: `${m.month.substring(0, 3)}/${String(m.year).substring(2)}`,
    value: m.value,
    meta: m.meta,
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Vendas vs Meta Mensal</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a4471" />
            <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#0d2137', border: '1px solid #1a4471', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value)),
                name === 'value' ? 'Vendido' : 'Meta',
              ]}
            />
            <Bar dataKey="value" name="value" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={30} />
            <Line
              dataKey="meta"
              name="meta"
              stroke="#f87171"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-sky" />
          <span className="text-xs text-gray-400">Vendido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-1 rounded bg-coral" />
          <span className="text-xs text-gray-400">Meta</span>
        </div>
      </div>
    </div>
  );
}
