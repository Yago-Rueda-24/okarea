import { CategoryType } from '../types/product';
import { Plus, Search, ShieldCheck, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function AdminHeader({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
}: AdminHeaderProps) {
  const categories = [
    { id: 'all', label: 'Todos' },
    { id: CategoryType.BOLSOS, label: 'Bolsos' },
    { id: CategoryType.CALZADO, label: 'Calzado' },
    { id: CategoryType.ROPA, label: 'Ropa' },
    { id: CategoryType.ACCESORIOS, label: 'Accesorios' },
  ];

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest text-purple-400">OKAREA</span>
            <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-md border border-purple-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> PANEL ADMIN DESKTOP
            </span>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Recargar datos de la API"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          {/* Create Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Nuevo Artículo
          </button>
        </div>

      </div>

      {/* Category Filter Tabs */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
