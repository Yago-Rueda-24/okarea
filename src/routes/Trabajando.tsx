import { Link } from 'react-router-dom';

export default function Trabajando() {
  return (
    <div className="min-h-screen bg-[#FEEBE7] text-[#faa18f] font-sans flex flex-col justify-center items-center text-center px-6 pt-32 pb-20">
      
      {/* Visual Indicator or Icon */}
      <div className="w-16 h-16 mb-8 rounded-full border-2 border-[#faa18f]/20 flex items-center justify-center animate-pulse">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] leading-tight mb-4">
        Estamos
        <br className="sm:hidden" />
        <span className="sm:ml-4">trabajando</span>
        <br />
        en ello
      </h1>

      {/* Description */}
      <p className="text-sm md:text-base uppercase tracking-widest opacity-80 max-w-md mx-auto mb-12 font-medium">
        Esta sección de OKAREA estará disponible muy pronto con una selección exclusiva para ti.
      </p>

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="px-8 py-3.5 border-2 border-[#faa18f] text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-[#faa18f] hover:text-[#FEEBE7] active:scale-95 rounded-none"
      >
        Volver a Inicio
      </Link>

    </div>
  );
}
