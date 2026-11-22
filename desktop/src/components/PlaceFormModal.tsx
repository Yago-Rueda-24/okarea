import { useState, useEffect, ChangeEvent } from 'react';
import { PlaceItem } from '../types/place';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import { formatImageUrl, compressImageFile } from '../utils/image';
import { X, MapPin, AlignLeft, Image as ImageIcon, Link as LinkIcon, Save, Compass, Upload, Check } from 'lucide-react';

interface PlaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialPlace: PlaceItem | null;
}

export default function PlaceFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialPlace,
}: PlaceFormModalProps) {
  const [nombre, setNombre] = useState('');
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState('');
  const [enlace, setEnlace] = useState('');

  // Photo Input Mode: 'url' | 'file'
  const [photoMode, setPhotoMode] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlace) {
      setNombre(initialPlace.nombre || '');
      setLugar(initialPlace.lugar || '');
      setDescripcion(initialPlace.descripcion || '');
      setFoto(initialPlace.foto || '');
      setEnlace(initialPlace.enlace || '');
      setPhotoMode(initialPlace.foto?.startsWith('data:') ? 'file' : 'url');
    } else {
      setNombre('');
      setLugar('');
      setDescripcion('');
      setFoto('');
      setEnlace('');
      setPhotoMode('url');
    }
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);
  }, [initialPlace, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        setSelectedFile(compressed);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre del lugar es obligatorio');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let finalFotoUrl = foto.trim();

    // If user uploaded a local file
    if (photoMode === 'file' && selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await fetch(`${API_BASE_URL}/places/upload`, {
          method: 'POST',
          headers: {
            'x-api-key': ADMIN_API_KEY,
          },
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalFotoUrl = uploadData.url || finalFotoUrl;
        } else {
          const errBody = await uploadRes.text().catch(() => '');
          if (uploadRes.status === 413 || errBody.includes('large')) {
            throw new Error('La imagen es demasiado grande. Intenta con una imagen más pequeña.');
          }
          if (filePreview) {
            finalFotoUrl = filePreview;
          }
        }
      } catch (uploadErr: any) {
        if (uploadErr.message?.includes('demasiado grande')) {
          setError(uploadErr.message);
          setIsSubmitting(false);
          return;
        }
        if (filePreview) {
          finalFotoUrl = filePreview;
        }
      }
    }

    const payload = {
      nombre: nombre.trim(),
      lugar: lugar.trim(),
      descripcion: descripcion.trim(),
      foto: finalFotoUrl,
      enlace: enlace.trim(),
    };

    try {
      const isEdit = Boolean(initialPlace?.id);
      const url = isEdit
        ? `${API_BASE_URL}/places/${initialPlace!.id}`
        : `${API_BASE_URL}/places`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ADMIN_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Error al guardar el lugar en el servidor');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error en la petición');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#eee7e3] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#eee7e3] flex items-center justify-between bg-[#faf2ee]">
          <h2 className="font-serif text-lg font-bold text-[#1e1b19] flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            {initialPlace ? 'Editar Lugar' : 'Nuevo Lugar'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#88726c] hover:text-[#1e1b19] hover:bg-[#eee7e3] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55433e] mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary" /> Nombre del Lugar *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cafe de Flore Paris"
              className="w-full bg-[#faf2ee] border border-[#eee7e3] rounded-xl px-4 py-2.5 text-sm text-[#1e1b19] focus:outline-none focus:border-primary placeholder:text-[#88726c]"
              required
            />
          </div>

          {/* Ubicacion / Lugar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55433e] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Ciudad / Dirección
            </label>
            <input
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej: Paris, Francia"
              className="w-full bg-[#faf2ee] border border-[#eee7e3] rounded-xl px-4 py-2.5 text-sm text-[#1e1b19] focus:outline-none focus:border-primary placeholder:text-[#88726c]"
            />
          </div>

          {/* Foto (URL o Archivo) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#55433e] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-primary" /> Foto del Lugar
              </label>

              {/* Mode Toggle (URL vs Archivo) */}
              <div className="flex items-center bg-[#faf2ee] p-1 rounded-lg border border-[#eee7e3] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    photoMode === 'url'
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-[#88726c] hover:text-[#1e1b19]'
                  }`}
                >
                  URL Externa
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('file')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    photoMode === 'file'
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-[#88726c] hover:text-[#1e1b19]'
                  }`}
                >
                  Subir Archivo
                </button>
              </div>
            </div>

            {photoMode === 'url' ? (
              <input
                type="text"
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
                placeholder="Ej: https://imagenes.com/lugar.jpg"
                className="w-full bg-[#faf2ee] border border-[#eee7e3] rounded-xl px-4 py-2.5 text-sm text-[#1e1b19] focus:outline-none focus:border-primary placeholder:text-[#88726c]"
              />
            ) : (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#eee7e3] hover:border-primary/50 rounded-xl p-4 bg-[#faf2ee] cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-primary mb-2" />
                  <span className="text-xs font-semibold text-[#1e1b19]">
                    {selectedFile ? selectedFile.name : 'Haz clic o arrastra una foto aquí'}
                  </span>
                  <span className="text-[10px] text-[#88726c] mt-1">PNG, JPG, WEBP, SVG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {(filePreview || foto) && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#faf2ee] border border-[#eee7e3]">
                    <img
                      src={filePreview || formatImageUrl(foto)}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] text-[#1e1b19] font-bold flex items-center gap-1 border border-[#eee7e3] shadow-2xs">
                      <Check className="w-3 h-3 text-primary" /> Vista Previa
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enlace */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55433e] mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-primary" /> Enlace / Web Externa
            </label>
            <input
              type="text"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              placeholder="Ej: https://cafedeflore.fr"
              className="w-full bg-[#faf2ee] border border-[#eee7e3] rounded-xl px-4 py-2.5 text-sm text-[#1e1b19] focus:outline-none focus:border-primary placeholder:text-[#88726c]"
            />
          </div>

          {/* Descripcion */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#55433e] mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-primary" /> Descripción
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe los puntos de interés, recomendaciones..."
              className="w-full bg-[#faf2ee] border border-[#eee7e3] rounded-xl px-4 py-2.5 text-sm text-[#1e1b19] focus:outline-none focus:border-primary resize-none placeholder:text-[#88726c]"
            />
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-[#eee7e3] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] text-[#55433e] text-xs font-semibold border border-[#eee7e3] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-[#793019] text-white font-bold text-xs shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Guardando...' : initialPlace ? 'Guardar Cambios' : 'Crear Lugar'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
