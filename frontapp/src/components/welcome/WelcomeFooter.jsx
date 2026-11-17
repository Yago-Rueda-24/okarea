import { Link } from 'react-router-dom';

export default function WelcomeFooter() {
  return (
    <footer className="w-full bg-surface-container-low mt-space-xl py-space-xl">
      <div className="w-full px-gutter lg:px-margin">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-space-lg pb-space-lg">
          <div className="flex flex-col gap-space-xs">
            <span className="font-headline-md text-headline-md text-on-surface">
              Vestiaire Studio
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Atelier de archivo y estilismo privado para colecciones personales de alto valor y
              vestidores contemporáneos.
            </p>
          </div>
        </div>

        <div className="pt-space-lg flex flex-col sm:flex-row justify-between items-center gap-space-sm font-body-sm text-body-sm text-outline border-t border-surface-container-highest/60">
          <p>© 2025 Vestiaire Studio. Todos los derechos reservados. Madrid — París.</p>
          <div className="flex gap-space-lg font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            <a href="#privacy" className="hover:text-on-surface transition-colors">
              Privacidad
            </a>
            <a href="#terms" className="hover:text-on-surface transition-colors">
              Términos
            </a>
            <a href="#contact" className="hover:text-on-surface transition-colors">
              Contacto Atelier
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
