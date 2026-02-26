export interface BrokerSale {
  broker: string;
  level: string;
  meta: number;
  sold: number;
  percentAchieved: number;
  bonusCorretor: number;
  bonusGerente: number;
}

export interface MonthData {
  month: string;
  monthIndex: number;
  meta: number;
  totalSold: number;
  percentAchieved: number;
  difference: number;
  brokerSales: BrokerSale[];
}

export interface YearData {
  year: number;
  metaAnual: number;
  months: MonthData[];
  resumo: {
    totalSold: number;
    totalMeta: number;
  };
  vendorTotals?: { name: string; total: number }[];
}

export interface SaleRecord {
  broker: string;
  year: number;
  month: string;
  monthIndex: number;
  sold: number;
  meta: number;
  level: string;
  bonusCorretor: number;
  bonusGerente: number;
}

export interface LevelInfo {
  name: string;
  bonusCorretor: number;
  metaPeriodo1: number;
  metaPeriodo2: number;
  bonusGerencia: number;
}

export interface BrokerInfo {
  name: string;
  filial: string;
  level: string;
  active: boolean;
  year: number;
}

export interface LitoralData {
  company: string;
  years: Record<string, YearData>;
  brokers: BrokerInfo[];
  levels: LevelInfo[];
  sales: SaleRecord[];
  summary: {
    totalSalesValue: number;
    totalSalesCount: number;
    averageTicket: number;
    uniqueBrokers: number;
    yearsAvailable: number[];
  };
}

export interface FilterState {
  years: number[];
  brokers: string[];
  filiais: string[];
}

export type FilterAction =
  | { type: 'TOGGLE_YEAR'; year: number }
  | { type: 'SET_YEARS'; years: number[] }
  | { type: 'TOGGLE_BROKER'; broker: string }
  | { type: 'SET_BROKERS'; brokers: string[] }
  | { type: 'TOGGLE_FILIAL'; filial: string }
  | { type: 'SET_FILIAIS'; filiais: string[] }
  | { type: 'RESET' };

export interface DashboardStats {
  totalSalesCount: number;
  totalSalesValue: number;
  averageTicket: number;
  totalMeta: number;
  metaAchievedPercent: number;
  uniqueBrokers: number;
  salesByYear: Record<number, { count: number; value: number; meta: number }>;
  salesByBroker: { broker: string; count: number; value: number; avgTicket: number }[];
  monthlyTrend: { month: string; monthIndex: number; year: number; value: number; meta: number }[];
  topBrokers: { broker: string; totalSold: number; salesCount: number; avgTicket: number }[];
}
