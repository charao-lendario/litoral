import { Trophy } from 'lucide-react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { BrokerRankingChart } from '../charts/BrokerRankingChart';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';

export function RankingView() {
  const { sales, months } = useFilteredData();
  const stats = useDashboardStats(sales, months);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Trophy size={24} className="text-sand-400" />
        Ranking de Vendas
      </h2>
      <BrokerRankingChart stats={stats} />
      <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Detalhamento</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ocean-600">
                <th className="text-left py-2 pr-4">#</th>
                <th className="text-left py-2 pr-4">Corretor</th>
                <th className="text-right py-2 pr-4">Vendas</th>
                <th className="text-right py-2 pr-4">Total Vendido</th>
                <th className="text-right py-2 pr-4">Ticket Medio</th>
                <th className="text-right py-2">% do Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.salesByBroker.map((b, i) => (
                <tr key={b.broker} className="border-b border-ocean-700/50 text-gray-300">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="font-bold text-white">{i + 1}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-white">{b.broker}</td>
                  <td className="py-2.5 pr-4 text-right">{b.count}</td>
                  <td className="py-2.5 pr-4 text-right text-sky">{formatCurrency(b.value)}</td>
                  <td className="py-2.5 pr-4 text-right">{formatCurrency(b.avgTicket)}</td>
                  <td className="py-2.5 text-right">
                    {stats.totalSalesValue > 0
                      ? `${((b.value / stats.totalSalesValue) * 100).toFixed(1)}%`
                      : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
