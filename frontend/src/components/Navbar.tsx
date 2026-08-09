import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isModaOpen, setIsModaOpen] = useState(true);
  const location = useLocation();

  // Show category quick links on desktop when on fashion-related pages
  const fashionPaths = ['/bolsos', '/calzado', '/ropa', '/accesorios', '/tiendas', '/artesanos', '/articulos', '/producto', '/product-info'];
  const isFashionPage = fashionPaths.some(path => location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#FEEBE7] text-[#faa18f] font-fraunces">
      <div className="w-full px-6 md:px-12 h-20 flex justify-between items-center font-medium">

        {/* Left Side: Hamburger Button & OKAREA Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="p-2 -ml-2 text-[#faa18f] transition-transform active:scale-95 cursor-pointer focus:outline-none hover:opacity-80"
            aria-label="Toggle Navigation Menu"
          >
            {isNavOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
          <Link
            to="/"
            className="text-2xl md:text-3xl font-semibold tracking-widest text-[#faa18f] uppercase transition-opacity duration-300 hover:opacity-80 leading-none"
          >
            <div className="flex flex-col justify-center items-center text-center">
              <span>OK</span>
              <span className="-mt-1">AREA</span>
            </div>
          </Link>
        </div>

        {/* Center Column: Desktop Fashion Quick Links */}
        {isFashionPage && (
          <div className="hidden md:flex justify-center items-center space-x-3 md:space-x-6 lg:space-x-8 font-medium">
            <Link
              to="/bolsos"
              className="relative py-2 text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Bolsos
            </Link>
            <Link
              to="/calzado"
              className="relative py-2 text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Calzado
            </Link>
            <Link
              to="/ropa"
              className="relative py-2 text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Ropa
            </Link>
            <Link
              to="/accesorios"
              className="relative py-2 text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Accesorios
            </Link>
            <Link
              to="/tiendas"
              className="relative py-2 text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Tiendas
            </Link>
            <Link
              to="/artesanos"
              className="relative py-2 text-sm md:text-base lg:text-lg uppercase tracking-widest transition-all duration-300 hover:opacity-80 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-current hover:after:w-full after:transition-all after:duration-300"
            >
              Artesanos
            </Link>
          </div>
        )}

        {/* Right Column: About Link & Instagram */}
        <div className="flex justify-end items-center space-x-3 sm:space-x-4 md:space-x-6">
          <Link
            to="/"
            onClick={() => {
              setTimeout(() => {
                document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="text-xs sm:text-sm uppercase tracking-widest text-[#faa18f] hover:opacity-80 transition-all font-medium pr-1"
          >
            About
          </Link>
          <a
            href="https://www.instagram.com/inspo_area/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 transition-transform duration-300 hover:scale-110 text-[#faa18f] hover:opacity-80"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 md:w-6 md:h-6"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>

      </div>

      {/* Left Side Drawer Menu & Backdrop */}
      <div
        onClick={() => setIsNavOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 md:w-96 bg-[#faa18f] text-[#FEEBE7] z-50 shadow-2xl p-8 flex flex-col space-y-8 font-fraunces border-r border-[#FEEBE7]/20 transition-transform duration-300 ease-in-out ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside drawer */}
        <div className="flex justify-between items-center pb-6 border-b border-[#FEEBE7]/20">
          <Link
            to="/"
            onClick={() => setIsNavOpen(false)}
            className="text-2xl font-semibold tracking-widest uppercase transition-opacity hover:opacity-80 leading-none"
          >
            <div className="flex flex-col justify-center items-center text-center">
              <span>OK</span>
              <span className="-mt-1">AREA</span>
            </div>
          </Link>
          <button
            onClick={() => setIsNavOpen(false)}
            className="p-2 -mr-2 text-[#FEEBE7] transition-transform active:scale-95 cursor-pointer focus:outline-none hover:opacity-80"
            aria-label="Close Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-7 sm:h-7">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Vertical Navigation Destinations List */}
        <div className="flex flex-col space-y-6 pt-2 font-medium">
          {/* 1. MODA (Con subcategorías) */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => setIsModaOpen(!isModaOpen)}
              className="flex justify-between items-center w-full text-2xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 transition-all text-left focus:outline-none cursor-pointer"
            >
              <span>Moda</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-300 ${isModaOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Subcategorías de Moda */}
            {isModaOpen && (
              <div className="flex flex-col space-y-3 pl-4 border-l-2 border-[#FEEBE7]/30 transition-all animate-slideDown">
                <Link
                  to="/bolsos"
                  onClick={() => setIsNavOpen(false)}
                  className="text-lg uppercase tracking-widest text-[#FEEBE7]/90 hover:text-[#FEEBE7] hover:translate-x-2 transition-all"
                >
                  Bolsos
                </Link>
                <Link
                  to="/calzado"
                  onClick={() => setIsNavOpen(false)}
                  className="text-lg uppercase tracking-widest text-[#FEEBE7]/90 hover:text-[#FEEBE7] hover:translate-x-2 transition-all"
                >
                  Calzado
                </Link>
                <Link
                  to="/ropa"
                  onClick={() => setIsNavOpen(false)}
                  className="text-lg uppercase tracking-widest text-[#FEEBE7]/90 hover:text-[#FEEBE7] hover:translate-x-2 transition-all"
                >
                  Ropa
                </Link>
                <Link
                  to="/accesorios"
                  onClick={() => setIsNavOpen(false)}
                  className="text-lg uppercase tracking-widest text-[#FEEBE7]/90 hover:text-[#FEEBE7] hover:translate-x-2 transition-all"
                >
                  Accesorios
                </Link>
                <Link
                  to="/tiendas"
                  onClick={() => setIsNavOpen(false)}
                  className="text-lg uppercase tracking-widest text-[#FEEBE7]/90 hover:text-[#FEEBE7] hover:translate-x-2 transition-all"
                >
                  Tiendas
                </Link>
                <Link
                  to="/artesanos"
                  onClick={() => setIsNavOpen(false)}
                  className="text-lg uppercase tracking-widest text-[#FEEBE7]/90 hover:text-[#FEEBE7] hover:translate-x-2 transition-all"
                >
                  Artesanos
                </Link>
              </div>
            )}
          </div>

          {/* 2. EVENTOS */}
          <Link
            to="/eventos"
            onClick={() => setIsNavOpen(false)}
            className="text-2xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 hover:translate-x-2 transition-all"
          >
            Eventos
          </Link>

          {/* 3. LUGARES */}
          <Link
            to="/lugares"
            onClick={() => setIsNavOpen(false)}
            className="text-2xl uppercase tracking-widest text-[#FEEBE7] hover:opacity-80 hover:translate-x-2 transition-all"
          >
            Lugares
          </Link>
        </div>
      </div>
    </nav>
  );
}
