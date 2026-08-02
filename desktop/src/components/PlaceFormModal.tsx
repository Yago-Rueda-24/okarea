import { useState, useEffect, ChangeEvent } from 'react';
import { PlaceItem } from '../types/place';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import { formatImageUrl } from '../utils/image';
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        } else if (filePreview) {
          finalFotoUrl = filePreview;
        }
      } catch (uploadErr) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            {initialPlace ? 'Editar Lugar' : 'Nuevo Lugar'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" /> Nombre del Lugar *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cafe de Flore Paris"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          {/* Ubicacion / Lugar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" /> Ciudad / Dirección
            </label>
            <input
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej: Paris, Francia"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Foto (URL o Archivo) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Foto del Lugar
              </label>

              {/* Mode Toggle (URL vs Archivo) */}
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    photoMode === 'url'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  URL Externa
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('file')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    photoMode === 'file'
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            ) : (
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-4 bg-slate-950 cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-purple-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-300">
                    {selectedFile ? selectedFile.name : 'Haz clic o arrastra una foto aquí'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WEBP, SVG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {(filePreview || foto) && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={filePreview || formatImageUrl(foto)}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-purple-300 font-bold flex items-center gap-1 border border-purple-500/30">
                      <Check className="w-3 h-3" /> Vista Previa
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enlace */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-purple-400" /> Enlace / Web Externa
            </label>
            <input
              type="text"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              placeholder="Ej: https://cafedeflore.fr"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Descripcion */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-purple-400" /> Descripción
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe los puntos de interés, recomendaciones..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
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
