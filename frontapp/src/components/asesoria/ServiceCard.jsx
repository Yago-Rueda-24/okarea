export default function ServiceCard({ service, isSelected, onSelect }) {
  const isMonthly = service.isMonthly;
  const isHighlight = service.isHighlight;

  return (
    <div
      className={`group relative flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-primary shadow-lg'
          : isHighlight
            ? 'shadow-md hover:shadow-xl'
            : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Highlight badge */}
      {isHighlight && (
        <div className="absolute -top-3 left-space-lg">
          <span className="font-label-sm text-label-sm uppercase tracking-wider px-space-sm py-0.5 rounded-full bg-primary text-on-primary font-bold shadow-sm">
            Más Solicitado
          </span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-space-sm pt-1">
          <span
            className={`font-label-sm text-label-sm px-space-sm py-0.5 rounded-full font-medium ${
              isHighlight
                ? 'bg-secondary-container text-on-secondary-container'
                : isMonthly
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed font-semibold'
                  : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {service.duration}
          </span>
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isSelected || isHighlight
                ? 'text-primary'
                : 'text-outline group-hover:text-primary'
            }`}
          >
            {service.icon}
          </span>
        </div>

        <h3 className="font-title-lg text-title-lg text-on-surface mb-space-xs font-semibold">
          {service.title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          {service.description}
        </p>

        <ul className="space-y-space-xs mb-space-md text-on-surface-variant font-body-sm text-body-sm">
          {service.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[16px]">
                check_circle
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`pt-space-md mt-auto flex items-center justify-between -mx-space-lg -mb-space-lg p-space-md rounded-b-xl transition-colors ${
          isSelected
            ? 'bg-primary/10'
            : isHighlight
              ? 'bg-primary/5'
              : 'bg-surface-container-low'
        }`}
      >
        <div>
          <span
            className={`font-label-sm text-label-sm block ${
              isSelected ? 'text-primary font-medium' : 'text-outline'
            }`}
          >
            {isMonthly ? 'Tarifa plana' : 'Inversión'}
          </span>
          <span
            className={`font-title-lg text-title-lg font-bold ${
              isSelected ? 'text-primary' : 'text-on-surface'
            }`}
          >
            {service.price} €
            {isMonthly && (
              <span className="font-body-sm text-body-sm font-normal text-outline">
                /mes
              </span>
            )}
          </span>
        </div>

        <button
          onClick={() => onSelect(service)}
          className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-colors shadow-sm cursor-pointer ${
            isSelected
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface'
          }`}
          type="button"
        >
          {isSelected
            ? 'Seleccionado ✓'
            : isMonthly
              ? 'Suscribir'
              : 'Seleccionar'}
        </button>
      </div>
    </div>
  );
}
