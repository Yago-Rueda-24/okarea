import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import fondoPantalla from '../assets/fondo_pantalla.jpg';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-surface font-sans text-text-main">
      {/* Hero Section */}
      <section className="w-full h-screen relative">
        <div className="w-full h-full overflow-hidden shadow-2xl">
          <img
            src={fondoPantalla}
            alt="Fondo de pantalla"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-4 right-6 md:bottom-8 md:right-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#6b8ba4] drop-shadow-md">
            Okarea
          </h1>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-[#6b8ba4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={img1} alt="Modern Workspace 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">Luminous Spaces</h3>
                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={img2} alt="Modern Workspace 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">Modern Architecture</h3>
                </div>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl shadow-lg cursor-pointer">
              <div className="relative h-64 overflow-hidden">
                <img src={img3} alt="Modern Workspace 3" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">Minimalist Setup</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
