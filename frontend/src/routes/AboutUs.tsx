import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FEEBE7] text-[#faa18f] font-fraunces flex flex-col justify-between px-6 pt-32 pb-16 relative overflow-hidden">

      {/* Decorative background element */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#faa18f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#faa18f]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto my-auto text-center flex flex-col items-center justify-center relative z-10 px-4">

        {/* Brand Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#faa18f]/30 bg-[#faa18f]/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#faa18f] animate-ping" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium">OKAREA</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-[0.15em] mb-10 leading-tight">
          Sobre Nosotros
        </h1>

        {/* Quote / Statement Card */}
        <div className="relative p-8 md:p-14 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#faa18f]/20 shadow-sm max-w-2xl mx-auto transition-all duration-300 hover:shadow-md">
          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-[#faa18f]/30 absolute top-4 left-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed tracking-wide italic text-[#faa18f] relative z-10 py-4">
            "Esto solo va de entretener, pasar el rato y si algo llama un poco más tu atención, puedes encontrar cómo llegar hasta ello. Nada más que eso. No hay más que aportar"
          </p>

          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-[#faa18f]/30 absolute bottom-4 right-4 rotate-180"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quick Navigation Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="px-8 py-3.5 border-2 border-[#faa18f] text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-[#faa18f] hover:text-[#FEEBE7] active:scale-95"
          >
            Volver a Inicio
          </Link>
          <Link
            to="/bolsos"
            className="px-8 py-3.5 bg-[#faa18f] text-[#FEEBE7] text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:opacity-90 active:scale-95"
          >
            Explorar Colección
          </Link>
        </div>

      </div>

      {/* Footer Branding Note */}
      <div className="text-center pt-12 relative z-10">
        <p className="text-xs uppercase tracking-widest opacity-60">
          OKAREA &copy; {new Date().getFullYear()}
        </p>
      </div>

    </div>
  );
}
