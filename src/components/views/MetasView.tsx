import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export function MetasView() {
  const { sales, months, data } = useFilteredData();
  const stats = useDashboardStats(sales, months);

  const yearEntries = Object.entries(stats.salesByYear).sort(([a], [b]) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Metas</h2>
      {yearEntries.map(([year, d]) => {
        const yearData = data.years[year];
        const metaAnual = yearData?.metaAnual ?? 0;
        const pctAnual = metaAnual > 0 ? d.value / metaAnual : 0;

        return (
          <div key={year} className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{year}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">Meta Anual: <span className="text-coral">{formatCurrency(metaAnual)}</span></span>
                <span className="text-gray-400">Vendido: <span className="text-emerald">{formatCurrency(d.value)}</span></span>
                <span className="text-gray-400">Atingido: <span className="text-sky">{formatPercent(pctAnual)}</span></span>
              </div>
            </div>
            <div className="w-full bg-ocean-700 rounded-full h-3 mb-4">
              <div
                className="bg-sky h-3 rounded-full transition-all"
                style={{ width: `${Math.min(pctAnual * 100, 100)}%` }}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-ocean-600">
                    <th className="text-left py-2 pr-4">Mes</th>
                    <th className="text-right py-2 pr-4">Meta</th>
                    <th className="text-right py-2 pr-4">Vendido</th>
                    <th className="text-right py-2 pr-4">% Atingido</th>
                    <th className="text-right py-2">Diferenca</th>
                  </tr>
                </thead>
                <tbody>
                  {months
                    .filter(m => m.year === Number(year))
                    .map(m => (
                      <tr key={m.monthIndex} className="border-b border-ocean-700/50 text-gray-300">
                        <td className="py-2 pr-4 font-medium text-white">{m.month}</td>
                        <td className="py-2 pr-4 text-right">{formatCurrency(m.meta)}</td>
                        <td className="py-2 pr-4 text-right">
                          <span className={m.totalSold >= m.meta && m.totalSold > 0 ? 'text-emerald' : m.totalSold > 0 ? 'text-sky' : 'text-gray-500'}>
                            {formatCurrency(m.totalSold)}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right">{formatPercent(m.meta > 0 ? m.totalSold / m.meta : 0)}</td>
                        <td className={`py-2 text-right ${m.difference >= 0 ? 'text-emerald' : 'text-coral'}`}>
                          {formatCurrency(m.totalSold - m.meta)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
