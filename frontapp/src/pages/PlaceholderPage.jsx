import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, description, icon }) {
  return (
    <div className="relative w-full px-gutter lg:px-margin pt-space-lg pb-space-xl overflow-hidden min-h-[70vh] flex flex-col justify-center items-center text-center">
      <div className="absolute top-12 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-space-md shadow-xs">
          <span className="material-symbols-outlined text-[32px]">{icon || 'hourglass_empty'}</span>
        </div>

        <span className="font-label-sm text-primary uppercase tracking-widest font-semibold mb-1">
          Vestiaire Studio • Próximamente
        </span>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
          {title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
          {description ||
            'Esta sección está lista para recibir su diseño editorial y funcionalidades en las siguientes iteraciones.'}
        </p>

        <Link
          to="/prendas"
          className="inline-flex items-center gap-space-xs px-space-md py-space-sm bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md rounded-lg transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Volver a Mi Armario (Prendas)</span>
        </Link>
      </div>
    </div>
  );
}
