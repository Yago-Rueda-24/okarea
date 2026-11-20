import { useState, useRef, useEffect } from 'react';
import { mapCategoryToTipoPrenda } from '../../api/prendas';

export default function NewPrendaModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Chaquetas & Blazers');
  const [season, setSeason] = useState('Otoño/Invierno');
  const [size, setSize] = useState('38 FR');
  const [color, setColor] = useState('Tierra & Neutros');

  // Photo state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up object URL on unmount or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Form & photo state reset helper
  const resetForm = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    setPhotoError(false);
    setTitle('');
    setBrand('');
    setCategory('Chaquetas & Blazers');
    setSeason('Otoño/Invierno');
    setSize('38 FR');
    setColor('Tierra & Neutros');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPhotoError(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPhotoError(false);
    }
  };

  const handleClearFile = (e) => {
    if (e) e.stopPropagation();
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim()) return;

    if (!selectedFile) {
      setPhotoError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const prendaData = {
        nombre: title.trim(),
        tipoPrenda: mapCategoryToTipoPrenda(category),
        color: color.trim() || 'Tierra & Neutros',
        temporada: season,
        brand: brand.trim(),
        title: title.trim(),
        category,
        size,
        notasAdicionales: {
          brand: brand.trim(),
          category,
          size,
          wearCount: 0,
          isFavorite: false,
          status: 'Sin estrenar',
        },
      };

      await onSave(prendaData, selectedFile);
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-surface-container-highest/60 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-space-lg pt-space-lg pb-space-sm flex items-center justify-between border-b border-surface-container-highest/50 shrink-0">
          <div>
            <span className="font-label-sm text-primary uppercase tracking-wider font-semibold">
              Atelier Archive
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Nueva Prenda</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-space-md overflow-y-auto">
          {/* Custom Photo Upload */}
          <div>
            <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
              Fotografía de la Prenda <span className="text-primary">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-primary/40 bg-surface-container-low group">
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 text-on-surface text-label-sm font-medium hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    Cambiar
                  </button>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container text-label-sm font-medium hover:bg-error-container/80 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Quitar
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                  <span>Foto seleccionada</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                  photoError
                    ? 'border-error bg-error-container/20'
                    : isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-container-highest hover:border-primary/60 hover:bg-surface-container-low'
                }`}
              >
                <span className={`material-symbols-outlined text-3xl mb-1 ${photoError ? 'text-error' : 'text-primary'}`}>
                  add_photo_alternate
                </span>
                <p className="text-body-sm font-medium text-on-surface">
                  Haz clic o arrastra tu foto aquí
                </p>
                <p className="text-label-sm text-outline mt-0.5">
                  Formatos compatibles: JPG, PNG, WEBP
                </p>
                {photoError && (
                  <p className="text-label-sm text-error font-medium mt-1">
                    Es obligatorio adjuntar una fotografía de la prenda
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Marca / Diseñador
              </label>
              <input
                required
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Totême, Céline, The Row..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
              />
            </div>
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Talla
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Ej. 38 FR, S, 39 EU..."
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Blazer Cruzado Lana Espresso"
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block text-label-sm text-outline uppercase font-semibold mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
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
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none cursor-pointer"
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
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ej. Negro Carbón, Camel, Blanco Marfil..."
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest outline-none"
            />
          </div>

          <div className="pt-space-sm flex items-center justify-end gap-space-sm shrink-0">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              type="button"
              className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md shadow-md transition-all cursor-pointer disabled:opacity-75 flex items-center gap-2"
            >
              {isSubmitting && (
                <span className="material-symbols-outlined animate-spin text-[16px]">
                  autorenew
                </span>
              )}
              <span>{isSubmitting ? 'Guardando en Atelier...' : 'Guardar Prenda'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
