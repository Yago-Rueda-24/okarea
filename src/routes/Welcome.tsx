import { Link } from 'react-router-dom';
import secBolsos from '../assets/sections/bolsos.png';
import secCalzado from '../assets/sections/calzado.png';
import secRopa from '../assets/sections/ropa.png';
import secAccesorios from '../assets/sections/accesorios.png';
import fondoPantalla from '../assets/fondo5.jpeg';

const galleryItems = [
  { images: [secBolsos], title: "Bolsos", description: "Bolsos", path: "/bolsos" },
  { images: [secCalzado], title: "Calzado", description: "Calzado", path: "/calzado" },
  { images: [secRopa], title: "Ropa", description: "Ropa", path: "/ropa" },
  { images: [secAccesorios], title: "Accesorios", description: "Accesorios", path: "/accesorios" }
];

export default function Welcome() {
  return (
    <div className="min-h-screen bg-surface font-sans text-text-main">
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        <div className="w-full h-full overflow-hidden">
          <img
            src={fondoPantalla}
            alt="Fondo de pantalla"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-black/10">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-[0.25em] text-[#FFDFCA] drop-shadow-2xl leading-none -mt-100">
            OK
            <br />
            AREA
          </h1>
        </div>
      </section>

      <div className="w-full py-16 px-6 text-center bg-[#FAA18F]  text-3xl md:text-5xl font-bold tracking-wide text-[#FFDFCA]">
        Life is to short to wear boring clothes
      </div>
      {/* Image Gallery Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
          {galleryItems.map((item, index) => (
            <Link 
              key={index} 
              to={item.path}
              className="relative h-64 sm:h-80 md:h-[30rem] lg:h-[35rem] overflow-hidden cursor-pointer group block"
            >
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white font-semibold text-xl tracking-wider uppercase">{item.description}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
