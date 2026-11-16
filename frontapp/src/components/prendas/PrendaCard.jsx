export default function PrendaCard({ prenda, isSelected, onSelect, onToggleFavorite }) {
  const isSinEstrenar = prenda.wearCount === 0;

  return (
    <div
      onClick={() => onSelect(prenda)}
      className={`group relative rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      }`}
    >
      {/* Visual Image container with 4/5 aspect ratio */}
      <div className="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden">
        <img
          alt={prenda.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          src={prenda.image}
        />

        {/* Subtle Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {prenda.badges?.map((badge, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded-full backdrop-blur font-label-sm text-label-sm shadow-sm ${badge.bg}`}
            >
              {badge.text}
            </span>
          ))}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prenda.id);
            }}
            className={`w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur flex items-center justify-center shadow-sm transition-colors cursor-pointer ${
              prenda.isFavorite ? 'text-primary' : 'text-outline hover:text-primary'
            }`}
            title={prenda.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorita'}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[17px]"
              style={{ fontVariationSettings: prenda.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Prenda "${prenda.title}" seleccionada para crear look.`);
            }}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur text-on-surface flex items-center justify-center hover:bg-surface-container-highest shadow-sm transition-colors cursor-pointer"
            title="Añadir a un Outfit"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">auto_awesome_motion</span>
          </button>
        </div>

        {/* Wear Frequency Indicator Tag */}
        <div className="absolute bottom-2.5 left-2.5">
          {isSinEstrenar ? (
            <div className="px-2 py-1 rounded bg-primary text-on-primary text-label-sm font-label-sm flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">new_releases</span>
              <span>Sin estrenar</span>
            </div>
          ) : (
            <div className="px-2 py-1 rounded bg-inverse-surface/85 backdrop-blur text-inverse-on-surface text-label-sm font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary-fixed-dim">repeat</span>
              <span>Usado {prenda.wearCount} veces</span>
            </div>
          )}
        </div>
      </div>

      {/* Garment Editorial Text Block */}
      <div className="p-space-md flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <span className="font-label-sm uppercase tracking-widest text-outline">
            {prenda.brand}
          </span>
          <h3 className="font-title-md text-title-md text-on-surface leading-tight mt-0.5 group-hover:text-primary transition-colors">
            {prenda.title}
          </h3>
        </div>

        <div className="pt-space-xs flex items-center justify-between text-body-sm text-on-surface-variant">
          <span className="font-label-sm text-outline uppercase tracking-wider">
            {prenda.category}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-label-sm">
            {prenda.materialTag}
          </span>
        </div>
      </div>
    </div>
  );
}
