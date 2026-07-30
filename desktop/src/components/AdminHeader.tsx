import { CategoryType } from '../types/product';
import { Plus, Search, ShieldCheck, RefreshCw, ShoppingBag, Calendar, Compass } from 'lucide-react';

export type MainTab = 'moda' | 'eventos' | 'lugares';

interface AdminHeaderProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function AdminHeader({
  activeTab,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
}: AdminHeaderProps) {
  const mainTabs: { id: MainTab; label: string; icon: any }[] = [
    { id: 'moda', label: 'Moda', icon: ShoppingBag },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'lugares', label: 'Lugares', icon: Compass },
  ];

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: CategoryType.BOLSOS, label: 'Bolsos' },
    { id: CategoryType.CALZADO, label: 'Calzado' },
    { id: CategoryType.ROPA, label: 'Ropa' },
    { id: CategoryType.ACCESORIOS, label: 'Accesorios' },
  ];

  const getCreateButtonText = () => {
    switch (activeTab) {
      case 'eventos':
        return 'Nuevo Evento';
      case 'lugares':
        return 'Nuevo Lugar';
      case 'moda':
      default:
        return 'Nuevo Artículo';
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'eventos':
        return 'Buscar eventos...';
      case 'lugares':
        return 'Buscar lugares...';
      case 'moda':
      default:
        return 'Buscar catálogo de moda...';
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Main Navigation Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-widest text-purple-400">OKAREA</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-md border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ADMIN
            </span>
          </div>

          {/* Main Section Navigation (Moda, Eventos, Lugares) */}
          <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Recargar datos de la API"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          {/* Create Button */}
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> {getCreateButtonText()}
          </button>
        </div>

      </div>

      {/* Sub-Category Filter Tabs (Only shown when Moda is selected) */}
      {activeTab === 'moda' && (
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
      )}
    </header>
  );
}
