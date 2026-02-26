import { useMemo, useState } from 'react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { formatCurrency } from '../../utils/formatters';

export function AllSalesView() {
  const { sales } = useFilteredData();
  const [sortKey, setSortKey] = useState<'broker' | 'year' | 'month' | 'sold'>('sold');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const perPage = 20;

  const sorted = useMemo(() => {
    return [...sales].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'broker') cmp = a.broker.localeCompare(b.broker);
      else if (sortKey === 'year') cmp = a.year - b.year || a.monthIndex - b.monthIndex;
      else if (sortKey === 'month') cmp = a.monthIndex - b.monthIndex;
      else cmp = a.sold - b.sold;
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [sales, sortKey, sortDir]);

  const paginated = sorted.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sortIcon = (key: typeof sortKey) =>
    sortKey === key ? (sortDir === 'desc' ? ' \u2193' : ' \u2191') : '';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Todas as Vendas</h2>
      <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ocean-600">
                <th className="text-left py-2 pr-4 cursor-pointer hover:text-white" onClick={() => toggleSort('broker')}>
                  Corretor{sortIcon('broker')}
                </th>
                <th className="text-left py-2 pr-4 cursor-pointer hover:text-white" onClick={() => toggleSort('year')}>
                  Ano{sortIcon('year')}
                </th>
                <th className="text-left py-2 pr-4 cursor-pointer hover:text-white" onClick={() => toggleSort('month')}>
                  Mes{sortIcon('month')}
                </th>
                <th className="text-left py-2 pr-4">Nivel</th>
                <th className="text-right py-2 pr-4">Meta</th>
                <th className="text-right py-2 pr-4 cursor-pointer hover:text-white" onClick={() => toggleSort('sold')}>
                  Vendido{sortIcon('sold')}
                </th>
                <th className="text-right py-2 pr-4">Bonus Corretor</th>
                <th className="text-right py-2">Bonus Gerente</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s, i) => (
                <tr key={`${s.broker}-${s.year}-${s.monthIndex}-${i}`} className="border-b border-ocean-700/50 text-gray-300">
                  <td className="py-2 pr-4 font-medium text-white">{s.broker}</td>
                  <td className="py-2 pr-4">{s.year}</td>
                  <td className="py-2 pr-4">{s.month}</td>
                  <td className="py-2 pr-4">{s.level}</td>
                  <td className="py-2 pr-4 text-right">{formatCurrency(s.meta)}</td>
                  <td className="py-2 pr-4 text-right text-sky">{formatCurrency(s.sold)}</td>
                  <td className="py-2 pr-4 text-right">{s.bonusCorretor > 0 ? formatCurrency(s.bonusCorretor) : '-'}</td>
                  <td className="py-2 text-right">{s.bonusGerente > 0 ? formatCurrency(s.bonusGerente) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <span>{sorted.length} registros</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 rounded bg-ocean-700 hover:bg-ocean-600 disabled:opacity-30"
              >
                Anterior
              </button>
              <span>{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 rounded bg-ocean-700 hover:bg-ocean-600 disabled:opacity-30"
              >
                Proximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
