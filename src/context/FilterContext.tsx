import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { FilterState, FilterAction } from '../types';

const initialState: FilterState = {
  years: [],
  brokers: [],
  filiais: [],
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'TOGGLE_YEAR': {
      const years = state.years.includes(action.year)
        ? state.years.filter(y => y !== action.year)
        : [...state.years, action.year];
      return { ...state, years };
    }
    case 'SET_YEARS':
      return { ...state, years: action.years };
    case 'TOGGLE_BROKER': {
      const brokers = state.brokers.includes(action.broker)
        ? state.brokers.filter(b => b !== action.broker)
        : [...state.brokers, action.broker];
      return { ...state, brokers };
    }
    case 'SET_BROKERS':
      return { ...state, brokers: action.brokers };
    case 'TOGGLE_FILIAL': {
      const filiais = state.filiais.includes(action.filial)
        ? state.filiais.filter(f => f !== action.filial)
        : [...state.filiais, action.filial];
      return { ...state, filiais };
    }
    case 'SET_FILIAIS':
      return { ...state, filiais: action.filiais };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const FilterContext = createContext<{
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
} | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider');
  return ctx;
}
