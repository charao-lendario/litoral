import { useState, useRef, useEffect } from 'react';
import { useFilterContext } from '../../context/FilterContext';
import { useFilteredData } from '../../hooks/useFilteredData';
import { RotateCcw, ChevronDown } from 'lucide-react';

function MultiSelect({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          selected.length > 0
            ? 'bg-sky/20 text-sky'
            : 'bg-ocean-700 text-gray-400 hover:text-white'
        }`}
      >
        {label}
        {selected.length > 0 && ` (${selected.length})`}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-ocean-800 border border-ocean-600 rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
          {selected.length > 0 && (
            <button
              onClick={onClear}
              className="w-full text-left px-3 py-1.5 text-xs text-coral hover:bg-ocean-700"
            >
              Limpar
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-ocean-700 ${
                selected.includes(opt) ? 'text-sky' : 'text-gray-400'
              }`}
            >
              {selected.includes(opt) ? '\u2713 ' : ''}{opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterBar() {
  const { state, dispatch } = useFilterContext();
  const { allYears, allBrokers } = useFilteredData();

  const hasFilters = state.years.length > 0 || state.brokers.length > 0;

  return (
    <div className="bg-ocean-800/50 border-b border-ocean-600 px-4 lg:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => dispatch({ type: 'SET_YEARS', years: [] })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              state.years.length === 0
                ? 'bg-sky/20 text-sky'
                : 'bg-ocean-700 text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          {allYears.map(year => (
            <button
              key={year}
              onClick={() => dispatch({ type: 'TOGGLE_YEAR', year })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                state.years.includes(year)
                  ? 'bg-sky/20 text-sky'
                  : 'bg-ocean-700 text-gray-400 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        <MultiSelect
          label="Corretor"
          options={allBrokers}
          selected={state.brokers}
          onToggle={(v) => dispatch({ type: 'TOGGLE_BROKER', broker: v })}
          onClear={() => dispatch({ type: 'SET_BROKERS', brokers: [] })}
        />
        {hasFilters && (
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-ocean-700 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
