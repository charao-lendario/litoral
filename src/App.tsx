import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FilterProvider } from './context/FilterContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { OverviewView } from './components/views/OverviewView';
import { BrokersView } from './components/views/BrokersView';
import { RankingView } from './components/views/RankingView';
import { MetasView } from './components/views/MetasView';
import { AllSalesView } from './components/views/AllSalesView';
import { ReportView } from './components/views/ReportView';

export default function App() {
  return (
    <BrowserRouter>
      <FilterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewView />} />
            <Route path="/corretores" element={<BrokersView />} />
            <Route path="/ranking" element={<RankingView />} />
            <Route path="/metas" element={<MetasView />} />
            <Route path="/vendas" element={<AllSalesView />} />
            <Route path="/relatorio" element={<ReportView />} />
          </Route>
        </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}
