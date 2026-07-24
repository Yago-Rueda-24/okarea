import React, { useState, useEffect } from 'react';
import { Product, CategoryType } from '../types/product';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import { X, Eye, Edit3, Upload, Check, AlertCircle, ArrowLeft, ExternalLink, Image } from 'lucide-react';

interface ProductFormPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialProduct?: Product | null;
}

export default function ProductFormPreviewModal({
  isOpen,
  onClose,
  onSuccess,
  initialProduct,
}: ProductFormPreviewModalProps) {
  const isEditing = Boolean(initialProduct?.id);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    nombre: '',
    categoria: CategoryType.BOLSOS,
    fabricante: '',
    tienda: '',
    descripcion: '',
    temporada: '',
    precio: '',
    enlaceSitio: '',
    imagenUrl: '',
  });

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      const mainImg = initialProduct.photos && initialProduct.photos.length > 0 
        ? initialProduct.photos[0].url 
        : (initialProduct.imagenUrl || '');

      setFormData({
        id: initialProduct.id,
        nombre: initialProduct.nombre || '',
        categoria: initialProduct.categoria || CategoryType.BOLSOS,
        fabricante: initialProduct.fabricante || '',
        tienda: initialProduct.tienda || '',
        descripcion: initialProduct.descripcion || '',
        temporada: initialProduct.temporada || '',
        precio: initialProduct.precio || '',
        enlaceSitio: initialProduct.enlaceSitio || '',
        imagenUrl: mainImg,
      });
    } else {
      setFormData({
        nombre: '',
        categoria: CategoryType.BOLSOS,
        fabricante: '',
        tienda: '',
        descripcion: '',
        temporada: '',
        precio: '',
        enlaceSitio: '',
        imagenUrl: '',
      });
    }
    setErrorMsg(null);
    setActiveTab('form');
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image File Upload to Backend S3/MinIO
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setErrorMsg(null);

    // If editing existing product, upload directly to product photo endpoint
    if (formData.id) {
      try {
        const bodyData = new FormData();
        bodyData.append('file', file);

        const res = await fetch(`${API_BASE_URL}/products/${formData.id}/photos?isMain=true`, {
          method: 'POST',
          headers: {
            'x-api-key': ADMIN_API_KEY,
          },
          body: bodyData,
        });

        if (!res.ok) throw new Error('Error al subir imagen a MinIO S3');
        const photo = await res.json();
        setFormData((prev) => ({ ...prev, imagenUrl: photo.url }));
      } catch (err: any) {
        setErrorMsg(err.message || 'Fallo al subir imagen');
      } finally {
        setUploadingFile(false);
      }
    } else {
      // Local preview data URL for new un-saved product
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, imagenUrl: reader.result as string }));
        setUploadingFile(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre?.trim()) {
      setErrorMsg('El nombre del artículo es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = isEditing
        ? `${API_BASE_URL}/products/${formData.id}`
        : `${API_BASE_URL}/products`;

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ADMIN_API_KEY,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          categoria: formData.categoria,
          fabricante: formData.fabricante,
          tienda: formData.tienda,
          descripcion: formData.descripcion,
          temporada: formData.temporada,
          precio: formData.precio,
          enlaceSitio: formData.enlaceSitio,
          imagenUrl: formData.imagenUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Fallo al guardar en el servidor');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImage = formData.imagenUrl || 'https://via.placeholder.com/600x800?text=Sin+Imagen';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]">

        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? `Modificar Artículo: ${formData.nombre}` : 'Insertar Nuevo Artículo'}
              </h2>
              <p className="text-xs text-slate-400">
                Formulario de administración con previsualización de imagen y vista previa web
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Form vs Live Web Preview) */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 pt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'form'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4" /> 1. Formulario de Datos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" /> 2. Previsualización Web (`ProductInfo`)
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'form' ? (
            /* TAB 1: FORM */
            <form id="admin-product-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Nombre del Artículo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Kenza Small Cow"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Categoría (Enum) *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value as CategoryType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  >
                    <option value={CategoryType.BOLSOS}>Bolsos</option>
                    <option value={CategoryType.CALZADO}>Calzado</option>
                    <option value={CategoryType.ROPA}>Ropa</option>
                    <option value={CategoryType.ACCESORIOS}>Accesorios</option>
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Precio
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ej. 115.00"
                    value={formData.precio}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9.,]/g, '');
                      handleInputChange('precio', onlyNumbers);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

                {/* Fabricante */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Fabricante / Marca
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. oliviamareque"
                    value={formData.fabricante}
                    onChange={(e) => handleInputChange('fabricante', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

                {/* Tienda */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Tienda Oficial
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Olivia Mareque"
                    value={formData.tienda}
                    onChange={(e) => handleInputChange('tienda', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

                {/* Temporada */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Temporada / Colección
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Colección 2026"
                    value={formData.temporada}
                    onChange={(e) => handleInputChange('temporada', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>

              </div>

              {/* Enlace al sitio oficial */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Enlace al Sitio Oficial (URL)
                </label>
                <input
                  type="url"
                  placeholder="Ej. https://oliviamareque.com"
                  value={formData.enlaceSitio}
                  onChange={(e) => handleInputChange('enlaceSitio', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  placeholder="Descripción del producto que verán los usuarios en la web..."
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm resize-none"
                />
              </div>

              {/* Imagen / Subida */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Image className="w-4 h-4 text-purple-400" /> Imagen del Producto
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Opción A: URL de la Imagen</label>
                    <input
                      type="text"
                      placeholder="https://... o /src/assets/..."
                      value={formData.imagenUrl}
                      onChange={(e) => handleInputChange('imagenUrl', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Opción B: Subir Imagen (MinIO S3)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                    />
                    {uploadingFile && <p className="text-xs text-purple-400 mt-1">Subiendo a MinIO S3...</p>}
                  </div>
                </div>
              </div>

            </form>
          ) : (
            /* TAB 2: LIVE WEB PREVIEW (Replica of ProductInfo.tsx) */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs flex items-center justify-between">
                <span>✨ Vista Previa en Vivo: Así se mostrará este artículo en la web pública (`ProductInfo`).</span>
                <span className="font-mono bg-purple-950 px-2 py-0.5 rounded text-[10px] text-purple-200">http://okarea.local/producto</span>
              </div>

              {/* Exact replica of public ProductInfo.tsx layout */}
              <div className="rounded-2xl bg-[#FEEBE7] p-6 text-[#654321] font-sans shadow-inner overflow-hidden border border-rose-200">
                <div className="max-w-4xl mx-auto">
                  {/* Navigation / Back link replica */}
                  <div className="mb-4">
                    <span className="inline-flex items-center text-xs font-medium text-[#654321]/70 gap-1">
                      <span>←</span> Volver a artículos (Vista Previa)
                    </span>
                  </div>

                  {/* Main Product Card Replica */}
                  <div className="bg-[#8db1cd] backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-[#FFDFCA]">
                    {/* Left Column: Image */}
                    <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-100 shadow-md">
                      <img
                        src={displayImage}
                        alt={formData.nombre || 'Previsualización'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Imagen+No+Disponible';
                        }}
                      />
                    </div>

                    {/* Right Column: Information */}
                    <div className="flex flex-col justify-center">
                      <div className="mb-2">
                        <span className="inline-block bg-[#FFDFCA]/15 text-[#FFDFCA] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#FFDFCA]/30">
                          {formData.tienda || formData.fabricante || 'OKAREA Studio'}
                        </span>
                      </div>

                      <h1 className="text-2xl md:text-3xl font-extrabold text-[#FFDFCA] tracking-tight mb-2">
                        {formData.nombre || 'Nombre del Artículo'}
                      </h1>

                      <div className="flex items-center gap-3 mb-3">
                        {formData.precio && (
                          <span className="text-xl font-bold text-[#FFDFCA]">{formData.precio}</span>
                        )}
                        {formData.temporada && (
                          <span className="text-xs opacity-80 border-l border-[#FFDFCA]/40 pl-3">{formData.temporada}</span>
                        )}
                      </div>

                      <div className="mb-6 border-t border-b border-[#FFDFCA]/20 py-4">
                        <p className="text-sm text-[#FFDFCA] leading-relaxed font-normal">
                          {formData.descripcion || 'Sin descripción ingresada aún. Escribe en la pestaña del formulario para ver el resultado en directo.'}
                        </p>
                      </div>

                      <div>
                        <span className="inline-flex items-center justify-center gap-2 bg-[#FFDFCA] text-[#FFA18F] font-bold text-sm px-6 py-3 rounded-xl shadow">
                          <span>Ir a la tienda oficial</span>
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'form' ? (
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4 text-purple-400" /> Ver Previsualización Web
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al Formulario
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="admin-product-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                ? 'Guardar Cambios en Web'
                : 'Confirmar y Publicar en Web'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
