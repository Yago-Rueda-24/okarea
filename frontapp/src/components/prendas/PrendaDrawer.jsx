import { useState } from 'react';

export default function PrendaDrawer({ prenda, onLogWear, onSelectPairing, onDeletePrenda }) {
  const [justLogged, setJustLogged] = useState(false);

  if (!prenda) {
    return (
      <aside className="xl:col-span-4 sticky top-24 rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col items-center justify-center py-20 text-center text-outline">
        <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">
          styler
        </span>
        <p className="font-title-md text-on-surface">Selecciona una prenda</p>
        <p className="text-body-sm text-outline mt-1 max-w-xs">
          Haz clic en cualquier pieza de tu archivo para visualizar su ficha técnica y composición.
        </p>
      </aside>
    );
  }

  const handleLogClick = () => {
    onLogWear(prenda.id);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2200);
  };

  return (
    <aside className="xl:col-span-4 sticky top-24 rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col gap-space-md">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/60">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">loupe</span>
          <h2 className="font-title-lg text-title-lg text-on-surface">Ficha Técnica &amp; Styling</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Editar Prenda"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            title="Compartir Ficha"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
          </button>
          {onDeletePrenda && (
            <button
              onClick={() => {
                if (window.confirm(`¿Deseas retirar "${prenda.title}" de tu colección de atelier?`)) {
                  onDeletePrenda(prenda.id);
                }
              }}
              className="p-1.5 rounded-full text-on-surface-variant hover:bg-error-container/50 hover:text-error transition-colors cursor-pointer"
              title="Eliminar de Archivo"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Preview of Selected Garment */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden bg-surface-container-low group">
        <img
          alt={prenda.title}
          className="w-full h-full object-cover"
          src={prenda.detailImage || prenda.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex flex-col justify-end p-space-md">
          <span className="font-label-sm text-primary-fixed-dim uppercase tracking-wider">
            Ref: {prenda.ref}
          </span>
          <h3 className="font-headline-md text-headline-md text-inverse-on-surface">
            {prenda.title}
          </h3>
          <span className="font-body-sm text-body-sm text-surface-container-high">
            {prenda.brand} • Talla {prenda.size}
          </span>
        </div>
      </div>

      {/* Frecuencia de Uso y Estado */}
      <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm uppercase tracking-wider text-outline">
            Frecuencia de Uso
          </span>
          <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container font-semibold">
            {prenda.wearCount === 0 ? 'Sin estrenar' : prenda.status || 'Limpio'}
          </span>
        </div>
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <span className="font-headline-lg text-headline-lg text-on-surface font-normal">
              {prenda.wearCount}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant ml-1.5">
              {prenda.wearCount === 1 ? 'puesta registrada' : 'puestas registradas'}
            </span>
          </div>
          <div className="text-right">
            <span className="font-title-md text-title-md text-primary font-medium">
              {prenda.season || 'Todo Año'}
            </span>
            <span className="block font-label-sm text-outline">Temporada</span>
          </div>
        </div>
      </div>

      {/* Material, Fabric & Care Dossier */}
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm uppercase tracking-wider text-outline">
          Composición &amp; Cuidados
        </span>
        <div className="grid grid-cols-2 gap-space-xs text-body-sm">
          <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
            <span className="text-outline text-label-sm">Composición exterior</span>
            <span className="font-medium text-on-surface">
              {prenda.composition?.exterior || '100% Textil de calidad'}
            </span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
            <span className="text-outline text-label-sm">Forro interior</span>
            <span className="font-medium text-on-surface">
              {prenda.composition?.lining || 'Acabado premium'}
            </span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
            <span className="text-outline text-label-sm">Método de lavado</span>
            <span className="font-medium text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">local_laundry_service</span>
              <span>{prenda.composition?.washing || 'Limpieza recomendada'}</span>
            </span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
            <span className="text-outline text-label-sm">Ubicación física</span>
            <span className="font-medium text-on-surface">
              {prenda.composition?.location || 'Armario Principal'}
            </span>
          </div>
        </div>
      </div>

      {/* AI Suggested Combinations from existing closet items */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm uppercase tracking-wider text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-[15px]">auto_fix_high</span>
            <span>Sugerencias de Combinación</span>
          </span>
          <button className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer" type="button">
            Ver 8 fórmulas
          </button>
        </div>

        <div className="grid grid-cols-3 gap-space-xs pt-1">
          {prenda.suggestedPairings?.map((pair) => (
            <div
              key={pair.id}
              onClick={() => onSelectPairing && onSelectPairing(pair.id)}
              className="group/pair p-1.5 rounded-lg bg-surface-container-high/30 hover:bg-surface-container transition-all flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-md bg-surface-container-lowest overflow-hidden mb-1">
                <img
                  alt={pair.name}
                  className="w-full h-full object-cover group-hover/pair:scale-105 transition-transform"
                  src={pair.image}
                />
              </div>
              <span className="font-label-sm text-on-surface font-semibold truncate w-full">
                {pair.name}
              </span>
              <span className="font-body-sm text-[10px] text-outline">{pair.brand}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer Action Row */}
      <div className="pt-space-sm flex flex-col gap-space-xs">
        <button
          onClick={handleLogClick}
          className={`w-full py-2.5 px-space-md rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-xs transition-all shadow-sm cursor-pointer ${
            justLogged
              ? 'bg-secondary text-on-secondary'
              : 'bg-inverse-surface text-inverse-on-surface hover:bg-primary'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            {justLogged ? 'check_circle' : 'add_task'}
          </span>
          <span>
            {justLogged ? '¡Puesta registrada hoy!' : 'Registrar Puesta Hoy (Log Wear)'}
          </span>
        </button>

        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => alert(`Creando look con "${prenda.title}"...`)}
            className="flex-1 py-2 px-space-sm rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md text-center transition-colors cursor-pointer"
            type="button"
          >
            Crear Look con ella
          </button>
          <button
            onClick={() => alert(`Prenda "${prenda.title}" enviada a tintorería / archivo.`)}
            className="py-2 px-space-sm rounded-lg bg-surface-container-high hover:bg-error-container hover:text-on-error-container text-outline font-label-md text-label-md transition-colors cursor-pointer"
            title="Mover a tintorería o archivo temporal"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">dry_cleaning</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
