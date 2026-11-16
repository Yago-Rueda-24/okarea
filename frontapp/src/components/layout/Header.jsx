import { Link } from 'react-router-dom';

export default function Header({ onOpenNewPrenda, searchTerm, setSearchTerm }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-surface/90 backdrop-blur-xl z-50 shadow-[0_1px_8px_rgba(28,25,23,0.04)]">
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-gutter">
        {/* Brand / Logo */}
        <div className="flex items-center gap-space-lg">
          <Link to="/prendas" className="flex items-center gap-space-sm group">
            <img
              alt="Vestiaire Studio Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjDu8Gqp35JVlf2Oi2DDtDg_dhgMT-oJOTdoAx-aV6sDZX86QP5A7dg80GhlfBukp_BsXJcbbngXF0riWzECRT6PFlqHS3zHccNvziEnjjkV1LGs8de4x_ICDGmvQc99CHpANFj7iU9AP5QFA7k11ZX4Q0xxK_g_NhxWDTBXyL3ZmUeCDql5lzOw1_IfRhEejep5V3dcat7uVTq8owXmrocAfydv9LQg30lszqTvM"
            />
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-normal">
              Vestiaire <span className="italic font-normal text-primary">Studio</span>
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">
              search
            </span>
            <input
              className="w-full pl-10 pr-space-md py-space-sm bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_2px_6px_-1px_rgba(28,25,23,0.02)] transition-all"
              placeholder="Buscar por prenda, tejido, diseñador o look..."
              type="text"
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm && setSearchTerm('')}
                className="absolute right-3 text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-space-md">
          <button
            onClick={onOpenNewPrenda}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_4px_20px_-2px_rgba(28,25,23,0.08)] cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Añadir Prenda / Crear Look</span>
          </button>

          <button
            aria-label="Notificaciones"
            className="p-space-sm rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
          </button>

          <div className="flex items-center pl-space-xs">
            <Link
              to="/perfil"
              className="flex items-center gap-space-xs p-0.5 rounded-full hover:ring-2 hover:ring-outline-variant transition-all"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgJhknyU28ZaK1BqvomN2D59Vr5e5vhGEShJkfMcWey7BuEBwwy0K25ka-y-P5HSSCUMexx21DPMke3Pw8j32-1AieO1e8gey43ZZCBnWegEK2NtOxYNr5DZx_79KBkZt1Lag6-hNFYnbHK1haC1oMzGDphLn4lGzLHFa3LDMQSPeJfaMvIH7qN3glgDgBY214w_qoPV_L65wjBURKeHZ4ZGO-HafFksCFkIzzWuU"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
