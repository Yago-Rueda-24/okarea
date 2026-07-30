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
  return (
    <div className="min-h-screen bg-surface font-fraunces text-text-main">
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
          <h1 className="font-fraunces italic text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-light uppercase tracking-wider sm:tracking-[0.2em] md:tracking-[0.25em] text-[#FFDFCA] drop-shadow-2xl leading-none -mt-40 sm:-mt-60 md:-mt-80 max-w-full">
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
      <section className="w-full relative h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
        <img
          src={imgEvento}
          alt="Evento OkArea"
          className="w-full h-full object-cover object-center"
        />
      </section>

      <div className="w-full py-16 px-6 text-center bg-[#FAA18F]  text-3xl md:text-5xl font-bold tracking-wide text-[#FFDFCA]">
        Go where beauty lives
      </div>

      {/* Lugares Section */}
      <section className="w-full relative h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden">
        <img
          src={imgLugares}
          alt="Lugares OkArea"
          className="w-full h-full object-cover object-center"
        />
      </section>

    </div>
  );
}
