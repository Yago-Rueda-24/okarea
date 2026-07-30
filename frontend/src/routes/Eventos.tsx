import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import imgEventoFallback from '../assets/welcome/evento.png';

export interface EventItem {
  id?: string;
  titulo: string;
  lugar?: string;
  descripcion?: string;
  foto?: string;
  enlace?: string;
  createdAt?: string;
}

export default function Eventos() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchEvents() {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('API de eventos no disponible:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FEEBE7] font-fraunces text-[#654321] pt-28 pb-20 px-6 sm:px-10">
      
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-[#faa18f] block mb-3">
          Experiencias Exclusivas
        </span>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light italic uppercase tracking-wider text-[#faa18f] mb-6 leading-tight">
          Próximos Eventos
        </h1>
        <p className="text-sm sm:text-base max-w-xl mx-auto text-[#654321]/80 leading-relaxed font-sans font-medium">
          Vive momentos únicos rodeado de moda, tendencia e inspiración. Descubre nuestras fechas y experiencias especiales en OkArea.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#faa18f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-bold tracking-widest text-[#faa18f] uppercase">Cargando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 px-6 text-center max-w-md mx-auto bg-white/50 backdrop-blur-md rounded-2xl border border-[#faa18f]/20 shadow-lg">
            <h3 className="text-xl font-bold uppercase tracking-wider text-[#faa18f] mb-2">No hay eventos disponibles</h3>
            <p className="text-sm font-sans text-[#654321]/70 font-medium">
              Actualmente no tenemos eventos programados. Vuelve pronto para descubrir nuestras próximas experiencias.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((evt) => {
              const displayImage = evt.foto || imgEventoFallback;

              return (
                <div
                  key={evt.id}
                  className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden border border-[#faa18f]/20 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col group"
                >
                  {/* Event Image */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#faa18f]/10">
                    <img
                      src={displayImage}
                      alt={evt.titulo}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = imgEventoFallback;
                      }}
                    />
                    {evt.lugar && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/60 backdrop-blur-md text-[#FFDFCA] text-[11px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#faa18f]">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {evt.lugar}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-wider text-[#faa18f] mb-3 leading-snug">
                        {evt.titulo}
                      </h3>
                      {evt.descripcion && (
                        <p className="text-xs sm:text-sm font-sans text-[#654321]/80 line-clamp-3 leading-relaxed mb-6 font-medium">
                          {evt.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#faa18f]/15 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="text-xs font-bold uppercase tracking-widest text-[#faa18f] hover:text-[#654321] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        Detalles
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                        </svg>
                      </button>

                      {evt.enlace && (
                        <a
                          href={evt.enlace}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#faa18f] hover:bg-[#e8907e] text-[#FEEBE7] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6"/>
                            <path d="M10 14 21 3"/>
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          </svg>
                          Entradas / Más
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

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FEEBE7] border border-[#faa18f]/30 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
              <img
                src={selectedEvent.foto || imgEventoFallback}
                alt={selectedEvent.titulo}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Details Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              {selectedEvent.lugar && (
                <div className="inline-flex items-center gap-2 bg-[#faa18f]/15 text-[#faa18f] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#faa18f]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {selectedEvent.lugar}
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#faa18f] leading-snug">
                {selectedEvent.titulo}
              </h2>

              {selectedEvent.descripcion && (
                <p className="text-sm font-sans text-[#654321]/90 leading-relaxed font-medium">
                  {selectedEvent.descripcion}
                </p>
              )}

              {selectedEvent.enlace && (
                <div className="pt-4">
                  <a
                    href={selectedEvent.enlace}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#faa18f] hover:bg-[#e8907e] text-[#FEEBE7] font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6"/>
                      <path d="M10 14 21 3"/>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    </svg>
                    Ir al enlace del Evento
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
