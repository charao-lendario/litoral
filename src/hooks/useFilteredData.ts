import { useMemo } from 'react';
import { useFilterContext } from '../context/FilterContext';
import rawData from '../data/data.json';
import type { LitoralData, SaleRecord, MonthData } from '../types';

const data = rawData as LitoralData;

export function useFilteredData() {
  const { state } = useFilterContext();

  const filteredSales = useMemo(() => {
    let result = data.sales;

    if (state.years.length > 0) {
      result = result.filter(s => state.years.includes(s.year));
    }

    if (state.brokers.length > 0) {
      result = result.filter(s => state.brokers.includes(s.broker));
    }

    return result;
  }, [state]);

  const filteredMonths = useMemo(() => {
    const months: (MonthData & { year: number })[] = [];
    for (const [yearStr, yearData] of Object.entries(data.years)) {
      const year = Number(yearStr);
      if (state.years.length > 0 && !state.years.includes(year)) continue;
      for (const month of yearData.months) {
        let brokerSales = month.brokerSales;
        if (state.brokers.length > 0) {
          brokerSales = brokerSales.filter(bs => state.brokers.includes(bs.broker));
        }
        const totalSold = brokerSales.reduce((s, bs) => s + bs.sold, 0);
        months.push({
          ...month,
          year,
          brokerSales,
          totalSold,
        });
      }
    }
    return months;
  }, [state]);

  const allYears = useMemo(() => data.summary.yearsAvailable, []);

  const allBrokers = useMemo(() =>
    [...new Set(data.sales.map(s => s.broker))].sort(),
    []
  );

  const allFiliais = useMemo(() =>
    [...new Set(data.brokers.map(b => b.filial).filter(Boolean))].sort(),
    []
  );

  return {
    sales: filteredSales,
    allSales: data.sales,
    months: filteredMonths,
    data,
    allYears,
    allBrokers,
    allFiliais,
  };
}

export type { SaleRecord };
