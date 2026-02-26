import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-ocean-800 border-b border-ocean-600 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-gray-400 hover:text-sky transition-colors"
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Litoral Imóveis" className="h-10 w-auto" />
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">Litoral Imóveis</h1>
          <p className="text-xs text-gray-400 leading-tight">Dashboard de Vendas</p>
        </div>
      </div>
    </header>
  );
}
