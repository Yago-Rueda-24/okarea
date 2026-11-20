import { useState, useMemo } from 'react';

const INITIAL_SLOTS = [
  { id: 'abrigo', slot: 'Capa Ext.', tipoPrenda: 'abrigo', prenda: null },
  { id: 'superior', slot: 'Top', tipoPrenda: 'superior', prenda: null },
  { id: 'inferior', slot: 'Bottom', tipoPrenda: 'inferior', prenda: null },
  { id: 'calzado', slot: 'Calzado', tipoPrenda: 'calzado', prenda: null },
  { id: 'accesorio', slot: 'Accesorio', tipoPrenda: 'accesorio', prenda: null },
];

const OCCASION_OPTIONS = [
  'Smart Casual',
  'Trabajo / Formal',
  'Eventos de Noche',
  'Fin de Semana & Viaje',
  'Diario',
];

const SEASON_OPTIONS = [
  'Todo Año',
  'Primavera/Verano',
  'Otoño/Invierno',
];

export default function OutfitBuilderCanvas({ isOpen, onClose, onSave, prendas = [] }) {
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('Smart Casual');
  const [season, setSeason] = useState('Todo Año');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState(INITIAL_SLOTS);

  // Slot selector drawer state
  const [activeSlotIdx, setActiveSlotIdx] = useState(null);
  const [filterMode, setFilterMode] = useState('recommended'); // 'recommended' | 'all'
  const [searchPrenda, setSearchPrenda] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter garments for the active slot
  const availableGarments = useMemo(() => {
    if (activeSlotIdx === null) return [];
    const activeSlot = slots[activeSlotIdx];

    return (prendas || []).filter((p) => {
      // Category / Type matching
      if (filterMode === 'recommended') {
        if (p.tipoPrenda !== activeSlot.tipoPrenda) return false;
      }
      // Text search
      if (searchPrenda.trim()) {
        const q = searchPrenda.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [prendas, activeSlotIdx, slots, filterMode, searchPrenda]);

  if (!isOpen) return null;

  const handleSelectPrendaForSlot = (prenda) => {
    if (activeSlotIdx === null) return;
    setSlots((prev) =>
      prev.map((s, idx) => (idx === activeSlotIdx ? { ...s, prenda } : s))
    );
    setActiveSlotIdx(null);
    setSearchPrenda('');
    setErrorMsg('');
  };

  const handleRemovePrendaFromSlot = (idx, e) => {
    if (e) e.stopPropagation();
    setSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, prenda: null } : s))
    );
  };

  const handleResetSlots = () => {
    setSlots(INITIAL_SLOTS);
    setActiveSlotIdx(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!outfitName.trim()) {
      setErrorMsg('Por favor escribe un nombre para el outfit.');
      return;
    }

    const filledSlots = slots.filter((s) => s.prenda !== null);
    if (filledSlots.length === 0) {
      setErrorMsg('Debes añadir al menos una prenda de tu armario para crear el look.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        nombre: outfitName.trim(),
        descripcion: description.trim() || undefined,
        ocasion: occasion,
        temporada: season,
        items: filledSlots.map((s) => ({
          prendaId: s.prenda.id,
          posicion: s.slot,
        })),
      };

      await onSave(payload);
      handleResetSlots();
      setOutfitName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Error al guardar outfit:', err);
      setErrorMsg('Hubo un problema al guardar el outfit. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalFilled = slots.filter((s) => s.prenda !== null).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container-highest/60 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-space-lg pt-space-lg pb-space-sm flex items-center justify-between border-b border-surface-container-highest/50 shrink-0">
          <div>
            <span className="font-label-sm text-primary uppercase tracking-wider font-semibold">
              Atelier Archive
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Crear Nuevo Outfit</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-md overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
            <div className="md:col-span-1">
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Nombre del Outfit <span className="text-primary">*</span>
              </label>
              <input
                required
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="Ej. Sastrería & Otoño..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Ocasión
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
              >
                {OCCASION_OPTIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Temporada
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
              >
                {SEASON_OPTIONS.map((sea) => (
                  <option key={sea} value={sea}>
                    {sea}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Notas o Descripción (Opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Combinación neutra para reuniones y comidas formales..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          {/* Styling Rack / Slots Section */}
          <div className="flex flex-col gap-space-xs pt-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Composición de Piezas ({totalFilled} seleccionadas):
              </span>
              {totalFilled > 0 && (
                <button
                  type="button"
                  onClick={handleResetSlots}
                  className="text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Limpiar ranuras
                </button>
              )}
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-5 gap-space-xs">
              {slots.map((slot, idx) => {
                const isCurrentActive = activeSlotIdx === idx;
                const hasPrenda = Boolean(slot.prenda);

                return (
                  <div key={slot.id} className="flex flex-col items-center gap-1">
                    <div
                      onClick={() => {
                        setActiveSlotIdx(isCurrentActive ? null : idx);
                        setFilterMode('recommended');
                        setSearchPrenda('');
                      }}
                      className={`w-full aspect-[3/4] rounded-xl p-1 flex flex-col items-center justify-center relative overflow-hidden transition-all cursor-pointer ${
                        hasPrenda
                          ? 'border border-surface-container-highest bg-surface-container-lowest shadow-sm hover:ring-2 hover:ring-primary/40'
                          : isCurrentActive
                          ? 'border-2 border-primary bg-primary/10 shadow-sm'
                          : 'border-2 border-dashed border-surface-container-highest bg-surface-container-low hover:border-primary/60 hover:bg-surface-container'
                      }`}
                    >
                      {hasPrenda ? (
                        <>
                          <img
                            alt={slot.prenda.title}
                            className="w-full h-full object-cover rounded-lg"
                            src={slot.prenda.detailImage || slot.prenda.image}
                          />
                          <button
                            type="button"
                            onClick={(e) => handleRemovePrendaFromSlot(idx, e)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-black rounded-full flex items-center justify-center text-white shadow-sm transition-colors cursor-pointer"
                            title="Quitar de este slot"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-outline hover:text-primary transition-colors p-1 text-center">
                          <span className="material-symbols-outlined text-2xl mb-1">
                            {isCurrentActive ? 'check_circle' : 'add_circle'}
                          </span>
                          <span className="font-label-sm text-[11px] leading-tight">
                            + Añadir
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-label-sm text-[11px] text-on-surface truncate w-full text-center font-medium">
                      {slot.slot}
                    </span>
                    {hasPrenda && (
                      <span className="font-body-sm text-[10px] text-outline truncate w-full text-center">
                        {slot.prenda.title}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Garment Picker Drawer (when a slot is active) */}
          {activeSlotIdx !== null && (
            <div className="p-space-md rounded-xl bg-surface-container-low border border-primary/30 flex flex-col gap-space-sm animate-in fade-in">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container-highest/60">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">checkroom</span>
                  <span className="font-title-md text-body-sm text-on-surface font-semibold">
                    Selecciona una prenda para la ranura "{slots[activeSlotIdx].slot}"
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSlotIdx(null)}
                  className="text-label-sm text-outline hover:text-on-surface cursor-pointer"
                >
                  Cerrar selector
                </button>
              </div>

              {/* Filter mode and search */}
              <div className="flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-1 bg-surface-container rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setFilterMode('recommended')}
                    className={`px-2.5 py-1 rounded-md text-label-sm transition-colors cursor-pointer ${
                      filterMode === 'recommended'
                        ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Recomendadas ({slots[activeSlotIdx].slot})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-2.5 py-1 rounded-md text-label-sm transition-colors cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Todo el Armario ({prendas?.length || 0})
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Buscar prenda..."
                  value={searchPrenda}
                  onChange={(e) => setSearchPrenda(e.target.value)}
                  className="px-2.5 py-1 bg-surface-container-lowest rounded-md text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary outline-none max-w-xs"
                />
              </div>

              {/* Garment Thumbnails Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-space-xs max-h-56 overflow-y-auto pr-1">
                {availableGarments.length === 0 ? (
                  <div className="col-span-full py-6 text-center text-outline text-body-sm">
                    No tienes prendas que coincidan con este filtro.
                    <button
                      type="button"
                      onClick={() => setFilterMode('all')}
                      className="text-primary underline ml-1 cursor-pointer"
                    >
                      Ver todas las prendas del armario
                    </button>
                  </div>
                ) : (
                  availableGarments.map((p) => {
                    const isAlreadySelected = slots.some((s) => s.prenda?.id === p.id);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPrendaForSlot(p)}
                        className={`group/garment relative aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer transition-all flex flex-col justify-end p-1.5 ${
                          isAlreadySelected
                            ? 'border-primary ring-2 ring-primary/40 opacity-70'
                            : 'border-transparent hover:border-primary hover:shadow-md'
                        }`}
                      >
                        <img
                          alt={p.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover/garment:scale-105 transition-transform"
                          src={p.detailImage || p.image}
                        />
                        <div className="relative z-10 bg-black/60 rounded p-1 text-white text-[10px] truncate leading-tight">
                          <span className="font-semibold block truncate">{p.title}</span>
                          <span className="text-white/80 block truncate">{p.brand}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-body-sm text-error bg-error-container/30 px-3 py-1.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          {/* Modal Footer */}
          <div className="pt-space-xs flex items-center justify-between border-t border-surface-container-highest/50 shrink-0">
            <span className="text-body-sm text-outline">
              {totalFilled === 0
                ? 'Ninguna prenda seleccionada aún'
                : `${totalFilled} prenda(s) asignadas al look`}
            </span>
            <div className="flex items-center gap-space-sm">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || totalFilled === 0 || !outfitName.trim()}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting && (
                  <span className="material-symbols-outlined animate-spin text-[16px]">
                    autorenew
                  </span>
                )}
                <span>{isSubmitting ? 'Guardando Outfit...' : 'Guardar Outfit'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
