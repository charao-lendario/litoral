import { useFilteredData } from '../../hooks/useFilteredData';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export function BrokersView() {
  const { months } = useFilteredData();

  const monthsWithData = months.filter(m => m.brokerSales.some(bs => bs.sold > 0));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Corretores por Mes</h2>
      {monthsWithData.length === 0 ? (
        <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-8 text-center">
          <p className="text-gray-500">Nenhuma venda encontrada com os filtros atuais</p>
        </div>
      ) : (
        monthsWithData.map((m) => (
          <div key={`${m.year}-${m.monthIndex}`} className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{m.month} {m.year}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Meta: {formatCurrency(m.meta)}</span>
                <span>Vendido: <span className="text-sky">{formatCurrency(m.totalSold)}</span></span>
                <span>{formatPercent(m.percentAchieved)}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-ocean-600">
                    <th className="text-left py-2 pr-4">Corretor</th>
                    <th className="text-left py-2 pr-4">Nivel</th>
                    <th className="text-right py-2 pr-4">Meta</th>
                    <th className="text-right py-2 pr-4">Vendido</th>
                    <th className="text-right py-2 pr-4">% Atingido</th>
                    <th className="text-right py-2 pr-4">Bonus Corretor</th>
                    <th className="text-right py-2">Bonus Gerente</th>
                  </tr>
                </thead>
                <tbody>
                  {m.brokerSales.filter(bs => bs.meta > 0 || bs.sold > 0).map((bs) => (
                    <tr key={bs.broker} className="border-b border-ocean-700/50 text-gray-300">
                      <td className="py-2 pr-4 font-medium text-white">{bs.broker}</td>
                      <td className="py-2 pr-4">{bs.level}</td>
                      <td className="py-2 pr-4 text-right">{formatCurrency(bs.meta)}</td>
                      <td className="py-2 pr-4 text-right">
                        <span className={bs.sold >= bs.meta && bs.meta > 0 ? 'text-emerald' : bs.sold > 0 ? 'text-sky' : 'text-gray-500'}>
                          {formatCurrency(bs.sold)}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">{formatPercent(bs.percentAchieved)}</td>
                      <td className="py-2 pr-4 text-right">{bs.bonusCorretor > 0 ? formatCurrency(bs.bonusCorretor) : '-'}</td>
                      <td className="py-2 text-right">{bs.bonusGerente > 0 ? formatCurrency(bs.bonusGerente) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
