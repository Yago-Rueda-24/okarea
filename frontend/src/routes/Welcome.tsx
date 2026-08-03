import { useState } from 'react';
import { Link } from 'react-router-dom';
import secBolsos from '../assets/welcome/sections/bolsos2.png';
import secCalzado from '../assets/welcome/sections/calzado.png';
import secRopa from '../assets/welcome/sections/ropa2.png';
import secAccesorios from '../assets/welcome/sections/accesorios2.png';
import fondoWeb from '../assets/welcome/fondoweb.png';
import fondoPantalla from '../assets/welcome/fondomovil.jpeg';
import imgEvento from '../assets/welcome/evento.png';
import imgLugares from '../assets/welcome/lugares.png';

export default function Welcome() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isModaOpen, setIsModaOpen] = useState(true);

  return (
    <div className="min-h-screen bg-surface font-fraunces text-text-main">
      {/* Floating Welcome Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-transparent text-[#FEEBE7] font-fraunces">
        <div className="w-full px-6 md:px-12 h-20 flex justify-between items-center font-medium">
          {/* Left Side: Hamburger Button & Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 -ml-2 text-current transition-transform active:scale-95 cursor-pointer focus:outline-none"
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
              className="text-2xl md:text-3xl font-semibold tracking-widest uppercase transition-opacity duration-300 hover:opacity-80 text-current leading-none"
            >
              <div className="flex flex-col justify-center items-center text-center">
                <span>OK</span>
                <span className="-mt-1">AREA</span>
              </div>
            </Link>
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex justify-end items-center space-x-3 md:space-x-4">
            <a
              href="https://www.instagram.com/inspo_area/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
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
            <a
              href="https://vinted.es"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 transition-transform duration-300 hover:scale-110 text-current hover:opacity-80"
              aria-label="Vinted"
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
                <path d="M11.028 6c0 7.695 -.292 11.728 0 12c2.046 -5 4.246 -12.642 5.252 -14.099c.343 -.497 .768 -.93 1.257 -1.277c.603 -.39 1.292 -.76 1.463 -.575c-.07 2.319 -4.023 15.822 -4.209 16.314a6.135 6.135 0 0 1 -3.465 3.386c-3.213 .78 -3.429 -.446 -3.836 -1.134c-.95 -2.103 -1.682 -14.26 -1.445 -15.615c.05 -.523 .143 -1.851 2.491 -2c2.359 -.354 2.547 1.404 2.492 3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Left Side Drawer Menu & Backdrop */}
        <div
          onClick={() => setIsNavOpen(false)}
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 ${isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        />

        <div
          className={`fixed top-0 left-0 h-full w-72 sm:w-80 md:w-96 bg-[#faa18f] text-[#FEEBE7] z-50 shadow-2xl p-8 flex flex-col space-y-8 font-fraunces border-r border-[#FEEBE7]/20 transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'
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
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        <div className="w-full h-full overflow-hidden">
          <picture>
            <source media="(min-width: 768px)" srcSet={fondoWeb} />
            <img
              src={fondoPantalla}
              alt="Fondo de pantalla"
              className="w-full h-full object-cover"
            />
          </picture>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6 bg-black/10">
          <h1 className="font-fraunces italic text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-light uppercase tracking-wider sm:tracking-[0.2em] md:tracking-[0.25em] text-[#FAA18F] drop-shadow-2xl leading-none -mt-40 sm:-mt-60 md:-mt-80 max-w-full">
            {new Date().toLocaleDateString("es-ES", { day: 'numeric', month: '2-digit', year: '2-digit' }).replace("/", "’").replace("/", "’")}
          </h1>
        </div>
      </section>

      <div className="w-full py-16 px-6 text-center bg-[#FAA18F]  text-3xl md:text-5xl font-bold tracking-wide text-[#FFDFCA]">
        Life is too short to wear boring clothes
      </div>
      {/* Image Gallery Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
          {/* Bolsos */}
          <Link
            to="/bolsos"
            className="relative h-64 sm:h-80 md:h-[30rem] lg:h-[35rem] overflow-hidden cursor-pointer group block"
          >
            <img
              src={secBolsos}
              alt="Bolsos"
              className="w-full h-full object-cover object-[50%_80%] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-semibold text-xl tracking-wider uppercase">Bolsos</h3>
            </div>
          </Link>

          {/* Calzado */}
          <Link
            to="/calzado"
            className="relative h-64 sm:h-80 md:h-[30rem] lg:h-[35rem] overflow-hidden cursor-pointer group block"
          >
            <img
              src={secCalzado}
              alt="Calzado"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-semibold text-xl tracking-wider uppercase">Calzado</h3>
            </div>
          </Link>

          {/* Ropa */}
          <Link
            to="/ropa"
            className="relative h-64 sm:h-80 md:h-[30rem] lg:h-[35rem] overflow-hidden cursor-pointer group block"
          >
            <img
              src={secRopa}
              alt="Ropa"
              className="w-full h-full object-cover object-[50%_10%] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-semibold text-xl tracking-wider uppercase">Ropa</h3>
            </div>
          </Link>

          {/* Accesorios */}
          <Link
            to="/accesorios"
            className="relative h-64 sm:h-80 md:h-[30rem] lg:h-[35rem] overflow-hidden cursor-pointer group block"
          >
            <img
              src={secAccesorios}
              alt="Accesorios"
              className="w-full h-full object-cover object-[30%_10%] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h3 className="text-white font-semibold text-xl tracking-wider uppercase">Accesorios</h3>
            </div>
          </Link>
        </div>
      </section>
      <div className="w-full py-16 px-6 text-center bg-[#FAA18F]  text-3xl md:text-5xl font-bold tracking-wide text-[#FFDFCA]">
        Find your next experience
      </div>

      {/* Event Section */}
      <section id="eventos" className="w-full relative h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden scroll-mt-20">
        <Link to="/eventos" className="block w-full h-full group relative">
          <img
            src={imgEvento}
            alt="Evento OkArea"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-10">
            <h3 className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase">Eventos</h3>
          </div>
        </Link>
      </section>

      <div className="w-full py-16 px-6 text-center bg-[#FAA18F]  text-3xl md:text-5xl font-bold tracking-wide text-[#FFDFCA]">
        Go where beauty lives
      </div>

      {/* Lugares Section */}
      <section id="lugares" className="w-full relative h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden scroll-mt-20">
        <Link to="/lugares" className="block w-full h-full group relative">
          <img
            src={imgLugares}
            alt="Lugares OkArea"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-10">
            <h3 className="text-white font-semibold text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase">Lugares</h3>
          </div>
        </Link>
      </section>

    </div>
  );
}
