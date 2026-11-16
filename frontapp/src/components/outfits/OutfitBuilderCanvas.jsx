import { useState } from 'react';
import { BUILDER_SLOTS_INITIAL } from '../../mocks/outfitsData';

export default function OutfitBuilderCanvas({ onSaveOutfit, onScheduleLook }) {
  const [slots, setSlots] = useState(BUILDER_SLOTS_INITIAL);
  const [outfitName, setOutfitName] = useState('Paseo de Otoño & Coctel');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [suggestionAdded, setSuggestionAdded] = useState(false);

  const handleRemoveSlot = (index) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, filled: false, image: null, title: `Añadir ${slot.slot}` } : slot
      )
    );
  };

  const handleResetSlots = () => {
    setSlots(BUILDER_SLOTS_INITIAL);
    setSuggestionAdded(false);
  };

  const handleAddSuggestedBag = () => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.slot === 'Accesorio') {
          return {
            ...slot,
            filled: true,
            title: 'Bolso Kelly Epsom',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuC_urONAYC0d_Ll6Txljb_wX7HWD4dkM2M29YeyswQcNcreyvUjgPGWF4c3nO_jOQVwO8BlT73Zlp08MX-uBnQEpy3TynqoNe_DPDAfzXEWuiA-o3XYw5i7CDB9O5gcOGNF_5Q_oWhIsqO6T3ShXEz5bzoDpSW0NjmKkBYuoMsxpKj9Ob3gJJsuceKW9q8yKOugVwywJsm0wQRVPGsIDa-0XVkiQMWoyy6J9UJreck',
          };
        }
        return slot;
      })
    );
    setSuggestionAdded(true);
  };

  const handleSave = () => {
    if (!outfitName.trim()) return;
    setShowSavedFeedback(true);
    if (onSaveOutfit) {
      onSaveOutfit({
        name: outfitName,
        slots: slots.filter((s) => s.filled),
      });
    }
    setTimeout(() => setShowSavedFeedback(false), 2400);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-lg relative overflow-hidden">
      {/* Top bar inside builder */}
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Constructor de Outfits</h3>
        </div>
        <span className="px-space-sm py-0.5 rounded-full bg-surface-container text-outline font-label-sm text-label-sm uppercase">
          Modo Activo
        </span>
      </div>

      {/* Styling Slot Rack */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Composición de Piezas:
          </span>
          <button
            onClick={handleResetSlots}
            className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
            id="reset-slots-btn"
            type="button"
          >
            Reiniciar Lienzo
          </button>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-5 gap-space-xs">
          {slots.map((slot, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 group/slot cursor-pointer">
              <div className="w-full aspect-[3/4] rounded-lg bg-surface-container p-1 flex flex-col items-center justify-center relative overflow-hidden group-hover/slot:bg-surface-container-high transition-colors">
                {slot.filled && slot.image ? (
                  <>
                    <img
                      alt={slot.title}
                      className="w-full h-full object-cover rounded"
                      src={slot.image}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSlot(idx);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-surface/80 rounded-full flex items-center justify-center text-on-surface hover:bg-surface shadow-xs transition-colors cursor-pointer"
                      title="Quitar prenda"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </>
                ) : (
                  <div
                    onClick={slot.slot === 'Accesorio' ? handleAddSuggestedBag : undefined}
                    className="w-full h-full flex flex-col items-center justify-center text-outline hover:text-primary transition-all p-1 text-center"
                  >
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                    <span className="font-label-sm text-[10px] text-center pt-1 leading-tight">
                      {slot.title}
                    </span>
                  </div>
                )}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface truncate w-full text-center">
                {slot.slot}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stylist AI Versatility & Metric Card */}
      <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
            <span className="font-title-md text-title-md text-on-surface">
              Versatilidad del Conjunto (IA)
            </span>
          </div>
          <span className="font-label-sm text-label-sm font-semibold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
            {suggestionAdded ? '94 / 100' : '88 / 100'}
          </span>
        </div>

        {/* Metric Progress Bars */}
        <div className="flex flex-col gap-space-xs pt-1">
          <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
            <span>Cohesión Cromática (Tonos Cálidos / Neutros)</span>
            <span className="font-semibold text-on-surface">
              {suggestionAdded ? '98%' : '95%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: suggestionAdded ? '98%' : '95%' }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-1">
            <span>Adaptabilidad Día &amp; Noche</span>
            <span className="font-semibold text-on-surface">
              {suggestionAdded ? '90%' : '82%'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: suggestionAdded ? '90%' : '82%' }}
            ></div>
          </div>
        </div>

        {/* Stylist Intelligent Suggestion Box */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-start gap-space-sm mt-space-xs">
          <span className="material-symbols-outlined text-tertiary text-[20px] flex-shrink-0 mt-0.5">
            tips_and_updates
          </span>
          <div className="flex flex-col gap-0.5 text-body-sm">
            <span className="font-semibold text-on-surface">Recomendación de Estilista Personal:</span>
            <p className="text-on-surface-variant">
              “Completa este look elevando el contraste con tu <strong>bolso Kelly en cuero Epsom tostado</strong> o añade los <strong>mocasines mocca</strong> para un balance urbano refinado.”
            </p>
            <div className="flex items-center gap-space-xs pt-1.5">
              {!suggestionAdded ? (
                <button
                  onClick={handleAddSuggestedBag}
                  className="text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold flex items-center gap-0.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Añadir Bolso Sugerido</span>
                </button>
              ) : (
                <span className="text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Bolso añadido al lienzo</span>
                </span>
              )}
              <span className="text-outline">·</span>
              <button
                onClick={() => alert('Sugerencia alternativa: incorpora bufanda de lana cachemira cruda.')}
                className="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm cursor-pointer"
                type="button"
              >
                Ver otra sugerencia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions in Builder */}
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-sm">
          <input
            className="flex-1 px-space-md py-space-sm bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Asigna un nombre (ej. Aperitivo en terraza)"
            type="text"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
          <button
            onClick={handleSave}
            className={`w-full py-space-sm font-label-md text-label-md rounded-lg transition-all flex items-center justify-center gap-space-xs shadow-sm cursor-pointer ${
              showSavedFeedback
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {showSavedFeedback ? 'check_circle' : 'bookmark_add'}
            </span>
            <span>{showSavedFeedback ? '¡Outfit Guardado!' : 'Guardar Outfit'}</span>
          </button>

          <button
            onClick={() => onScheduleLook && onScheduleLook(outfitName)}
            className="w-full py-space-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-lg transition-all flex items-center justify-center gap-space-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">event</span>
            <span>Agendar Look</span>
          </button>
        </div>
      </div>
    </div>
  );
}
