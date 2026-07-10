import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import fondoPantalla from '../assets/fondo3.jpeg';
import fondo2 from '../assets/fondo2.jpeg';
import fondoPantallaOld from '../assets/fondo_pantalla.jpg';
import SlideshowCard from '../components/SlideshowCard';

const galleryItems = [
  { images: [img1, img2, img3], title: "Luminous Spaces", description: "Luminous Spaces" },
  { images: [img2, img3, img1], title: "Modern Architecture", description: "Modern Architecture" },
  { images: [img3, img1, img2], title: "Minimalist Setup", description: "Minimalist Setup" },
  { images: [fondo2, fondoPantallaOld, img1], title: "Creative Area", description: "Creative Area" },
  { images: [fondoPantallaOld, img1, fondo2], title: "Focus Zone", description: "Focus Zone" },
  { images: [img1, fondo2, fondoPantallaOld], title: "Collaborative Space", description: "Collaborative Space" },
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
        <div className="absolute bottom-4 right-6 md:bottom-8 md:right-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#6b8ba4] drop-shadow-md">
            Okarea
          </h1>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-[#aba49e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <SlideshowCard
                key={index}
                images={item.images}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
