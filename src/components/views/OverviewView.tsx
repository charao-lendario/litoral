import { DollarSign, Users, TrendingUp, Target, ShoppingCart } from 'lucide-react';
import { useFilteredData } from '../../hooks/useFilteredData';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { StatCard } from '../cards/StatCard';
import { SalesByYearChart } from '../charts/SalesByYearChart';
import { MonthlyTrendChart } from '../charts/MonthlyTrendChart';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export function OverviewView() {
  const { sales, months } = useFilteredData();
  const stats = useDashboardStats(sales, months);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Visao Geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Vendido"
          value={formatCurrency(stats.totalSalesValue)}
          icon={DollarSign}
          color="text-emerald"
        />
        <StatCard
          title="Qtd. Vendas"
          value={String(stats.totalSalesCount)}
          icon={ShoppingCart}
          color="text-sky"
        />
        <StatCard
          title="Ticket Medio"
          value={formatCurrency(stats.averageTicket)}
          icon={TrendingUp}
          color="text-sand-400"
        />
        <StatCard
          title="Meta Atingida"
          value={formatPercent(stats.metaAchievedPercent)}
          subtitle={`Meta: ${formatCurrency(stats.totalMeta)}`}
          icon={Target}
          color="text-coral"
        />
        <StatCard
          title="Corretores Ativos"
          value={String(stats.uniqueBrokers)}
          icon={Users}
          color="text-teal"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesByYearChart stats={stats} />
        <MonthlyTrendChart stats={stats} />
      </div>
    </div>
  );
}
