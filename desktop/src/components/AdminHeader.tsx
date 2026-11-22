import { CategoryType } from '../types/product';
import {
  Plus,
  Search,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Calendar,
  Compass,
  BarChart3,
  MessageSquare,
  Sparkles,
  BookOpen,
  Shirt,
} from 'lucide-react';

export type WorkspaceType = 'blog' | 'armario';
export type BlogTab = 'moda' | 'eventos' | 'lugares' | 'estadisticas' | 'chat';
export type ArmarioTab = 'asesorias';
export type MainTab = BlogTab | ArmarioTab;

interface AdminHeaderProps {
  activeWorkspace: WorkspaceType;
  onSelectWorkspace: (ws: WorkspaceType) => void;
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
  activeWorkspace,
  onSelectWorkspace,
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
  const blogTabs: { id: BlogTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'moda', label: 'Moda', icon: ShoppingBag },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'lugares', label: 'Lugares', icon: Compass },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'chat', label: 'Mensajes', icon: MessageSquare },
  ];

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: CategoryType.BOLSOS, label: 'Bolsos' },
    { id: CategoryType.CALZADO, label: 'Calzado' },
    { id: CategoryType.ROPA, label: 'Ropa' },
    { id: CategoryType.ACCESORIOS, label: 'Accesorios' },
    { id: CategoryType.TIENDAS, label: 'Tiendas' },
    { id: CategoryType.ARTESANOS, label: 'Artesanos' },
    { id: CategoryType.HOMBRE, label: 'Hombre' },
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

  const isContentTab =
    activeWorkspace === 'blog' &&
    (activeTab === 'moda' || activeTab === 'eventos' || activeTab === 'lugares');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#eee7e3] sticky top-0 z-40 shadow-xs">
      {/* 1. Nivel Superior: Identidad, Selector de Espacio y Acciones Globales */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Workspace Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1e1b19]">
                  OKAREA
                </span>
                <span className="font-serif italic text-primary text-xl font-normal">
                  Atelier
                </span>
              </div>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#88726c]">
                Panel de Administración
              </span>
            </div>
            <span className="text-[10px] bg-[#d3e9cc] text-[#394b36] font-bold px-2 py-0.5 rounded-full border border-[#b8ccb1] flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-[#51634d]" /> ADMIN
            </span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-[#eee7e3]" />

          {/* Selector de Espacio Separado: Blog vs Armario */}
          <div className="flex items-center p-1 rounded-xl bg-[#faf2ee] border border-[#eee7e3] shadow-2xs">
            <button
              type="button"
              onClick={() => {
                onSelectWorkspace('blog');
                if (activeTab === 'asesorias') {
                  onSelectTab('moda');
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeWorkspace === 'blog'
                  ? 'bg-[#94452c] text-white shadow-xs font-bold'
                  : 'text-[#55433e] hover:text-[#1e1b19] hover:bg-[#eee7e3]/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blog OkArea</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectWorkspace('armario');
                onSelectTab('asesorias');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeWorkspace === 'armario'
                  ? 'bg-[#94452c] text-white shadow-xs font-bold'
                  : 'text-[#55433e] hover:text-[#1e1b19] hover:bg-[#eee7e3]/60'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Armario Atelier</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                  activeWorkspace === 'armario'
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-[#b35c41]/10 text-primary font-bold'
                }`}
              >
                VIP
              </span>
            </button>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {isContentTab && (
            <button
              onClick={onOpenCreateModal}
              className="bg-[#94452c] hover:bg-[#793019] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{getCreateButtonText()}</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-[#55433e] hover:text-[#1e1b19] bg-[#faf2ee] hover:bg-[#eee7e3] border border-[#eee7e3] rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            title="Refrescar contenido"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Nivel Inferior: Subnavegación Contextual */}
      <div className="bg-[#faf2ee]/70 border-t border-[#eee7e3] px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Si está en el espacio BLOG */}
          {activeWorkspace === 'blog' && (
            <>
              {/* Pestañas del Blog */}
              <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {blogTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => onSelectTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-white text-primary font-semibold shadow-2xs border border-[#eee7e3]'
                          : 'text-[#55433e] hover:text-[#1e1b19] hover:bg-white/50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-[#88726c]'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Buscador para pestañas de contenido */}
              {isContentTab && (
                <div className="relative w-full md:w-72">
                  <Search className="w-3.5 h-3.5 text-[#88726c] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={getSearchPlaceholder()}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#eee7e3] rounded-xl text-xs text-[#1e1b19] placeholder:text-[#88726c] focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#88726c] hover:text-[#1e1b19]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Si está en el espacio ARMARIO */}
          {activeWorkspace === 'armario' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-white text-primary rounded-lg border border-[#eee7e3] shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Solicitudes de Asesoría VIP</span>
                </span>
                <span className="text-xs text-[#88726c]">
                  Gestión de citas de 1 hora, revisión de requerimientos y armario del usuario solicitante
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Categorías secundarias para la pestaña de Moda */}
        {activeWorkspace === 'blog' && activeTab === 'moda' && (
          <div className="max-w-7xl mx-auto pt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[11px] font-semibold text-[#88726c] mr-1 uppercase tracking-wider">
              Categoría:
            </span>
            {categories.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-all whitespace-nowrap cursor-pointer ${
                    isCatActive
                      ? 'bg-[#b35c41]/15 text-primary font-bold border border-[#b35c41]/30'
                      : 'bg-white/60 text-[#55433e] hover:bg-white hover:text-[#1e1b19] border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
