import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Compass, Calendar, Footprints, Sparkles } from 'lucide-react';

export default function NotFound() {
  const quickLinks = [
    { label: 'Colección Bolsos', path: '/bolsos', icon: ShoppingBag },
    { label: 'Colección Calzado', path: '/calzado', icon: Footprints },
    { label: 'Colección Ropa', path: '/ropa', icon: Sparkles },
    { label: 'Eventos OkArea', path: '/eventos', icon: Calendar },
    { label: 'Lugares Destacados', path: '/lugares', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-[#FEEBE7] text-[#5A3832] font-sans flex flex-col justify-center items-center text-center px-6 pt-28 pb-20 relative overflow-hidden">
      
      {/* Background Subtle Geometric Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[40px] border-[#faa18f]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border-[40px] border-[#faa18f]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        
        {/* 404 Badge */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#faa18f]/40 bg-[#faa18f]/10 text-[#faa18f] text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Error 404
        </div>

        {/* Giant 404 Text */}
        <h1 className="text-7xl sm:text-9xl font-black text-[#faa18f] tracking-tighter leading-none mb-2 select-none">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.15em] text-[#422521] mb-4">
          Página no encontrada
        </h2>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-base text-[#6B4B45] max-w-md mx-auto mb-10 leading-relaxed font-medium">
          La prenda, colección o sección que estás buscando no existe o se ha movido de lugar. 
          Explora nuestras colecciones principales o regresa al inicio.
        </p>

        {/* Back to Home CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#faa18f] text-[#FEEBE7] text-xs sm:text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-[#e28a78] active:scale-95 shadow-lg shadow-[#faa18f]/30 mb-14"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Inicio
        </Link>

        {/* Quick Links Suggestions */}
        <div className="w-full pt-8 border-t border-[#faa18f]/30">
          <p className="text-xs uppercase tracking-widest font-bold text-[#8C625B] mb-5">
            ¿Buscabas algo en particular?
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2.5 bg-white/70 hover:bg-white text-[#422521] text-xs font-bold uppercase tracking-wider rounded-xl border border-[#faa18f]/30 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  <Icon className="w-3.5 h-3.5 text-[#faa18f]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
