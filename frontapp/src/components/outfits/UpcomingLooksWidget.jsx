import { UPCOMING_LOOKS_MOCK } from '../../mocks/outfitsData';

export default function UpcomingLooksWidget() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-title-md text-title-md text-on-surface flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[18px] text-primary">
            calendar_view_week
          </span>
          <span>Próximos Looks Planificados</span>
        </span>
        <button
          onClick={() => alert('Abriendo vista de calendario mensual completo...')}
          className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
          type="button"
        >
          Ver mes completo
        </button>
      </div>

      <div className="flex flex-col gap-space-xs pt-1">
        {UPCOMING_LOOKS_MOCK.map((look) => (
          <div
            key={look.id}
            className="flex items-center justify-between p-space-xs rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex flex-col items-center justify-center text-center">
                <span className="font-label-sm text-[10px] uppercase text-outline">
                  {look.day}
                </span>
                <span className="font-title-md text-label-md text-on-surface font-bold leading-none">
                  {look.date}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-body-sm text-on-surface">{look.event}</span>
                <span className="font-body-sm text-body-sm text-outline">{look.outfit}</span>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] ${
                look.completed ? 'text-outline' : 'text-primary'
              }`}
            >
              {look.completed ? 'check_circle' : 'schedule'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
