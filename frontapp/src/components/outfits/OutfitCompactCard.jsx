export default function OutfitCompactCard({ outfit, onWear }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md">
      <div className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            {outfit.occasion}
          </span>
          <span className="font-label-sm text-label-sm font-semibold text-primary">
            {outfit.harmonyScore}% Armonía
          </span>
        </div>
        <h4 className="font-title-lg text-title-lg text-on-surface">{outfit.title}</h4>
        <p className="font-body-sm text-body-sm text-outline">{outfit.subtitle}</p>
      </div>

      {/* 3-thumbnail strip */}
      <div className="flex items-center gap-space-xs overflow-hidden rounded-lg bg-surface-container-low p-space-xs">
        {outfit.items.map((item) => (
          <div
            key={item.id}
            className="w-16 h-20 rounded bg-surface-container-lowest overflow-hidden flex-shrink-0"
          >
            <img
              alt={item.title}
              className="w-full h-full object-cover"
              src={item.image}
            />
          </div>
        ))}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-1">
          <span className="font-title-md text-label-md text-on-surface">
            {outfit.itemsCount} piezas
          </span>
          <span className="font-label-sm text-label-sm text-outline font-medium">
            {outfit.items[0]?.brand || 'Atelier'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-space-xs">
        <span className="font-body-sm text-body-sm text-outline">{outfit.lastWorn}</span>
        <button
          onClick={() => onWear && onWear(outfit)}
          className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-0.5 cursor-pointer"
          type="button"
        >
          <span>Vestir</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      </div>
    </article>
  );
}
