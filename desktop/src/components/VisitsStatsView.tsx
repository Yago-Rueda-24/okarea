import { useState, useEffect } from 'react';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import {
  Eye,
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Globe,
} from 'lucide-react';

export interface VisitsStats {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitorsTotal: number;
  uniqueVisitorsToday: number;
  topPages: { path: string; visits: number }[];
}

export default function VisitsStatsView() {
  const [stats, setStats] = useState<VisitsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/visits/stats`, {
        headers: {
          'x-api-key': ADMIN_API_KEY,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Acceso no autorizado: API Key no válida o ausente.');
        }
        throw new Error(`Error en el servidor (${res.status}) al obtener analítica.`);
      }

      const data: VisitsStats = await res.json();
      setStats(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudieron cargar las estadísticas de visitas.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getPercentage = (visits: number) => {
    if (!stats || stats.totalVisits === 0) return 0;
    return Math.round((visits / stats.totalVisits) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-3 text-[#88726c] py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-medium">Cargando analítica de visitas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#eee7e3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="font-serif text-2xl font-bold text-[#1e1b19] tracking-tight">Estadísticas de Visitas</h1>
            <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/20">
              Frontend Analytics
            </span>
          </div>
          <p className="text-xs text-[#88726c]">
            Métricas en tiempo real de tráfico, páginas más visitadas y visitantes únicos.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isRefreshing}
          className="px-4 py-2 bg-[#faf2ee] hover:bg-[#eee7e3] text-[#1e1b19] text-xs font-semibold rounded-xl border border-[#eee7e3] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          <span>Actualizar datos</span>
        </button>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 rounded-2xl p-4 flex items-center gap-3 text-[#93000a] text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Visits Card */}
        <div className="bg-white border border-[#eee7e3] rounded-2xl p-5 relative overflow-hidden group hover:border-primary/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#88726c]">Visitas Totales</span>
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1e1b19] tracking-tight">
            {stats?.totalVisits.toLocaleString('es-ES') ?? 0}
          </div>
          <p className="text-[11px] text-[#88726c] mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#51634d]" />
            <span>Total acumulado de páginas vistas</span>
          </p>
        </div>

        {/* Today Visits Card */}
        <div className="bg-white border border-[#eee7e3] rounded-2xl p-5 relative overflow-hidden group hover:border-primary/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#88726c]">Visitas Hoy</span>
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1e1b19] tracking-tight">
            {stats?.todayVisits.toLocaleString('es-ES') ?? 0}
          </div>
          <p className="text-[11px] text-[#88726c] mt-2 flex items-center gap-1">
            <ClockIcon className="w-3 h-3 text-primary" />
            <span>Páginas vistas en las últimas 24h</span>
          </p>
        </div>

        {/* Total Unique Visitors Card */}
        <div className="bg-white border border-[#eee7e3] rounded-2xl p-5 relative overflow-hidden group hover:border-primary/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#88726c]">Visitantes Únicos</span>
            <div className="p-2 bg-[#d3e9cc] text-[#394b36] rounded-xl border border-[#b8ccb1]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1e1b19] tracking-tight">
            {stats?.uniqueVisitorsTotal.toLocaleString('es-ES') ?? 0}
          </div>
          <p className="text-[11px] text-[#88726c] mt-2 flex items-center gap-1">
            <Globe className="w-3 h-3 text-[#51634d]" />
            <span>IPs únicas registradas</span>
          </p>
        </div>

        {/* Today Unique Visitors Card */}
        <div className="bg-white border border-[#eee7e3] rounded-2xl p-5 relative overflow-hidden group hover:border-primary/40 transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#88726c]">Únicos de Hoy</span>
            <div className="p-2 bg-[#ffdea6] text-[#785600] rounded-xl border border-[#f7bd48]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1e1b19] tracking-tight">
            {stats?.uniqueVisitorsToday.toLocaleString('es-ES') ?? 0}
          </div>
          <p className="text-[11px] text-[#88726c] mt-2 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-[#785600]" />
            <span>Nuevos usuarios hoy</span>
          </p>
        </div>
      </div>

      {/* Top Pages Breakdown */}
      <div className="bg-white border border-[#eee7e3] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#eee7e3]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1e1b19] flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Páginas Más Visitadas
            </h2>
            <p className="text-xs text-[#88726c] mt-0.5">
              Ranking de secciones del frontend según el número de visualizaciones.
            </p>
          </div>
        </div>

        {!stats || stats.topPages.length === 0 ? (
          <div className="py-12 text-center text-[#88726c] text-xs">
            No hay registros de visitas disponibles todavía.
          </div>
        ) : (
          <div className="space-y-4">
            {stats.topPages.map((page, idx) => {
              const pct = getPercentage(page.visits);
              return (
                <div key={idx} className="group p-3 rounded-xl hover:bg-[#faf2ee] transition-colors border border-transparent hover:border-[#eee7e3]">
                  <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#faf2ee] text-[#55433e] font-bold flex items-center justify-center text-[11px] border border-[#eee7e3]">
                        #{idx + 1}
                      </span>
                      <span className="text-[#1e1b19] font-mono group-hover:text-primary transition-colors">
                        {page.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#88726c] text-[11px]">{pct}% del tráfico</span>
                      <span className="text-[#1e1b19] font-bold bg-[#faf2ee] px-2.5 py-0.5 rounded-md border border-[#eee7e3]">
                        {page.visits.toLocaleString('es-ES')} visitas
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#eee7e3] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
