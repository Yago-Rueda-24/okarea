import { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Shirt,
  Sparkles,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';

export interface SolicitudAsesoria {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE';
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    nombre: string;
    email: string;
    role: string;
    createdAt: string;
  };
}

export interface PrendaItem {
  id: string;
  nombre: string;
  tipoPrenda: string;
  color?: string;
  temporada?: string;
  estilo?: string;
  fotoUrl: string;
  notasAdicionales?: Record<string, any>;
  createdAt?: string;
}

export default function AsesoriaAdminView() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAsesoria[]>([]);
  const [selectedSolicitudId, setSelectedSolicitudId] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtros
  const [statusFilter, setStatusFilter] = useState<'TODAS' | 'CONFIRMADA' | 'CANCELADA'>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');

  // Detalle del armario del solicitante
  const [wardrobe, setWardrobe] = useState<PrendaItem[]>([]);
  const [loadingWardrobe, setLoadingWardrobe] = useState(false);
  const [prendaCategoryFilter, setPrendaCategoryFilter] = useState<string>('all');

  // Estado de actualización de cita
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Cargar solicitudes de asesoría
  const fetchSolicitudes = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/armario/asesoria/admin/solicitudes`, {
        headers: {
          'x-api-key': ADMIN_API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar las solicitudes de asesoría.`);
      }

      const data: SolicitudAsesoria[] = await res.json();
      setSolicitudes(Array.isArray(data) ? data : []);

      // Auto-seleccionar la primera si no hay ninguna seleccionada
      if (data.length > 0 && !selectedSolicitudId) {
        setSelectedSolicitudId(data[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el backend de asesorías.');
    } finally {
      setLoadingList(false);
      setIsRefreshing(false);
    }
  };

  // Cargar armario del solicitante seleccionado
  const fetchArmarioSolicitante = async (solicitudId: string) => {
    setLoadingWardrobe(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/armario/asesoria/admin/solicitudes/${solicitudId}/armario`,
        {
          headers: {
            'x-api-key': ADMIN_API_KEY,
          },
        },
      );

      if (!res.ok) {
        throw new Error('No se pudo cargar el armario del usuario.');
      }

      const data: PrendaItem[] = await res.json();
      setWardrobe(Array.isArray(data) ? data : []);
    } catch {
      setWardrobe([]);
    } finally {
      setLoadingWardrobe(false);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    if (selectedSolicitudId) {
      fetchArmarioSolicitante(selectedSolicitudId);
      setPrendaCategoryFilter('all');
    } else {
      setWardrobe([]);
    }
  }, [selectedSolicitudId]);

  // Actualizar estado de la solicitud
  const handleCambiarEstado = async (id: string, nuevoEstado: 'CONFIRMADA' | 'CANCELADA') => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/armario/asesoria/admin/solicitudes/${id}/estado`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ADMIN_API_KEY,
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        },
      );

      if (!res.ok) {
        throw new Error('No se pudo actualizar el estado de la asesoría.');
      }

      // Actualizar en el estado local
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s)),
      );
    } catch (err: any) {
      alert(err.message || 'Error al actualizar estado.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filtrado de solicitudes
  const filteredSolicitudes = useMemo(() => {
    return solicitudes.filter((s) => {
      const matchStatus = statusFilter === 'TODAS' || s.estado === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.motivo?.toLowerCase().includes(q) ||
        s.user?.nombre?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.fecha?.includes(q);

      return matchStatus && matchQuery;
    });
  }, [solicitudes, statusFilter, searchQuery]);

  const selectedSolicitud = useMemo(() => {
    return solicitudes.find((s) => s.id === selectedSolicitudId) || null;
  }, [solicitudes, selectedSolicitudId]);

  // Filtrado de prendas del armario
  const filteredWardrobe = useMemo(() => {
    if (prendaCategoryFilter === 'all') return wardrobe;
    return wardrobe.filter(
      (p) => p.tipoPrenda?.toLowerCase() === prendaCategoryFilter.toLowerCase(),
    );
  }, [wardrobe, prendaCategoryFilter]);

  // Categorías presentes en el armario
  const wardrobeCategories = useMemo(() => {
    const set = new Set(wardrobe.map((p) => p.tipoPrenda).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [wardrobe]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Cabecera de Sección */}
      <div className="bg-white rounded-2xl p-6 border border-[#eee7e3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase mb-1">
            <span className="w-5 h-[1.5px] bg-primary"></span>
            <span>ATELIER OKAREA • SALON PRIVÉ</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1e1b19] tracking-tight">
            Solicitudes de Asesoría VIP
          </h1>
          <p className="text-sm text-[#88726c] max-w-2xl mt-1 leading-relaxed">
            Revisa las sesiones de 1 hora concertadas por los clientes, examina lo que solicitan y
            analiza su armario digital para preparar recomendaciones personalizadas de estilismo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#faf2ee] rounded-xl border border-[#eee7e3] text-xs">
            <span className="font-semibold text-[#1e1b19]">Total Solicitudes:</span>
            <span className="px-2 py-0.5 rounded-full bg-primary text-white font-bold">
              {solicitudes.length}
            </span>
          </div>
          <button
            onClick={fetchSolicitudes}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-white border border-[#eee7e3] text-[#55433e] hover:text-[#1e1b19] hover:bg-[#faf2ee] transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Refrescar solicitudes"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#ffdad6] text-[#93000a] flex items-center justify-between text-sm shadow-xs border border-[#ba1a1a]/20 animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="p-1 hover:bg-[#ffdad6]/80 rounded-md font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Contenedor Principal Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Panel Izquierdo: Lista de Solicitudes (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#eee7e3] p-4 shadow-xs space-y-4">
          {/* Filtros de Estado & Búsqueda */}
          <div className="space-y-3 pb-3 border-b border-[#eee7e3]">
            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#88726c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cliente, motivo o fecha..."
                className="w-full pl-9 pr-8 py-2 bg-[#faf2ee] border border-[#eee7e3] rounded-xl text-xs text-[#1e1b19] placeholder:text-[#88726c] focus:outline-hidden focus:ring-1 focus:ring-primary shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#88726c] hover:text-[#1e1b19]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Píldoras de Filtro de Estado */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {(['TODAS', 'CONFIRMADA', 'CANCELADA'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#94452c] text-white shadow-2xs'
                      : 'bg-[#faf2ee] text-[#55433e] hover:bg-[#eee7e3] border border-[#eee7e3]'
                  }`}
                >
                  {st === 'TODAS' ? 'Todas' : st === 'CONFIRMADA' ? 'Confirmadas' : 'Canceladas'}
                </button>
              ))}
            </div>
          </div>

          {/* Listado de Solicitudes */}
          <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
            {loadingList ? (
              <div className="p-8 text-center text-xs text-[#88726c]">
                Cargando solicitudes de asesoría...
              </div>
            ) : filteredSolicitudes.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#88726c]">
                No se encontraron solicitudes con los filtros actuales.
              </div>
            ) : (
              filteredSolicitudes.map((solicitud) => {
                const isSelected = selectedSolicitudId === solicitud.id;
                const isCancelada = solicitud.estado === 'CANCELADA';

                return (
                  <div
                    key={solicitud.id}
                    onClick={() => setSelectedSolicitudId(solicitud.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#fff8f5] border-primary shadow-xs ring-1 ring-primary/30'
                        : 'bg-[#faf2ee]/60 border-[#eee7e3] hover:bg-[#faf2ee] hover:border-primary/40'
                    }`}
                  >
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1b19]">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>{solicitud.fecha}</span>
                        <span className="text-[#88726c] font-normal">
                          ({solicitud.horaInicio} - {solicitud.horaFin})
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCancelada
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : 'bg-[#d3e9cc] text-[#394b36]'
                        }`}
                      >
                        {solicitud.estado}
                      </span>
                    </div>

                    {/* Solicitante */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {solicitud.user?.nombre?.[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1e1b19] truncate">
                          {solicitud.user?.nombre || 'Usuario Registrado'}
                        </p>
                        <p className="text-[11px] text-[#88726c] truncate">
                          {solicitud.user?.email || 'Sin email'}
                        </p>
                      </div>
                    </div>

                    {/* Fragmento de lo que pide */}
                    <p className="text-[11px] text-[#55433e] line-clamp-2 italic bg-white/70 p-2 rounded-lg border border-[#eee7e3]/60">
                      &quot;{solicitud.motivo}&quot;
                    </p>

                    {isSelected && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Detalle de Solicitud y Armario (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!selectedSolicitud ? (
            <div className="bg-white rounded-2xl border border-[#eee7e3] p-12 text-center text-[#88726c] shadow-xs">
              <Shirt className="w-12 h-12 mx-auto text-[#88726c]/40 mb-3" />
              <p className="font-semibold text-sm">Ninguna solicitud seleccionada</p>
              <p className="text-xs mt-1">
                Haz clic en una solicitud de la lista para ver qué pide el cliente y examinar su armario.
              </p>
            </div>
          ) : (
            <>
              {/* 1. Ficha del Solicitante y Acciones de la Cita */}
              <div className="bg-white rounded-2xl border border-[#eee7e3] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eee7e3]">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#88726c] font-bold block">
                      SOLICITUD ATELIER VIP
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#1e1b19] mt-0.5">
                      Cita de 1 Hora: {selectedSolicitud.fecha}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-[#55433e] mt-1 font-medium">
                      <span className="flex items-center gap-1 text-primary">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedSolicitud.horaInicio} - {selectedSolicitud.horaFin} (60 min)
                      </span>
                      <span>•</span>
                      <span>Estado: <strong>{selectedSolicitud.estado}</strong></span>
                    </div>
                  </div>

                  {/* Acciones de Estado */}
                  <div className="flex items-center gap-2">
                    {selectedSolicitud.estado !== 'CANCELADA' ? (
                      <button
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => handleCambiarEstado(selectedSolicitud.id, 'CANCELADA')}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-[#93000a] bg-[#ffdad6]/60 hover:bg-[#ffdad6] border border-[#ba1a1a]/30 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancelar Cita</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => handleCambiarEstado(selectedSolicitud.id, 'CONFIRMADA')}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-[#394b36] bg-[#d3e9cc] hover:bg-[#b8ccb1] border border-[#51634d]/30 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reactivar Cita</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Datos del Usuario Solicitante */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#faf2ee] p-4 rounded-xl border border-[#eee7e3]">
                  <div>
                    <span className="text-[10px] text-[#88726c] uppercase tracking-wider font-semibold block">
                      Cliente Solicitante
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-[#1e1b19]">
                        {selectedSolicitud.user?.nombre || 'Usuario Anónimo'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#88726c] uppercase tracking-wider font-semibold block">
                      Correo Electrónico
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-[#1e1b19]">
                        {selectedSolicitud.user?.email || 'Sin correo asociado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Tarjeta Destacada: Lo que solicita en la asesoría */}
              <div className="bg-white rounded-2xl border border-[#eee7e3] p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Lo que solicita en esta sesión</span>
                </div>

                <div className="p-4 rounded-xl bg-[#fff8f5] border border-[#b35c41]/30 relative">
                  <div className="text-xs lg:text-sm text-[#1e1b19] leading-relaxed italic whitespace-pre-wrap">
                    &quot;{selectedSolicitud.motivo}&quot;
                  </div>
                </div>
              </div>

              {/* 3. Armario Digital del Solicitante */}
              <div className="bg-white rounded-2xl border border-[#eee7e3] p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#eee7e3]">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-primary" />
                    <h3 className="font-serif text-lg font-bold text-[#1e1b19]">
                      Armario del Solicitante
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-white font-bold ml-1">
                      {wardrobe.length} prendas
                    </span>
                  </div>

                  {/* Filtro de Categoría de Prendas */}
                  {wardrobe.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                      {wardrobeCategories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setPrendaCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize cursor-pointer whitespace-nowrap ${
                            prendaCategoryFilter === cat
                              ? 'bg-primary text-white shadow-2xs'
                              : 'bg-[#faf2ee] text-[#55433e] hover:bg-[#eee7e3]'
                          }`}
                        >
                          {cat === 'all' ? 'Todas' : cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Galería de Prendas */}
                {loadingWardrobe ? (
                  <div className="p-12 text-center text-xs text-[#88726c]">
                    Cargando prendas del armario del usuario...
                  </div>
                ) : wardrobe.length === 0 ? (
                  <div className="p-8 text-center bg-[#faf2ee] rounded-xl border border-dashed border-[#eee7e3] text-[#88726c] text-xs">
                    <Shirt className="w-8 h-8 mx-auto text-[#88726c]/40 mb-2" />
                    <p className="font-semibold text-[#1e1b19]">Armario sin prendas registradas</p>
                    <p className="mt-0.5">
                      El cliente solicitante aún no ha subido prendas a su armario digital.
                    </p>
                  </div>
                ) : filteredWardrobe.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#88726c]">
                    No hay prendas registradas en la categoría seleccionada.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredWardrobe.map((prenda) => (
                      <div
                        key={prenda.id}
                        className="p-2.5 rounded-xl bg-[#faf2ee] border border-[#eee7e3] shadow-2xs flex flex-col justify-between group hover:border-primary/50 transition-all"
                      >
                        {/* Foto de la Prenda */}
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 relative">
                          {prenda.fotoUrl ? (
                            <img
                              src={prenda.fotoUrl}
                              alt={prenda.nombre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#eee7e3] text-[#88726c]">
                              <Shirt className="w-8 h-8 opacity-40" />
                            </div>
                          )}

                          <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/90 text-[#1e1b19] capitalize backdrop-blur-xs shadow-2xs">
                            {prenda.tipoPrenda}
                          </span>
                        </div>

                        {/* Datos de la Prenda */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#1e1b19] truncate" title={prenda.nombre}>
                            {prenda.nombre}
                          </h4>

                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#88726c]">
                            {prenda.color && (
                              <span className="px-1.5 py-0.2 bg-white rounded border border-[#eee7e3]">
                                {prenda.color}
                              </span>
                            )}
                            {prenda.temporada && (
                              <span className="px-1.5 py-0.2 bg-white rounded border border-[#eee7e3]">
                                {prenda.temporada}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
