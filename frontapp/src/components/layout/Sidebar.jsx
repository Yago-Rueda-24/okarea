import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const getNavClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all bg-surface-container-lowest text-primary font-title-md shadow-[0_2px_8px_rgba(28,25,23,0.04)]'
      : 'flex items-center gap-space-md px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-body-md text-body-md';

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-surface-container-low z-40 flex flex-col justify-between py-space-lg shadow-[0_1px_8px_rgba(28,25,23,0.03)]">
      <div className="flex flex-col gap-space-lg px-space-md">
        {/* Section 1: Atelier Curation */}
        <div>
          <div className="px-space-md pb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Atelier Curation
            </span>
          </div>
          <nav className="flex flex-col gap-space-xs">
            <NavLink to="/prendas" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px]">styler</span>
              <span>Prendas</span>
            </NavLink>
            <NavLink to="/outfits" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px]">auto_awesome_motion</span>
              <span>Outfits</span>
            </NavLink>
            <NavLink to="/asesoria-vip" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px]">diamond</span>
              <span>Asesoría VIP</span>
            </NavLink>
          </nav>
        </div>

        {/* Section 2: Espacio Creativo */}
        <div>
          <div className="pt-space-md px-space-md pb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
              Espacio Creativo
            </span>
          </div>
          <nav className="flex flex-col gap-space-xs">
            <NavLink to="/moodboards" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px]">dashboard_customize</span>
              <span>Moodboards</span>
            </NavLink>
            <NavLink to="/maleta-capsula" className={getNavClass}>
              <span className="material-symbols-outlined text-[20px]">luggage</span>
              <span>Cápsula &amp; Viaje</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Storage / Tier Capacity Widget */}
      <div className="px-space-md pt-space-lg">
        <div className="p-space-md rounded-xl bg-surface-container-high/60 flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Armario Digital
            </span>
            <span className="font-label-sm text-label-sm text-primary font-semibold">
              84 / 150
            </span>
          </div>
          <div className="w-full h-1 bg-outline-variant/50 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[56%]"></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant pt-space-xs">
            Archive tier: Maison Privée
          </span>
        </div>
      </div>
    </aside>
  );
}
