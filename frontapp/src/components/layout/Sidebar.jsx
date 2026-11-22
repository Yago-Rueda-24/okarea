import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Sidebar() {
  const { user } = useAuth();

  const getNavClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-all bg-surface-container-lowest text-primary font-title-md shadow-[0_2px_8px_rgba(28,25,23,0.04)]'
      : 'flex items-center gap-space-md px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-body-md text-body-md';

  const tierName =
    user?.role === 'admin'
      ? 'Archive Director'
      : user?.role === 'estilista'
        ? 'Styling Atelier'
        : 'Maison Privée';

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
      </div>

    </aside>
  );
}
