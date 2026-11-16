import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import CategoryFilters from '../components/prendas/CategoryFilters';
import PrendaCard from '../components/prendas/PrendaCard';
import PrendaDrawer from '../components/prendas/PrendaDrawer';

export default function PrendasPage() {
  const {
    searchTerm,
    onOpenNewPrenda,
    prendas,
    setPrendas,
    selectedPrendaId,
    setSelectedPrendaId,
  } = useOutletContext() || {};

  const [activeCategory, setActiveCategory] = useState('all');

  // Handle wear logging
  const handleLogWear = (prendaId) => {
    if (!setPrendas) return;
    setPrendas((prev) =>
      prev.map((p) => {
        if (p.id !== prendaId) return p;
        return {
          ...p,
          wearCount: p.wearCount + 1,
          status: 'Limpio',
        };
      })
    );
  };

  // Toggle favorite status
  const handleToggleFavorite = (prendaId) => {
    if (!setPrendas) return;
    setPrendas((prev) =>
      prev.map((p) => (p.id === prendaId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Filtered garments based on category and global search
  const filteredPrendas = useMemo(() => {
    let list = prendas ? [...prendas] : [];

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Search query filter
    if (searchTerm && searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.materialTag?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [prendas, activeCategory, searchTerm]);

  // Selected prenda object for the drawer
  const selectedPrenda = useMemo(() => {
    if (!prendas || prendas.length === 0) return null;
    const found = prendas.find((p) => p.id === selectedPrendaId);
    return found || filteredPrendas[0] || prendas[0];
  }, [prendas, selectedPrendaId, filteredPrendas]);

  // Handle pairing selection from drawer
  const handleSelectPairing = (pairId) => {
    if (prendas?.some((p) => p.id === pairId) && setSelectedPrendaId) {
      setSelectedPrendaId(pairId);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Ambient Glow & Editorial Header */}
      <div className="relative w-full px-gutter lg:px-margin pt-space-lg pb-space-xl overflow-hidden">
        {/* Glow circles */}
        <div className="absolute -top-32 right-12 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-24 left-1/3 w-80 h-80 rounded-full bg-secondary/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-space-lg">
          {/* Editorial Title & Action CTAs */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-widest mb-space-xs">
                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                <span>Atelier Archive Privé</span>
                <span className="text-outline-variant">•</span>
                <span className="text-on-surface-variant font-normal">Inventario Activo</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                Mi Armario Digital
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
                Curaduría textil y catalogación inteligente de archivo personal.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <button
                onClick={onOpenNewPrenda}
                className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-all shadow-md font-label-md text-label-md cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px]">add</span>
                <span>+ Nueva Prenda</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pill Filter Bar */}
        <div className="mt-space-lg flex flex-col gap-space-md">
          <CategoryFilters
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Main Content Workspace (Editorial Grid + Quick Preview Drawer) */}
        <div className="mt-space-lg grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Primary Garments Editorial Grid (XL: 8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-outline uppercase tracking-wider">
                Mostrando {filteredPrendas.length} piezas archivadas
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Filtro activo:{' '}
                {activeCategory === 'all' ? 'Todas las categorías' : activeCategory}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {filteredPrendas.map((prenda) => (
                <PrendaCard
                  key={prenda.id}
                  prenda={prenda}
                  isSelected={prenda.id === selectedPrenda?.id}
                  onSelect={(p) => setSelectedPrendaId && setSelectedPrendaId(p.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Pagination & Archive Footer Info */}
            <div className="mt-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Página <strong className="text-on-surface">1</strong> de 25 • Total de{' '}
                <strong className="text-on-surface">148 piezas</strong> en archivo
              </span>

              <div className="flex items-center gap-space-xs">
                <button
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-outline hover:text-on-surface font-label-md text-label-md disabled:opacity-40 cursor-pointer"
                  disabled
                  type="button"
                >
                  Anterior
                </button>
                <button
                  className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center cursor-pointer"
                  type="button"
                >
                  1
                </button>
                <button
                  className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center cursor-pointer"
                  type="button"
                >
                  2
                </button>
                <button
                  className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center cursor-pointer"
                  type="button"
                >
                  3
                </button>
                <span className="text-outline px-1">...</span>
                <button
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md cursor-pointer"
                  type="button"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Quick Inspection Floating Drawer Panel (XL: 4 cols) */}
          <PrendaDrawer
            prenda={selectedPrenda}
            onLogWear={handleLogWear}
            onSelectPairing={handleSelectPairing}
          />
        </div>
      </div>
    </div>
  );
}
