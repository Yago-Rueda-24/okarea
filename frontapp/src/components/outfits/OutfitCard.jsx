export default function OutfitCard({ outfit, onPlanCalendar, onDuplicate, onDelete }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-space-md relative overflow-hidden group">
      {/* Top Header Row */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            {outfit.occasion}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
            {outfit.harmonyScore}% Armonía
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              {outfit.weather.includes('Nocturno') ? 'nightlight' : 'cloud'}
            </span>
            <span>{outfit.weather}</span>
          </span>
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface pt-1 group-hover:text-primary transition-colors">
          {outfit.title}
        </h3>
        <span className="font-body-sm text-body-sm text-outline">{outfit.subtitle}</span>
      </div>

      {/* Visual Composition Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm py-space-xs">
        {outfit.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-space-xs bg-surface-container-low rounded-lg p-space-sm group/item"
          >
            <div className="h-36 w-full rounded overflow-hidden bg-surface-container-lowest">
              <img
                alt={item.title}
                className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                src={item.image}
              />
            </div>
            <span className="font-title-md text-body-sm text-on-surface truncate">
              {item.title}
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              {item.brand} {item.material ? `· ${item.material}` : ''}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Details & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container-highest/40">
        <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant font-body-sm">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-outline">history</span>
            <span>
              Última vez: <strong className="text-on-surface">{outfit.lastWorn}</strong>
            </span>
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-outline">auto_awesome</span>
            <span>
              <strong className="text-on-surface">{outfit.itemsCount} piezas</strong> combinadas
            </span>
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => onPlanCalendar && onPlanCalendar(outfit)}
            className="px-space-md py-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            <span>Planificar en Calendario</span>
          </button>
          <button
            onClick={() => onDuplicate && onDuplicate(outfit)}
            className="p-space-xs hover:bg-surface-container-high text-on-surface-variant rounded-lg transition-colors cursor-pointer"
            title="Guardar variación"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">content_copy</span>
          </button>
          <button
            onClick={() => alert(`Visualizando detalles y vista 3D de "${outfit.title}".`)}
            className="p-space-xs hover:bg-surface-container-high text-on-surface-variant rounded-lg transition-colors cursor-pointer"
            title="Ver en 3D / Detalle"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
          </button>
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`¿Deseas eliminar "${outfit.title}" del archivo de outfits?`)) {
                  onDelete(outfit.id);
                }
              }}
              className="p-space-xs hover:bg-error-container/50 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
              title="Eliminar Outfit"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
