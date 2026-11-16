import { DAYS_MOCK, TIME_SLOTS_MOCK, STYLISTS_MOCK } from '../../mocks/asesoriaData';

export default function BookingStepper({
  stylistMode,
  setStylistMode,
  selectedStylist,
  setSelectedStylist,
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
  briefing,
  setBriefing,
}) {
  return (
    <div className="space-y-space-xl">
      {/* Paso 1: Asignación de Estilista */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center gap-space-md mb-space-md">
          <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-title-md text-title-md flex items-center justify-center font-bold">
            1
          </span>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Asignación de Estilista
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Seleccione concordancia algorítmica de vestuario o elija manualmente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-md">
          {/* Opción Algoritmo */}
          <label
            onClick={() => setStylistMode('auto')}
            className={`relative flex items-start gap-space-sm p-space-md rounded-lg cursor-pointer transition-colors ${
              stylistMode === 'auto'
                ? 'bg-surface-container border border-primary/40'
                : 'bg-surface-container-low hover:bg-surface-container'
            }`}
          >
            <input
              checked={stylistMode === 'auto'}
              onChange={() => setStylistMode('auto')}
              className="mt-1 accent-primary"
              name="stylist_assign"
              type="radio"
              value="auto"
            />
            <div>
              <span className="font-title-md text-title-md text-on-surface font-semibold block">
                Smart Match Atelier
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                El sistema asigna al archivista con mayor afinidad a las marcas de su armario.
              </span>
              <span className="inline-block mt-2 font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container">
                Recomendado
              </span>
            </div>
          </label>

          {/* Opción Manual */}
          <label
            onClick={() => setStylistMode('manual')}
            className={`relative flex items-start gap-space-sm p-space-md rounded-lg cursor-pointer transition-colors ${
              stylistMode === 'manual'
                ? 'bg-surface-container border border-primary/40'
                : 'bg-surface-container-low hover:bg-surface-container'
            }`}
          >
            <input
              checked={stylistMode === 'manual'}
              onChange={() => setStylistMode('manual')}
              className="mt-1 accent-primary"
              name="stylist_assign"
              type="radio"
              value="manual"
            />
            <div className="w-full">
              <span className="font-title-md text-title-md text-on-surface font-semibold block">
                Elección Personal
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                Seleccione a su estilista favorito del panel directivo.
              </span>
              <select
                value={selectedStylist}
                onChange={(e) => {
                  setSelectedStylist(e.target.value);
                  setStylistMode('manual');
                }}
                className="mt-2 w-full bg-surface-container-lowest font-body-sm text-body-sm text-on-surface rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                id="stylist-selector"
              >
                {STYLISTS_MOCK.map((st) => (
                  <option key={st.id} value={st.name}>
                    {st.name} ({st.location})
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </div>

      {/* Paso 2: Elección de Fecha y Espacio Horario */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center gap-space-md mb-space-md">
          <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-title-md text-title-md flex items-center justify-center font-bold">
            2
          </span>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Elección de Fecha y Espacio Horario
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Zona horaria activa: Madrid / París (CET)
            </p>
          </div>
        </div>

        {/* Selector de Días Semanales */}
        <div className="flex items-center justify-between gap-space-xs overflow-x-auto pb-space-sm mb-space-md">
          {DAYS_MOCK.map((day) => {
            const isDaySelected = selectedDay === day.fullDate;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.fullDate)}
                className={`day-slot flex flex-col items-center justify-center min-w-[70px] py-space-sm rounded-lg transition-colors cursor-pointer ${
                  isDaySelected
                    ? 'bg-inverse-surface text-inverse-on-surface shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
                type="button"
              >
                <span className="font-label-sm text-label-sm uppercase">{day.label}</span>
                <span className="font-title-lg text-title-lg font-bold">{day.date}</span>
                <span
                  className={`font-label-sm text-label-sm ${
                    isDaySelected ? 'text-tertiary-fixed' : 'text-secondary'
                  }`}
                >
                  {day.slots}
                </span>
              </button>
            );
          })}
        </div>

        {/* Franjas Horarias Disponibles */}
        <span className="font-label-sm text-label-sm uppercase text-outline block mb-space-xs">
          Franjas de Atención Directa
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm" id="time-slots">
          {TIME_SLOTS_MOCK.map((time) => {
            const isTimeSelected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`time-btn py-space-sm px-space-md rounded-lg font-label-md text-label-md text-center transition-colors cursor-pointer ${
                  isTimeSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
                type="button"
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {/* Paso 3: Cuestionario de Briefing Previo */}
      <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center gap-space-md mb-space-md">
          <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-title-md text-title-md flex items-center justify-center font-bold">
            3
          </span>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Cuestionario de Briefing Previo
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Proporcione contexto preliminar a su archivista antes del encuentro
            </p>
          </div>
        </div>

        <div className="space-y-space-md">
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1">
              Objetivo primordial de esta sesión
            </label>
            <input
              value={briefing.goal}
              onChange={(e) => setBriefing({ ...briefing, goal: e.target.value })}
              className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Ej: Renovar vestuario laboral tras cambio de puesto, boda en Lago de Como..."
              type="text"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1">
              Prendas o prendas complejas de su archivo a resolver
            </label>
            <input
              value={briefing.garments}
              onChange={(e) => setBriefing({ ...briefing, garments: e.target.value })}
              className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Ej: Abrigo Max Mara color camel, stilettos bicolor sin usar..."
              type="text"
            />
          </div>

          {/* Dropzone Inspiración */}
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1">
              Moodboard o capturas de inspiración (Opcional)
            </label>
            <div
              onClick={() => alert('Selector de archivos multimedia / moodboard abierto.')}
              className="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-center hover:bg-surface-container transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[32px] mb-1">
                cloud_upload
              </span>
              <p className="font-body-sm text-body-sm text-on-surface font-medium">
                Arrastre capturas de pantalla, enlaces de Pinterest o fotografías
              </p>
              <span className="font-label-sm text-label-sm text-outline mt-0.5">
                PNG, JPG o PDF de hasta 25MB
              </span>
            </div>
          </div>

          {/* Casilla de autorización */}
          <label className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low cursor-pointer">
            <input
              checked={briefing.authorized}
              onChange={(e) => setBriefing({ ...briefing, authorized: e.target.checked })}
              className="mt-1 accent-primary"
              type="checkbox"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Autorizo a mi estilista asignado a acceder al inventario digitalizado de mis prendas en{' '}
              <strong className="text-on-surface font-medium">Vestiaire Studio</strong> durante los
              7 días previos y posteriores a la cita.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
