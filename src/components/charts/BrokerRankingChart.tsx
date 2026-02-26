import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';

interface Props {
  stats: DashboardStats;
}

export function BrokerRankingChart({ stats }: Props) {
  const data = stats.topBrokers.map((b, i) => ({
    broker: b.broker,
    value: b.totalSold,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Top Corretores por Valor</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a4471" />
            <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <YAxis dataKey="broker" type="category" stroke="#64748b" fontSize={11} width={100} />
            <Tooltip
              contentStyle={{ background: '#0d2137', border: '1px solid #1a4471', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(Number(value)), 'Total Vendido']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
