import { useState, useEffect, useMemo } from 'react';
import FaqAccordion from '../components/asesoria/FaqAccordion';
import {
  getDisponibilidadApi,
  createAsesoriaApi,
  getMisAsesoriasApi,
  cancelarAsesoriaApi,
} from '../api/asesoria';
import { useAuth } from '../context/useAuth';

const HORARIOS_POR_DEFECTO = [
  { horaInicio: '09:00', horaFin: '10:00', disponible: true },
  { horaInicio: '10:00', horaFin: '11:00', disponible: true },
  { horaInicio: '11:00', horaFin: '12:00', disponible: true },
  { horaInicio: '12:00', horaFin: '13:00', disponible: true },
  { horaInicio: '13:00', horaFin: '14:00', disponible: true },
  { horaInicio: '16:00', horaFin: '17:00', disponible: true },
  { horaInicio: '17:00', horaFin: '18:00', disponible: true },
  { horaInicio: '18:00', horaFin: '19:00', disponible: true },
  { horaInicio: '19:00', horaFin: '20:00', disponible: true },
];

export default function AsesoriaVipPage() {
  const { isAuthenticated } = useAuth();

  // Fecha por defecto: hoy
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedHora, setSelectedHora] = useState('');
  const [motivo, setMotivo] = useState('');

  const [slots, setSlots] = useState(HORARIOS_POR_DEFECTO);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [misAsesorias, setMisAsesorias] = useState([]);
  const [loadingAsesorias, setLoadingAsesorias] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Cargar disponibilidad para la fecha seleccionada cuando cambia
  useEffect(() => {
    let ignore = false;
    getDisponibilidadApi(selectedDate)
      .then((data) => {
        if (!ignore) {
          setSlots(Array.isArray(data) && data.length > 0 ? data : HORARIOS_POR_DEFECTO);
        }
      })
      .catch(() => {
        if (!ignore) {
          setSlots(HORARIOS_POR_DEFECTO);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoadingSlots(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  // Cargar las asesorías del usuario cuando se autentica
  useEffect(() => {
    let ignore = false;
    if (isAuthenticated) {
      getMisAsesoriasApi()
        .then((data) => {
          if (!ignore) {
            setMisAsesorias(Array.isArray(data) ? data : []);
          }
        })
        .catch(() => {
          if (!ignore) {
            setMisAsesorias([]);
          }
        })
        .finally(() => {
          if (!ignore) {
            setLoadingAsesorias(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  // Funciones de refresco para acciones de usuario (event handlers)
  const refreshDisponibilidad = (fecha) => {
    setLoadingSlots(true);
    getDisponibilidadApi(fecha)
      .then((data) => setSlots(Array.isArray(data) && data.length > 0 ? data : HORARIOS_POR_DEFECTO))
      .catch(() => setSlots(HORARIOS_POR_DEFECTO))
      .finally(() => setLoadingSlots(false));
  };

  const refreshMisAsesorias = () => {
    if (!isAuthenticated) return;
    setLoadingAsesorias(true);
    getMisAsesoriasApi()
      .then((data) => setMisAsesorias(Array.isArray(data) ? data : []))
      .catch(() => setMisAsesorias([]))
      .finally(() => setLoadingAsesorias(false));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setSelectedHora('');
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSelectSlot = (slot) => {
    if (!slot.disponible) return;
    setSelectedHora(slot.horaInicio);
    setErrorMessage(null);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setErrorMessage('Por favor, selecciona una fecha.');
      return;
    }
    if (!selectedHora) {
      setErrorMessage('Por favor, selecciona una franja horaria de 1 hora.');
      return;
    }
    if (!motivo.trim() || motivo.trim().length < 5) {
      setErrorMessage('Por favor, describe en al menos 5 caracteres qué deseas en esta asesoría.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const nueva = await createAsesoriaApi({
        fecha: selectedDate,
        horaInicio: selectedHora,
        motivo: motivo.trim(),
      });

      const horaFin = nueva?.horaFin || '1h';
      setSuccessMessage(
        `¡Asesoría VIP reservada con éxito! Te esperamos el ${selectedDate} de ${selectedHora} a ${horaFin}.`,
      );
      setMotivo('');
      setSelectedHora('');

      // Refrescar disponibilidad y citas
      refreshDisponibilidad(selectedDate);
      refreshMisAsesorias();
    } catch (err) {
      if (err.response?.status === 409) {
        setErrorMessage(
          err.response.data?.message ||
            'La franja horaria seleccionada ya ha sido reservada por otro usuario. Por favor, selecciona otra hora.',
        );
        // Refrescar disponibilidad inmediatamente
        refreshDisponibilidad(selectedDate);
      } else {
        setErrorMessage(
          err.response?.data?.message ||
            'Hubo un problema al concertar la asesoría. Verifica tu conexión o inténtalo más tarde.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelarCita = async (id) => {
    if (!window.confirm('¿Deseas cancelar esta sesión de asesoría?')) return;
    try {
      await cancelarAsesoriaApi(id);
      refreshMisAsesorias();
      refreshDisponibilidad(selectedDate);
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo cancelar la cita.');
    }
  };

  const selectedSlotObj = slots.find((s) => s.horaInicio === selectedHora);

  return (
    <div className="flex flex-col w-full px-gutter py-space-lg max-w-7xl mx-auto">
      {/* 1. Cabecera Editorial */}
      <section className="relative w-full mb-space-xl overflow-hidden rounded-2xl bg-surface-container-low p-space-xl shadow-xs border border-surface-container-high/40">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-2xl">
            <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-widest mb-space-xs font-semibold">
              <span className="inline-block w-6 h-[1px] bg-primary"></span>
              <span>SALON PRIVÉ • ATELIER OKAREA</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-space-sm font-headline-lg">
              Asesoría VIP Personalizada
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Sesiones privadas y exclusivas de 1 hora dedicadas a la curaduría de tu armario,
              colorimetría, revisión de looks y preparación de ocasiones especiales. Reserva tu
              franja horaria en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-auto bg-surface-container-lowest/90 backdrop-blur-sm px-space-md py-space-sm rounded-xl border border-surface-container-high/60 shadow-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">
              event_available
            </span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Franja Exclusiva de 1 Hora
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Garantía de disponibilidad única
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Notificaciones */}
      {successMessage && (
        <div className="mb-space-lg p-space-md rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-secondary">
              check_circle
            </span>
            <div>
              <p className="font-title-md text-title-md font-semibold">
                Reserva confirmada
              </p>
              <p className="font-body-sm text-body-sm opacity-90">{successMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            type="button"
            className="p-1 rounded-full hover:bg-secondary/10"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-space-lg p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-error">
              error
            </span>
            <div>
              <p className="font-title-md text-title-md font-semibold">
                Atención
              </p>
              <p className="font-body-sm text-body-sm opacity-90">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            type="button"
            className="p-1 rounded-full hover:bg-error/10"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* 2. Sección Principal: Reserva de Asesoría */}
      <section className="mb-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* Formulario de Reserva (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-space-lg lg:p-space-xl border border-surface-container-high/60 shadow-xs">
          <div className="mb-space-lg pb-space-sm border-b border-surface-container-high/40">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-headline-md">
              Concertar Cita
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Selecciona el día, la franja de 1 hora disponible y cuéntanos qué deseas tratar.
            </p>
          </div>

          <form onSubmit={handleSubmitBooking} className="space-y-space-lg">
            {/* 1. Selector de Fecha */}
            <div>
              <label
                htmlFor="input-fecha-asesoria"
                className="font-title-md text-title-md text-on-surface font-semibold block mb-space-xs"
              >
                1. Selecciona la fecha
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm">
                <input
                  id="input-fecha-asesoria"
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="px-space-md py-space-sm rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
                  required
                />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {loadingSlots ? 'Consultando disponibilidad...' : 'Horarios actualizados en tiempo real'}
                </span>
              </div>
            </div>

            {/* 2. Selector de Franja Horaria (1 hora) */}
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <label className="font-title-md text-title-md text-on-surface font-semibold block">
                  2. Selecciona la franja horaria (1 hora)
                </label>
                <div className="flex items-center gap-3 text-body-xs font-label-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Libre
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span> Reservada
                  </span>
                </div>
              </div>

              {loadingSlots ? (
                <div className="p-space-lg text-center text-on-surface-variant font-body-md">
                  Cargando franjas disponibles...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
                  {slots.map((slot) => {
                    const isSelected = selectedHora === slot.horaInicio;
                    const isAvailable = slot.disponible;

                    return (
                      <button
                        key={slot.horaInicio}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleSelectSlot(slot)}
                        className={`flex flex-col items-center justify-center p-space-md rounded-xl border transition-all text-center ${
                          !isAvailable
                            ? 'bg-surface-container-high/40 border-surface-container-high text-outline cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm font-semibold'
                            : 'bg-surface-container-low border-surface-container-high/60 text-on-surface hover:bg-surface-container hover:border-primary/50'
                        }`}
                      >
                        <span className="font-title-md text-title-md">
                          {slot.horaInicio} - {slot.horaFin}
                        </span>
                        <span className="font-label-sm text-label-sm mt-0.5 opacity-90">
                          {isAvailable ? (isSelected ? 'Seleccionada' : '1 hora libre') : 'Reservada'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Requerimientos / Motivo */}
            <div>
              <label
                htmlFor="textarea-motivo-asesoria"
                className="font-title-md text-title-md text-on-surface font-semibold block mb-space-xs"
              >
                3. ¿Qué deseas tratar en esta sesión?
              </label>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-xs">
                Describe tus objetivos o necesidades: revisión de armario estacional, preparación de looks para un viaje o evento, asesoría sobre prendas concretas, etc.
              </p>
              <textarea
                id="textarea-motivo-asesoria"
                rows={4}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ejemplo: Necesito renovar mi cápsula de primavera y combinar unas chaquetas vintage con las prendas de mi armario..."
                className="w-full p-space-md rounded-xl border border-surface-container-high bg-surface-container-lowest text-on-surface font-body-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary"
                required
              />
              <div className="flex justify-end mt-1 text-label-sm font-label-sm text-outline">
                {motivo.length} caracteres
              </div>
            </div>

            {/* Botón de Envío */}
            <div className="pt-space-sm border-t border-surface-container-high/40 flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="text-body-sm font-body-sm text-on-surface-variant">
                {selectedHora && selectedSlotObj ? (
                  <span>
                    Franja seleccionada: <strong>{selectedDate}</strong> de{' '}
                    <strong>
                      {selectedSlotObj.horaInicio} a {selectedSlotObj.horaFin}
                    </strong>
                  </span>
                ) : (
                  <span>Selecciona una franja horaria para continuar</span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedHora || motivo.trim().length < 5}
                className="w-full sm:w-auto px-space-xl py-space-sm rounded-xl bg-primary text-on-primary font-title-md text-title-md font-semibold shadow-xs hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                    <span>Reservando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">
                      check_circle
                    </span>
                    <span>Concertar Asesoría VIP (1 hora)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Panel Resumen & Mis Citas (4 cols) */}
        <div className="lg:col-span-4 space-y-space-lg">
          {/* Tarjeta de Garantía y Formato */}
          <div className="p-space-lg rounded-2xl bg-surface-container-low border border-surface-container-high/60 shadow-xs">
            <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-wider font-semibold mb-space-xs">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Compromiso Atelier</span>
            </div>
            <h3 className="font-title-lg text-title-lg text-on-surface font-semibold mb-space-xs">
              Formato de la Sesión
            </h3>
            <ul className="space-y-space-sm text-body-sm font-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                  schedule
                </span>
                <span>Duración exacta de 60 minutos reservados en exclusiva para ti.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                  check_box
                </span>
                <span>Sin solapamientos: la agenda se bloquea en cuanto confirmas tu cita.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                  menu_book
                </span>
                <span>Análisis sobre las prendas digitalizadas en tu armario.</span>
              </li>
            </ul>
          </div>

          {/* Mis Citas Concertadas */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-xs">
            <div className="flex items-center justify-between pb-space-xs mb-space-md border-b border-surface-container-high/40">
              <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                Mis Asesorías
              </h3>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                {misAsesorias.length}
              </span>
            </div>

            {loadingAsesorias ? (
              <p className="text-body-sm font-body-sm text-on-surface-variant py-2">
                Cargando tus citas...
              </p>
            ) : misAsesorias.length === 0 ? (
              <p className="text-body-sm font-body-sm text-on-surface-variant py-2">
                No tienes ninguna asesoría concertada todavía.
              </p>
            ) : (
              <div className="space-y-space-sm max-h-96 overflow-y-auto pr-1">
                {misAsesorias.map((asesoria) => {
                  const isCancelada = asesoria.estado === 'CANCELADA';
                  return (
                    <div
                      key={asesoria.id}
                      className={`p-space-sm rounded-xl border text-body-sm ${
                        isCancelada
                          ? 'bg-surface-container-low border-surface-container-high opacity-60'
                          : 'bg-surface-container-lowest border-primary/30 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-on-surface">
                          {asesoria.fecha} ({asesoria.horaInicio} - {asesoria.horaFin})
                        </span>
                        <span
                          className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${
                            isCancelada
                              ? 'bg-surface-container-highest text-outline'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          {asesoria.estado}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-body-xs line-clamp-2 mb-2 italic">
                        &quot;{asesoria.motivo}&quot;
                      </p>
                      {!isCancelada && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleCancelarCita(asesoria.id)}
                            className="text-error font-label-sm text-label-sm hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              cancel
                            </span>
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Preguntas Frecuentes */}
      <div className="mb-space-xl">
        <FaqAccordion />
      </div>
    </div>
  );
}
