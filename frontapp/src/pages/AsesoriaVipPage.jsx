import { useState } from 'react';
import { SERVICES_MOCK } from '../mocks/asesoriaData';
import ServiceCard from '../components/asesoria/ServiceCard';
import BookingStepper from '../components/asesoria/BookingStepper';
import SessionSummaryCard from '../components/asesoria/SessionSummaryCard';
import FaqAccordion from '../components/asesoria/FaqAccordion';

export default function AsesoriaVipPage() {
  const [selectedService, setSelectedService] = useState(SERVICES_MOCK[0]);
  const [stylistMode, setStylistMode] = useState('auto');
  const [selectedStylist, setSelectedStylist] = useState('Clara Vidal Royo');
  const [selectedDay, setSelectedDay] = useState('Mar 15 Oct');
  const [selectedTime, setSelectedTime] = useState('12:30 - 14:00');
  const [briefing, setBriefing] = useState({
    goal: '',
    garments: '',
    authorized: true,
  });

  const activeStylist =
    stylistMode === 'auto' ? 'Clara Vidal Royo (Smart Match)' : selectedStylist;

  const handleBookingConfirmed = (data) => {
    // Booking confirmation callback
    console.log('Reserva confirmada:', data);
  };

  return (
    <div className="flex flex-col w-full px-gutter py-space-lg">
      {/* 1. Cabecera Editorial & Credenciales */}
      <section className="relative w-full mb-space-xl overflow-hidden rounded-xl bg-surface-container-low p-space-xl shadow-sm">
        {/* Glow circles */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-2xl">
            <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-widest mb-space-xs">
              <span className="inline-block w-6 h-[1px] bg-primary"></span>
              <span>SALON PRIVÉ • HAUTE CURATION</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-space-sm font-headline-lg">
              Asesoría y Estilismo Profesional
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Sesiones privadas 1 a 1 con archivistas de moda y expertos en morfología, colorimetría e ingeniería del armario. Eleve su narrativa visual personal con el rigor editorial de las grandes cabeceras.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-auto bg-surface-container-lowest/80 backdrop-blur-sm px-space-md py-space-sm rounded-xl border border-surface-container-high/60 shadow-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">workspace_premium</span>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                Garantía Atelier 100%
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Dossier y satisfacción asegurada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grilla de 4 Servicios Especializados */}
      <section className="mb-space-xl">
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Catálogo de Protocolos
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Servicios Especializados
            </h2>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant">
            {SERVICES_MOCK.length} modalidades disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {SERVICES_MOCK.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={selectedService.id === service.id}
              onSelect={(s) => setSelectedService(s)}
            />
          ))}
        </div>
      </section>

      {/* 3. Flujo Interactivo: Configura tu Sesión VIP */}
      <section className="mb-space-xl p-space-xl rounded-xl bg-surface-container-low shadow-sm">
        <div className="max-w-xl mb-space-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Atelier Scheduling Engine
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm text-outline">
              Disponibilidad en Tiempo Real
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-headline-md">
            Configura tu Sesión VIP
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Personalice los pormenores de su consulta en tres simples etapas con reserva inmediata garantizada.
          </p>
        </div>

        {/* Stepper a la izquierda (8 cols) / Resumen a la derecha (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          <div className="lg:col-span-8">
            <BookingStepper
              stylistMode={stylistMode}
              setStylistMode={setStylistMode}
              selectedStylist={selectedStylist}
              setSelectedStylist={setSelectedStylist}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              briefing={briefing}
              setBriefing={setBriefing}
            />
          </div>

          <div className="lg:col-span-4">
            <SessionSummaryCard
              service={selectedService}
              stylist={activeStylist}
              day={selectedDay}
              time={selectedTime}
              onBookingConfirmed={handleBookingConfirmed}
            />
          </div>
        </div>
      </section>

      {/* 4. Acordeón de Preguntas Frecuentes (FAQ) */}
      <div className="mb-space-xl">
        <FaqAccordion />
      </div>
    </div>
  );
}
