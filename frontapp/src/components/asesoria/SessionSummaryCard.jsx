import { useState } from 'react';
import { DELIVERABLES_MOCK } from '../../mocks/asesoriaData';

export default function SessionSummaryCard({
  service,
  stylist,
  day,
  time,
  onBookingConfirmed,
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'confirmed'

  const price = service.price || 185;
  const subtotal = price / 1.21;
  const tax = price - subtotal;

  const formatEuro = (val) =>
    val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const handleConfirm = () => {
    if (status !== 'idle') return;
    setStatus('processing');
    setTimeout(() => {
      setStatus('confirmed');
      if (onBookingConfirmed) {
        onBookingConfirmed({
          service: service.title,
          price,
          stylist,
          day,
          time,
        });
      }
    }, 1200);
  };

  const timeShort = time ? time.split(' ')[0] : '12:30';

  return (
    <div className="sticky top-28 p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col">
      <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high/40">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
            Recibo Estimado
          </span>
          <h3 className="font-title-lg text-title-lg text-on-surface font-headline-md">
            Tu Sesión Atelier
          </h3>
        </div>
        <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
      </div>

      {/* Desglose de selección */}
      <div className="space-y-space-sm mb-space-md">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-outline block">
              Servicio Seleccionado
            </span>
            <span className="font-title-md text-title-md text-on-surface font-medium" id="summary-service">
              {service.title}
            </span>
          </div>
          <span className="font-title-md text-title-md text-on-surface font-bold whitespace-nowrap pl-2" id="summary-price">
            {price.toFixed(2).replace('.', ',')} €
          </span>
        </div>

        <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-outline text-[18px]">person</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Estilista:</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface font-semibold" id="summary-stylist">
            {stylist}
          </span>
        </div>

        <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-outline text-[18px]">calendar_today</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Cita:</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface font-semibold" id="summary-datetime">
            {day} • {timeShort}
          </span>
        </div>
      </div>

      {/* Entregables incluidos */}
      <div className="p-space-md rounded-lg bg-surface-container-low mb-space-md space-y-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-1">
          Entregables Garantizados
        </span>
        {DELIVERABLES_MOCK.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-secondary text-[16px]">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Total e IVA */}
      <div className="space-y-1 mb-space-md pt-space-xs">
        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>Subtotal neto</span>
          <span id="summary-subtotal">{formatEuro(subtotal)}</span>
        </div>
        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>IVA aplicado (21%)</span>
          <span id="summary-tax">{formatEuro(tax)}</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-surface-container-high/60">
          <span className="font-title-lg text-title-lg text-on-surface font-bold">Total Atelier</span>
          <span className="font-headline-md text-headline-md text-primary font-bold" id="summary-total">
            {formatEuro(price)}
          </span>
        </div>
      </div>

      {/* Botón de Confirmación Principal */}
      <button
        onClick={handleConfirm}
        disabled={status !== 'idle'}
        className={`w-full py-space-md rounded-lg font-title-md text-title-md transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer ${
          status === 'confirmed'
            ? 'bg-secondary text-on-secondary'
            : 'bg-primary hover:bg-primary-container text-on-primary'
        }`}
        id="confirm-booking-btn"
        type="button"
      >
        {status === 'idle' && (
          <>
            <span>Confirmar &amp; Agendar Cita</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </>
        )}
        {status === 'processing' && (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
            <span>Procesando Reserva Privada...</span>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <span className="material-symbols-outlined text-[20px]">check</span>
            <span>¡Cita Reservada con Éxito!</span>
          </>
        )}
      </button>

      <span className="font-label-sm text-label-sm text-center text-outline block mt-space-xs">
        Cancelación o reprogramación sin coste hasta 24h previas
      </span>
    </div>
  );
}
