import { Trophy, TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { StatCard } from '../cards/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/colors';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function ReportView() {
  const { sales, months } = useFilteredData();
  const stats = useDashboardStats(sales, months);

  const rankingData = stats.salesByBroker.map((b, i) => ({
    ...b,
    rank: i + 1,
    color: CHART_COLORS[i % CHART_COLORS.length],
    pctTotal: stats.totalSalesValue > 0 ? (b.value / stats.totalSalesValue) * 100 : 0,
  }));

  const pieData = rankingData.slice(0, 6).map(b => ({
    name: b.broker,
    value: b.value,
    color: b.color,
  }));

  const productsSold = sales.reduce<Record<string, { broker: string; year: number; month: string; sold: number; count: number }[]>>((acc, s) => {
    const key = `${s.broker}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push({ broker: s.broker, year: s.year, month: s.month, sold: s.sold, count: 1 });
    return acc;
  }, {});

  const brokerProducts = Object.entries(productsSold).map(([broker, entries]) => ({
    broker,
    totalSold: entries.reduce((s, e) => s + e.sold, 0),
    salesCount: entries.length,
    months: entries.map(e => `${e.month}/${e.year}`).join(', '),
  })).sort((a, b) => b.totalSold - a.totalSold);

  const ticketData = rankingData.map(b => ({
    broker: b.broker,
    avgTicket: b.avgTicket,
  })).sort((a, b) => b.avgTicket - a.avgTicket);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Relatorio de Vendas</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendido"
          value={formatCurrency(stats.totalSalesValue)}
          icon={DollarSign}
          color="text-emerald"
        />
        <StatCard
          title="Ticket Medio"
          value={formatCurrency(stats.averageTicket)}
          icon={TrendingUp}
          color="text-sand-400"
        />
        <StatCard
          title="Produtos Vendidos"
          value={String(stats.totalSalesCount)}
          subtitle="Total de vendas realizadas"
          icon={ShoppingCart}
          color="text-sky"
        />
        <StatCard
          title="Corretores Ativos"
          value={String(stats.uniqueBrokers)}
          icon={Users}
          color="text-teal"
        />
      </div>

      {/* RANKING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-sand-400" />
            Ranking de Corretores
          </h3>
          <div className="space-y-3">
            {rankingData.map((b) => (
              <div key={b.broker} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  b.rank <= 3 ? 'bg-sand-500/20 text-sand-400' : 'bg-ocean-700 text-gray-400'
                }`}>
                  {b.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{b.broker}</span>
                    <span className="text-sm text-sky font-semibold ml-2">{formatCurrency(b.value)}</span>
                  </div>
                  <div className="w-full bg-ocean-700 rounded-full h-1.5 mt-1">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${b.pctTotal}%`, background: b.color }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                    <span>{b.count} vendas</span>
                    <span>{b.pctTotal.toFixed(1)}% do total</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribuicao de Vendas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0d2137', border: '1px solid #1a4471', borderRadius: 8 }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Vendido']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TICKET MEDIO */}
      <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-sand-400" />
          Ticket Medio por Corretor
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ticketData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a4471" />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <YAxis dataKey="broker" type="category" stroke="#64748b" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{ background: '#0d2137', border: '1px solid #1a4471', borderRadius: 8 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [formatCurrency(Number(value)), 'Ticket Medio']}
              />
              <Bar dataKey="avgTicket" fill="#2dd4bf" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRODUTOS VENDIDOS */}
      <div className="bg-ocean-800 rounded-xl border border-ocean-600 p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ShoppingCart size={16} className="text-sky" />
          Produtos Vendidos por Corretor
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-ocean-600">
                <th className="text-left py-2 pr-4">#</th>
                <th className="text-left py-2 pr-4">Corretor</th>
                <th className="text-right py-2 pr-4">Qtd. Vendas</th>
                <th className="text-right py-2 pr-4">Total Vendido</th>
                <th className="text-right py-2 pr-4">Ticket Medio</th>
                <th className="text-left py-2">Meses com Vendas</th>
              </tr>
            </thead>
            <tbody>
              {brokerProducts.map((b, i) => (
                <tr key={b.broker} className="border-b border-ocean-700/50 text-gray-300">
                  <td className="py-2.5 pr-4 font-bold text-white">{i + 1}</td>
                  <td className="py-2.5 pr-4 font-medium text-white">{b.broker}</td>
                  <td className="py-2.5 pr-4 text-right text-sky">{b.salesCount}</td>
                  <td className="py-2.5 pr-4 text-right text-emerald">{formatCurrency(b.totalSold)}</td>
                  <td className="py-2.5 pr-4 text-right">{formatCurrency(b.salesCount > 0 ? b.totalSold / b.salesCount : 0)}</td>
                  <td className="py-2.5 text-xs text-gray-500">{b.months}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
