import { useState, useMemo } from 'react';
import { OUTFITS_MOCK } from '../mocks/outfitsData';
import OutfitCard from '../components/outfits/OutfitCard';
import OutfitBuilderCanvas from '../components/outfits/OutfitBuilderCanvas';

const OCCASIONS = [
  'Todos',
  'Trabajo / Formal',
  'Smart Casual',
  'Eventos de Noche',
  'Fin de Semana & Viaje',
];

export default function OutfitsPage() {
  const [selectedOccasion, setSelectedOccasion] = useState('Todos');
  const [sortBy, setSortBy] = useState('recent');
  const [outfitsList, setOutfitsList] = useState(OUTFITS_MOCK);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);

  // Filter outfits by occasion and sort
  const filteredOutfits = useMemo(() => {
    let list = [...outfitsList];

    if (selectedOccasion !== 'Todos') {
      list = list.filter((o) => o.occasion === selectedOccasion);
    }

    if (sortBy === 'harmony') {
      list.sort((a, b) => b.harmonyScore - a.harmonyScore);
    } else if (sortBy === 'recent') {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [outfitsList, selectedOccasion, sortBy]);

  const handleSaveOutfit = (newOutfit) => {
    const created = {
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
    setOutfitsList((prev) => [created, ...prev]);
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
              Archivo visual de estilismos de autor. Curaduría personalizada, balances cromáticos y ensamblaje modular con piezas de tu colección personal.
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
                  className={`px-space-md py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer ${isSelected
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
              className={`px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer ${selectedOccasion === 'Clima Templado'
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

        {/* FULL-WIDTH EDITORIAL OUTFIT GALLERY (NO SIDEBAR CARD) */}
        <section className="w-full flex flex-col gap-space-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-space-xs">
              <h2 className="font-headline-md text-headline-md text-on-surface">Curaduría Editorial</h2>
              <span className="font-label-sm text-label-sm text-outline">
                (Mostrando {filteredOutfits.length} estilismos)
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container-low text-on-surface font-label-md text-label-md px-space-sm py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="harmony">Mayor armonía (%)</option>
              </select>
            </div>
          </div>

          {/* Outfits Stack: Displays full visual compositions */}
          <div className="flex flex-col gap-space-lg">
            {filteredOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onPlanCalendar={handlePlanCalendar}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        </section>
      </div>

      {/* On-demand Outfit Builder Modal Dialog */}
      {isBuilderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-space-lg shadow-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsBuilderModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
              title="Cerrar lienzo"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <OutfitBuilderCanvas
              onSaveOutfit={(outfit) => {
                handleSaveOutfit(outfit);
                setIsBuilderModalOpen(false);
              }}
              onScheduleLook={(name) => {
                alert(`Look "${name}" agendado con éxito.`);
                setIsBuilderModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
