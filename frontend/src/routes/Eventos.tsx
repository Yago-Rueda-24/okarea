import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { formatImageUrl } from '../utils/image';
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

const getEventImage = (foto?: string): string => {
  const formatted = formatImageUrl(foto);
  return formatted || imgEventoFallback;
};

let eventsCache: EventItem[] | null = null;

export default function Eventos() {
  const [events, setEvents] = useState<EventItem[]>(() => eventsCache || []);
  const [loading, setLoading] = useState(!eventsCache);

  useEffect(() => {
    let isMounted = true;
    if (!eventsCache) {
      setLoading(true);
    }

    async function fetchEvents() {
      try {
        const response = await fetch(`${API_BASE_URL}/events`);
        if (!response.ok) throw new Error('Error al conectar con el servidor');

        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          eventsCache = data;
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
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light italic uppercase tracking-wider text-[#faa18f] mb-6 leading-tight">
          Eventos
        </h1>
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
              const displayImage = getEventImage(evt.foto);

              return (
                <div
                  key={evt.id}
                  className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden border border-[#faa18f]/30 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col group"
                >
                  {/* Event Image Header */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
                    <img
                      src={displayImage}
                      alt={evt.titulo}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = imgEventoFallback;
                      }}
                    />
                  </div>

                  {/* Event Info Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {evt.lugar && (
                        <div className="inline-flex items-center gap-2 bg-[#faa18f]/15 text-[#faa18f] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#faa18f]/30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {evt.lugar}
                        </div>
                      )}

                      <h2 className="text-2xl font-bold uppercase tracking-wider text-[#faa18f] leading-snug">
                        {evt.titulo}
                      </h2>

                      {evt.descripcion && (
                        <p className="text-sm font-sans text-[#654321]/90 leading-relaxed font-medium">
                          {evt.descripcion}
                        </p>
                      )}
                    </div>

                    {evt.enlace && (
                      <div className="pt-4 border-t border-[#faa18f]/20">
                        <a
                          href={evt.enlace}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#faa18f] hover:bg-[#e8907e] text-[#FEEBE7] font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                          Ir al enlace
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
