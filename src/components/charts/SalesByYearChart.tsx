import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DashboardStats } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { YEAR_COLORS } from '../../utils/colors';

interface Props {
  stats: DashboardStats;
}

export function SalesByYearChart({ stats }: Props) {
  const data = Object.entries(stats.salesByYear)
    .map(([year, d]) => ({
      year: Number(year),
      value: d.value,
      meta: d.meta,
      count: d.count,
    }))
    .sort((a, b) => a.year - b.year);

  if (data.length === 0) {
    return (
      <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5 flex items-center justify-center h-80">
        <p className="text-gray-500 text-sm">Nenhum dado para exibir</p>
      </div>
    );
  }

  return (
    <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Vendas por Ano</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a4471" />
            <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#0d2137', border: '1px solid #1a4471', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [formatCurrency(Number(value)), 'Valor']}
            />
            <Bar dataKey="value" name="Vendido" radius={[4, 4, 0, 0]}>
              {data.map(entry => (
                <Cell key={entry.year} fill={YEAR_COLORS[entry.year] ?? '#38bdf8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-3">
        {data.map(d => (
          <div key={d.year} className="text-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: YEAR_COLORS[d.year] }} />
              <span className="text-xs text-gray-400">{d.year}</span>
            </div>
            <p className="text-xs text-gray-500">{formatCurrency(d.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
