import { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import OutfitCard from '../components/outfits/OutfitCard';
import OutfitBuilderCanvas from '../components/outfits/OutfitBuilderCanvas';
import { getOutfitsApi, createOutfitApi, deleteOutfitApi } from '../api/outfits';
import { useAuth } from '../context/useAuth';

const OCCASIONS = [
  'Todos',
  'Smart Casual',
  'Trabajo / Formal',
  'Eventos de Noche',
  'Fin de Semana & Viaje',
  'Diario',
];

export default function OutfitsPage() {
  const { isAuthenticated, token } = useAuth();
  const { prendas } = useOutletContext() || {};

  const [selectedOccasion, setSelectedOccasion] = useState('Todos');
  const [outfitsList, setOutfitsList] = useState([]);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('okarea_token')));

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated && token) {
      getOutfitsApi()
        .then((serverOutfits) => {
          if (!ignore) {
            setOutfitsList(serverOutfits || []);
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

  // Filter outfits by occasion
  const filteredOutfits = useMemo(() => {
    let list = [...outfitsList];

    if (selectedOccasion !== 'Todos') {
      list = list.filter((o) => o.occasion === selectedOccasion);
    }

    return list;
  }, [outfitsList, selectedOccasion]);

  // Save outfit with Axios and update reactive list
  const handleSaveOutfit = async (payload) => {
    const created = await createOutfitApi(payload);
    setOutfitsList((prev) => [created, ...prev]);
  };

  // Delete outfit via Axios
  const handleDeleteOutfit = async (id) => {
    try {
      await deleteOutfitApi(id);
    } catch (err) {
      console.warn('Error al eliminar outfit del servidor:', err);
    }
    setOutfitsList((prev) => prev.filter((o) => o.id !== id));
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
                Atelier Curation
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-label-sm text-label-sm">Colección Personal</span>
            </div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight font-normal">
              Mis Outfits{' '}
              <span className="italic font-normal text-primary">&amp; Combinaciones</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Crea y visualiza tus estilismos combinando piezas de tu propio armario. Ensamblaje modular
              y composiciones guardadas para cualquier ocasión.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
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
          </div>
        </div>

        {/* Loading state banner */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>
            <span>Cargando tus outfits desde el atelier...</span>
          </div>
        )}

        {/* Main Outfits Grid or Empty State */}
        {!isLoading && filteredOutfits.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant text-center my-8 max-w-lg mx-auto w-full">
            <span className="material-symbols-outlined text-5xl text-outline mb-space-sm">
              auto_awesome_motion
            </span>
            <p className="font-title-lg text-title-lg text-on-surface font-semibold">
              {selectedOccasion === 'Todos'
                ? 'No tienes outfits creados aún'
                : `No hay outfits para la ocasión "${selectedOccasion}"`}
            </p>
            <p className="font-body-sm text-body-sm text-outline mt-1 mb-space-md max-w-sm">
              Combina piezas de tu propio armario para diseñar composiciones listas para usar.
            </p>
            <button
              onClick={() => setIsBuilderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-space-md py-2 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary-container transition-all cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">palette</span>
              <span>+ Crear Mi Primer Outfit</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                onDelete={handleDeleteOutfit}
                outfit={outfit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Outfit Builder Modal */}
      {isBuilderModalOpen && (
        <OutfitBuilderCanvas
          isOpen={isBuilderModalOpen}
          onClose={() => setIsBuilderModalOpen(false)}
          onSave={handleSaveOutfit}
          prendas={prendas || []}
        />
      )}
    </div>
  );
}
