import { Link } from 'react-router-dom';

export default function WelcomeHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-20 w-full px-gutter lg:px-margin flex items-center justify-between">
        <Link to="/welcome" className="flex items-center gap-space-sm">
          <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
            Vestiaire Studio
          </span>
        </Link>

        <div className="flex items-center gap-space-lg">
          <Link
            to="/login"
            className="hidden sm:inline-block font-label-md text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Acceso
          </Link>
          <Link
            to="/login?mode=register"
            className="inline-flex items-center justify-center px-space-md py-space-sm rounded-lg bg-inverse-surface hover:bg-primary text-inverse-on-surface hover:text-on-primary transition-all font-label-md text-label-md tracking-wider uppercase shadow-[0_4px_20px_-2px_rgba(28,25,23,0.04)] cursor-pointer"
          >
            Registro
          </Link>
          <Link
            to="/login"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container transition-colors"
            title="Acceso de Socios"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
