export default function OutfitCard({ outfit, onDelete }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-space-md relative overflow-hidden group">
      {/* Top Header Row */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-space-xs">
          {outfit.occasion && (
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
              {outfit.occasion}
            </span>
          )}
          {outfit.temporada && (
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
              {outfit.temporada}
            </span>
          )}
          {outfit.esPropuestaEstilista && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>Propuesta Estilista</span>
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 pt-1">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors">
              {outfit.title}
            </h3>
            {outfit.subtitle && (
              <p className="font-body-sm text-body-sm text-outline mt-0.5">
                {outfit.subtitle}
              </p>
            )}
          </div>
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm(`¿Deseas eliminar "${outfit.title}" de tus outfits?`)) {
                  onDelete(outfit.id);
                }
              }}
              className="p-1.5 rounded-full text-outline hover:text-error hover:bg-error-container/40 transition-colors cursor-pointer shrink-0"
              title="Eliminar Outfit"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Composition Strip */}
      {outfit.items && outfit.items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm py-space-xs">
          {outfit.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex flex-col gap-space-xs bg-surface-container-low rounded-lg p-space-sm group/item"
            >
              <div className="h-36 w-full rounded overflow-hidden bg-surface-container-lowest flex items-center justify-center">
                {item.image ? (
                  <img
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                    src={item.image}
                  />
                ) : (
                  <span className="material-symbols-outlined text-outline text-3xl">apparel</span>
                )}
              </div>
              <span className="font-title-md text-body-sm text-on-surface truncate">
                {item.title}
              </span>
              <span className="font-label-sm text-label-sm text-outline truncate">
                {item.brand} {item.posicion ? `· ${item.posicion}` : ''}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 px-4 rounded-lg bg-surface-container-low text-center text-outline text-body-sm">
          Sin prendas asignadas en esta composición
        </div>
      )}

      {/* Footer Details */}
      <div className="flex items-center justify-between text-body-sm text-on-surface-variant font-body-sm pt-space-xs border-t border-surface-container-highest/40">
        <span className="flex items-center gap-1 text-label-sm text-outline">
          <span className="material-symbols-outlined text-[15px]">checkroom</span>
          <span>{outfit.items?.length || 0} prendas en el look</span>
        </span>
        {outfit.createdAt && (
          <span className="text-label-sm text-outline">
            {new Date(outfit.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </span>
        )}
      </div>
    </article>
  );
}
