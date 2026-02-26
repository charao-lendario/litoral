import { useMemo } from 'react';
import type { SaleRecord, MonthData, DashboardStats } from '../types';

export function useDashboardStats(
  sales: SaleRecord[],
  months: (MonthData & { year: number })[]
): DashboardStats {
  return useMemo(() => {
    const totalSalesValue = sales.reduce((s, r) => s + r.sold, 0);
    const totalSalesCount = sales.length;
    const averageTicket = totalSalesCount > 0 ? totalSalesValue / totalSalesCount : 0;
    const uniqueBrokers = new Set(sales.map(s => s.broker)).size;

    const totalMeta = months.reduce((s, m) => s + m.meta, 0);
    const totalSold = months.reduce((s, m) => s + m.totalSold, 0);
    const metaAchievedPercent = totalMeta > 0 ? totalSold / totalMeta : 0;

    const salesByYear: Record<number, { count: number; value: number; meta: number }> = {};
    for (const s of sales) {
      if (!salesByYear[s.year]) salesByYear[s.year] = { count: 0, value: 0, meta: 0 };
      salesByYear[s.year].count += 1;
      salesByYear[s.year].value += s.sold;
    }
    for (const m of months) {
      if (!salesByYear[m.year]) salesByYear[m.year] = { count: 0, value: 0, meta: 0 };
      salesByYear[m.year].meta += m.meta;
    }

    const brokerMap: Record<string, { count: number; value: number }> = {};
    for (const s of sales) {
      if (!brokerMap[s.broker]) brokerMap[s.broker] = { count: 0, value: 0 };
      brokerMap[s.broker].count += 1;
      brokerMap[s.broker].value += s.sold;
    }
    const salesByBroker = Object.entries(brokerMap)
      .map(([broker, d]) => ({
        broker,
        count: d.count,
        value: d.value,
        avgTicket: d.count > 0 ? d.value / d.count : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const monthlyTrend = months
      .map(m => ({
        month: m.month,
        monthIndex: m.monthIndex,
        year: m.year,
        value: m.totalSold,
        meta: m.meta,
      }))
      .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);

    const topBrokers = [...salesByBroker].slice(0, 10).map(b => ({
      broker: b.broker,
      totalSold: b.value,
      salesCount: b.count,
      avgTicket: b.avgTicket,
    }));

    return {
      totalSalesCount,
      totalSalesValue,
      averageTicket,
      totalMeta,
      metaAchievedPercent,
      uniqueBrokers,
      salesByYear,
      salesByBroker,
      monthlyTrend,
      topBrokers,
    };
  }, [sales, months]);
}
