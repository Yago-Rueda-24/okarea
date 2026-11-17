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
    handleUpdatePrenda,
    handleDeletePrenda,
    isLoadingPrendas,
  } = useOutletContext() || {};

  const [activeCategory, setActiveCategory] = useState('all');

  // Handle wear logging with Axios sync
  const handleLogWear = async (prendaId) => {
    const prenda = prendas?.find((p) => p.id === prendaId);
    const newCount = (prenda?.wearCount || 0) + 1;

    if (handleUpdatePrenda) {
      await handleUpdatePrenda(prendaId, {
        notasAdicionales: {
          ...(prenda?.raw?.notasAdicionales || {}),
          wearCount: newCount,
          status: 'Limpio',
        },
      });
    } else if (setPrendas) {
      setPrendas((prev) =>
        prev.map((p) => (p.id === prendaId ? { ...p, wearCount: newCount, status: 'Limpio' } : p))
      );
    }
  };

  // Toggle favorite status with Axios sync
  const handleToggleFavorite = async (prendaId) => {
    const prenda = prendas?.find((p) => p.id === prendaId);
    const newFav = !prenda?.isFavorite;

    if (handleUpdatePrenda) {
      await handleUpdatePrenda(prendaId, {
        notasAdicionales: {
          ...(prenda?.raw?.notasAdicionales || {}),
          isFavorite: newFav,
        },
      });
    } else if (setPrendas) {
      setPrendas((prev) =>
        prev.map((p) => (p.id === prendaId ? { ...p, isFavorite: newFav } : p))
      );
    }
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
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.materialTag?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [prendas, activeCategory, searchTerm]);

  // Selected prenda for technical side drawer
  const selectedPrenda = useMemo(
    () => (prendas || []).find((p) => p.id === selectedPrendaId) || (prendas && prendas[0]) || null,
    [prendas, selectedPrendaId]
  );

  return (
    <div className="flex flex-col w-full px-gutter py-space-lg">
      {/* 1. Header & Quick Metatags */}
      <section className="mb-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm border-b border-surface-container-highest/60">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Archivado en Salón Digital
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
              Catálogo de Prendas
            </h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-on-surface-variant font-medium">
              {filteredPrendas.length} piezas archivadas
            </span>
            <button
              onClick={onOpenNewPrenda}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-all cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Añadir Pieza</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Category Filters */}
      <CategoryFilters activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* 3. Main Workspace: Grid & Detail Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mt-space-md">
        {/* Garment Grid Column */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          {isLoadingPrendas && (
            <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
              <span>Sincronizando armario con el servidor atelier...</span>
            </div>
          )}

          {filteredPrendas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant text-center my-8">
              <span className="material-symbols-outlined text-5xl text-outline mb-space-sm">
                dry_cleaning
              </span>
              <p className="font-title-md text-title-md text-on-surface">
                No se encontraron piezas en esta selección
              </p>
              <p className="font-body-sm text-body-sm text-outline mt-1 mb-space-md">
                Prueba a restablecer los filtros de categoría o agregar una nueva prenda a tu archivo.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                }}
                className="px-4 py-2 bg-surface-container-high rounded-lg text-on-surface font-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
                type="button"
              >
                Ver Todas las Prendas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {filteredPrendas.map((prenda) => (
                <PrendaCard
                  isSelected={prenda.id === selectedPrendaId}
                  key={prenda.id}
                  onLogWear={handleLogWear}
                  onSelect={() => setSelectedPrendaId(prenda.id)}
                  onToggleFavorite={handleToggleFavorite}
                  prenda={prenda}
                />
              ))}
            </div>
          )}
        </div>

        {/* Technical Side Drawer Column */}
        <PrendaDrawer
          onLogWear={handleLogWear}
          onDeletePrenda={handleDeletePrenda}
          onSelectPairing={(id) => setSelectedPrendaId(id)}
          prenda={selectedPrenda}
        />
      </div>
    </div>
  );
}
