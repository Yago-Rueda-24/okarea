import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { formatImageUrl } from '../utils/image';
import imgLugaresFallback from '../assets/welcome/lugares.png';

export interface PlaceItem {
  id?: string;
  nombre: string;
  lugar?: string;
  descripcion?: string;
  foto?: string;
  enlace?: string;
  createdAt?: string;
}

const getPlaceImage = (foto?: string): string => {
  const formatted = formatImageUrl(foto);
  return formatted || imgLugaresFallback;
};

export default function Lugares() {
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchPlaces() {
      try {
        const response = await fetch(`${API_BASE_URL}/places`);
        if (!response.ok) throw new Error('Error al conectar con el servidor');

        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setPlaces(data);
        }
      } catch (err) {
        console.warn('API de lugares no disponible:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      const currentScrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, currentScrollY);
      };
    }
  }, [selectedPlace]);

  return (
    <div className="min-h-screen bg-[#FEEBE7] font-fraunces text-[#654321] pt-28 pb-20 px-6 sm:px-10">

      {/* Header Banner */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light italic uppercase tracking-wider text-[#faa18f] mb-6 leading-tight">
          Lugares
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#faa18f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold tracking-widest text-[#faa18f] uppercase">Cargando lugares...</p>
          </div>
        ) : places.length === 0 ? (
          <div className="py-20 px-6 text-center max-w-md mx-auto bg-white/50 backdrop-blur-md rounded-2xl border border-[#faa18f]/20 shadow-lg">
            <h3 className="text-xl font-bold uppercase tracking-wider text-[#faa18f] mb-2">No hay lugares disponibles</h3>
            <p className="text-sm font-sans text-[#654321]/70 font-medium">
              Actualmente no tenemos lugares recomendados. Vuelve pronto para descubrir nuestros rincones favoritos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((plc) => {
              const displayImage = getPlaceImage(plc.foto);

              return (
                <div
                  key={plc.id}
                  className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-[#faa18f]/20 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col group"
                >
                  {/* Place Image */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#faa18f]/10">
                    <img
                      src={displayImage}
                      alt={plc.nombre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = imgLugaresFallback;
                      }}
                    />
                    {plc.lugar && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-md text-[#FFDFCA] text-[11px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#faa18f]">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {plc.lugar}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Place Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-wider text-[#faa18f] mb-3 leading-snug">
                        {plc.nombre}
                      </h3>
                      {plc.descripcion && (
                        <p className="text-xs sm:text-sm font-sans text-[#654321]/80 line-clamp-3 leading-relaxed mb-6 font-medium">
                          {plc.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#faa18f]/15 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedPlace(plc)}
                        className="text-xs font-bold uppercase tracking-widest text-[#faa18f] hover:text-[#654321] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Detalles
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </button>

                      {plc.enlace && (
                        <a
                          href={plc.enlace}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#faa18f] hover:bg-[#e8907e] text-[#FEEBE7] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                          Ver Sitio Web
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FEEBE7] border border-[#faa18f]/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
              <img
                src={getPlaceImage(selectedPlace.foto)}
                alt={selectedPlace.nombre}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Details Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {selectedPlace.lugar && (
                <div className="inline-flex items-center gap-2 bg-[#faa18f]/15 text-[#faa18f] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#faa18f]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {selectedPlace.lugar}
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#faa18f] leading-snug">
                {selectedPlace.nombre}
              </h2>

              {selectedPlace.descripcion && (
                <p className="text-sm font-sans text-[#654321]/90 leading-relaxed font-medium">
                  {selectedPlace.descripcion}
                </p>
              )}

              {selectedPlace.enlace && (
                <div className="pt-4">
                  <a
                    href={selectedPlace.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#faa18f] hover:bg-[#e8907e] text-[#FEEBE7] font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    </svg>
                    Ir al sitio web del Lugar
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
