import { useState, useMemo, useEffect } from 'react';
import { OUTFITS_MOCK } from '../mocks/outfitsData';
import OutfitCard from '../components/outfits/OutfitCard';
import OutfitBuilderCanvas from '../components/outfits/OutfitBuilderCanvas';
import { getOutfitsApi, createOutfitApi, deleteOutfitApi } from '../api/outfits';
import { useAuth } from '../context/useAuth';

const OCCASIONS = [
  'Todos',
  'Trabajo / Formal',
  'Smart Casual',
  'Eventos de Noche',
  'Fin de Semana & Viaje',
];

export default function OutfitsPage() {
  const { isAuthenticated, token } = useAuth();
  const [selectedOccasion, setSelectedOccasion] = useState('Todos');
  const [sortBy] = useState('recent');
  const [outfitsList, setOutfitsList] = useState(OUTFITS_MOCK);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('okarea_token')));

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated && token) {
      getOutfitsApi()
        .then((serverOutfits) => {
          if (!ignore && serverOutfits && serverOutfits.length > 0) {
            setOutfitsList(serverOutfits);
          }
        })
        .catch((err) => {
          console.warn('No se pudieron sincronizar los outfits con el servidor:', err);
        })
        .finally(() => {
          if (!ignore) {
            setIsLoading(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, token]);

  // Filter outfits by occasion and sort
  const filteredOutfits = useMemo(() => {
    let list = [...outfitsList];

    if (selectedOccasion !== 'Todos') {
      list = list.filter((o) => o.occasion === selectedOccasion);
    }

    if (sortBy === 'harmony') {
      list.sort((a, b) => b.harmonyScore - a.harmonyScore);
    } else if (sortBy === 'recent') {
      list.sort((a, b) => {
        const idA = typeof a.id === 'number' ? a.id : 0;
        const idB = typeof b.id === 'number' ? b.id : 0;
        return idB - idA;
      });
    }

    return list;
  }, [outfitsList, selectedOccasion, sortBy]);

  // Save outfit with Axios
  const handleSaveOutfit = async (newOutfit) => {
    const payload = {
      nombre: newOutfit.name || 'Nueva Composición Atelier',
      descripcion: 'Composición personalizada creada desde el lienzo de atelier.',
      ocasion: 'Smart Casual',
      temporada: '18°C Suave',
      items: (newOutfit.slots || [])
        .filter((s) => s.id && !s.id.toString().startsWith('custom-'))
        .map((s) => ({
          prendaId: s.id,
          posicion: s.slot,
        })),
    };

    try {
      const created = await createOutfitApi(payload);
      setOutfitsList((prev) => [created, ...prev]);
    } catch (err) {
      console.warn('Error al guardar en el servidor con Axios, guardando en local:', err);
      const fallback = {
        id: Date.now(),
        title: newOutfit.name,
        subtitle: 'Composición personalizada creada desde el lienzo de atelier.',
        occasion: 'Smart Casual',
        weather: '18°C Suave',
        harmonyScore: 94,
        harmonyLabel: 'Excelente',
        lastWorn: 'Creado hoy',
        itemsCount: newOutfit.slots.length,
        items: newOutfit.slots.map((s, idx) => ({
          id: `custom-${idx}`,
          title: s.title,
          brand: 'Vestiaire Atelier',
          material: s.slot,
          image: s.image,
        })),
      };
      setOutfitsList((prev) => [fallback, ...prev]);
    }
  };

  const handleDeleteOutfit = async (id) => {
    try {
      await deleteOutfitApi(id);
    } catch (err) {
      console.warn('Eliminación local de outfit:', err);
    }
    setOutfitsList((prev) => prev.filter((o) => o.id !== id));
  };

  const handlePlanCalendar = (outfit) => {
    alert(`Añadiendo "${outfit.title}" al calendario semanal...`);
  };

  const handleDuplicate = (outfit) => {
    const dup = {
      ...outfit,
      id: Date.now(),
      title: `${outfit.title} (Variación)`,
      lastWorn: 'Nueva variación',
    };
    setOutfitsList((prev) => [dup, ...prev]);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Decorative ambient background */}
      <div className="relative w-full px-gutter py-space-lg flex flex-col gap-space-lg">
        {/* Glow circles */}
        <div className="absolute -top-32 right-12 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-24 left-1/3 w-80 h-80 rounded-full bg-secondary/5 blur-2xl pointer-events-none"></div>

        {/* Editorial Subheader & Main Action Tier */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                Atelier Curation Vol. IV
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-label-sm text-label-sm">Temporada Otoño / Invierno 2025</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-normal">
              Mis Outfits{' '}
              <span className="italic font-normal text-primary">&amp; Combinaciones</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Archivo visual de estilismos de autor. Curaduría personalizada, balances cromáticos y
              ensamblaje modular con piezas de tu colección personal.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button
              onClick={() => alert('Filtros avanzados desplegados.')}
              className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-highest transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Filtros Avanzados</span>
            </button>

            <button
              onClick={() => setIsBuilderModalOpen(true)}
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container shadow-md hover:shadow-xl transition-all cursor-pointer"
              id="open-builder-btn"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">palette</span>
              <span>+ Crear Nuevo Outfit</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Occasion Pills Bar */}
        <div className="flex flex-col gap-space-md pt-space-xs">
          {/* Quick Category / Occasion Chips */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xs scrollbar-none">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-xs mr-space-xs">
              Ocasión:
            </span>
            {OCCASIONS.map((occ) => {
              const isSelected = selectedOccasion === occ;
              return (
                <button
                  key={occ}
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                  }`}
                  type="button"
                >
                  {occ === 'Todos' ? `Todos (${outfitsList.length})` : occ}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedOccasion('Clima Templado')}
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer ${
                selectedOccasion === 'Clima Templado'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
              <span>Clima Templado (18°–24°)</span>
            </button>
          </div>
        </div>

        {/* Loading state banner */}
        {isLoading && (
          <div className="p-3 rounded-lg bg-surface-container-low text-on-surface-variant font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
            <span>Cargando composiciones del servidor atelier...</span>
          </div>
        )}

        {/* Main Outfits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              onDuplicate={handleDuplicate}
              onPlanCalendar={handlePlanCalendar}
              onDelete={handleDeleteOutfit}
              outfit={outfit}
            />
          ))}
        </div>
      </div>

      {/* Outfit Builder Modal */}
      <OutfitBuilderCanvas
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        onSave={handleSaveOutfit}
      />
    </div>
  );
}
