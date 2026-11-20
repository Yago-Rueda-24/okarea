import { useState } from 'react';
import { mapCategoryToTipoPrenda } from '../../api/prendas';

export default function PrendaDrawer({ prenda, onDeletePrenda, onUpdatePrenda }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editCategory, setEditCategory] = useState('Tops & Camisas');
  const [editSize, setEditSize] = useState('');
  const [editSeason, setEditSeason] = useState('Todo Año');
  const [editColor, setEditColor] = useState('');

  if (!prenda) {
    return (
      <aside className="xl:col-span-4 sticky top-24 rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col items-center justify-center py-20 text-center text-outline">
        <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">
          styler
        </span>
        <p className="font-title-md text-on-surface">Selecciona una prenda</p>
        <p className="text-body-sm text-outline mt-1 max-w-xs">
          Haz clic en cualquier pieza de tu archivo para visualizar su ficha técnica y detalles.
        </p>
      </aside>
    );
  }

  const handleStartEdit = () => {
    setEditTitle(prenda.title || '');
    setEditBrand(prenda.brand || '');
    setEditCategory(prenda.category || 'Tops & Camisas');
    setEditSize(prenda.size || '');
    setEditSeason(prenda.season || 'Todo Año');
    setEditColor(prenda.palette || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editBrand.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        nombre: editTitle.trim(),
        tipoPrenda: mapCategoryToTipoPrenda(editCategory),
        color: editColor.trim() || 'Tierra & Neutros',
        temporada: editSeason,
        notasAdicionales: {
          ...(prenda.raw?.notasAdicionales || {}),
          brand: editBrand.trim(),
          category: editCategory,
          size: editSize.trim(),
          season: editSeason,
          palette: editColor.trim(),
        },
      };

      if (onUpdatePrenda) {
        await onUpdatePrenda(prenda.id, payload);
      }
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside className="xl:col-span-4 sticky top-24 rounded-2xl bg-surface-container-lowest p-space-lg shadow-xl flex flex-col gap-space-md">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-highest/60">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">
            {isEditing ? 'edit_note' : 'loupe'}
          </span>
          <h2 className="font-title-lg text-title-lg text-on-surface">
            {isEditing ? 'Modificar Prenda' : 'Detalle de la Prenda'}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          {onUpdatePrenda && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title="Modificar Datos"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Cancelar edición"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          {onDeletePrenda && !isEditing && (
            <button
              onClick={() => {
                if (window.confirm(`¿Deseas retirar "${prenda.title}" de tu armario?`)) {
                  onDeletePrenda(prenda.id);
                }
              }}
              className="p-1.5 rounded-full text-on-surface-variant hover:bg-error-container/50 hover:text-error transition-colors cursor-pointer"
              title="Eliminar del Armario"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Preview of Selected Garment */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden bg-surface-container-low border border-surface-container-highest/40 shrink-0">
        <img
          alt={prenda.title}
          className="w-full h-full object-cover object-center"
          src={prenda.detailImage || prenda.image}
        />
      </div>

      {isEditing ? (
        /* Formulario de Modificación de Datos */
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-space-sm">
          <div className="grid grid-cols-2 gap-space-xs">
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Marca / Diseñador
              </label>
              <input
                required
                type="text"
                value={editBrand}
                onChange={(e) => setEditBrand(e.target.value)}
                placeholder="Ej. Totême, Céline..."
                className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Talla
              </label>
              <input
                type="text"
                value={editSize}
                onChange={(e) => setEditSize(e.target.value)}
                placeholder="Ej. 38 FR, S..."
                className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Título de la Prenda
            </label>
            <input
              required
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Ej. Blazer Cruzado Lana Espresso"
              className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-xs">
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Categoría
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
              >
                <option value="Tops & Camisas">Tops &amp; Camisas</option>
                <option value="Chaquetas & Blazers">Chaquetas &amp; Blazers</option>
                <option value="Pantalones & Faldas">Pantalones &amp; Faldas</option>
                <option value="Vestidos">Vestidos</option>
                <option value="Calzado">Calzado</option>
                <option value="Bolsos & Accesorios">Bolsos &amp; Accesorios</option>
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Temporada
              </label>
              <select
                value={editSeason}
                onChange={(e) => setEditSeason(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
              >
                <option value="Otoño/Invierno">Otoño/Invierno</option>
                <option value="Primavera/Verano">Primavera/Verano</option>
                <option value="Todo Año">Todo Año</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Gama Cromática / Color
            </label>
            <input
              type="text"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              placeholder="Ej. Negro Carbón, Camel..."
              className="w-full px-2.5 py-1.5 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          <div className="flex items-center gap-space-xs pt-space-xs">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleCancelEdit}
              className="flex-1 py-2 px-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2 px-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
            >
              {isSaving ? (
                <span className="material-symbols-outlined animate-spin text-[16px]">autorenew</span>
              ) : (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
              <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Vista de Ficha Técnica Normal */
        <>
          {/* Garment Title, Brand and Reference */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-primary uppercase tracking-wider font-semibold">
                {prenda.brand}
              </span>
              {prenda.ref && (
                <span className="font-label-sm text-outline text-[11px]">
                  Ref: {prenda.ref}
                </span>
              )}
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {prenda.title}
            </h3>
          </div>

          {/* Información & Detalles de la Prenda */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm uppercase tracking-wider text-outline">
              Detalles de la Prenda
            </span>
            <div className="grid grid-cols-2 gap-space-xs text-body-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
                <span className="text-outline text-label-sm">Categoría</span>
                <span className="font-medium text-on-surface">
                  {prenda.category || 'Atelier'}
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
                <span className="text-outline text-label-sm">Talla</span>
                <span className="font-medium text-on-surface">
                  {prenda.size || 'Única'}
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
                <span className="text-outline text-label-sm">Temporada</span>
                <span className="font-medium text-on-surface">
                  {prenda.season || 'Todo Año'}
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-high/40 flex flex-col">
                <span className="text-outline text-label-sm">Gama cromática</span>
                <span className="font-medium text-on-surface">
                  {prenda.palette || 'Neutros'}
                </span>
              </div>
            </div>
          </div>

          {/* Functional Actions */}
          <div className="pt-space-xs flex flex-col gap-space-xs">
            {onUpdatePrenda && (
              <button
                onClick={handleStartEdit}
                className="w-full py-2.5 px-space-md rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Modificar Datos de la Prenda</span>
              </button>
            )}
            {onDeletePrenda && (
              <button
                onClick={() => {
                  if (window.confirm(`¿Deseas retirar "${prenda.title}" de tu armario?`)) {
                    onDeletePrenda(prenda.id);
                  }
                }}
                className="w-full py-2.5 px-space-md rounded-lg font-label-md text-label-md flex items-center justify-center gap-space-xs text-error hover:bg-error-container/40 transition-colors border border-error/30 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Eliminar Prenda del Armario</span>
              </button>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
