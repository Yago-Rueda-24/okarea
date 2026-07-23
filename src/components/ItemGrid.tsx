import { Link } from 'react-router-dom';

export interface GridItem {
  src: string;
  title?: string;
  price?: string;
  fabricante?: string;
  link?: string;
}

interface ItemGridProps {
  title: string;
  items: GridItem[];
}

export default function ItemGrid({ title, items }: ItemGridProps) {
  return (
    <div className="pt-32 pb-20 px-6 md:px-12 w-full font-sans">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-widest text-[#faa18F] uppercase">
          {title}
        </h2>
        <div className="w-16 h-[2px] bg-current mx-auto mt-6 opacity-60"></div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
        {items.map((item, index) => (
          <Link key={index} to={item.link || "/producto"} className="group cursor-pointer flex flex-col">
            {/* Image Container with Hover Overlay */}
            <div className="relative overflow-hidden aspect-[3/4] bg-neutral-100 rounded-lg shadow-sm">
              <img
                src={item.src}
                alt={item.title || `Product ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:blur-sm group-hover:brightness-90"
              />

              {/* Darkened & Blurred Overlay with Information */}
              <div className="absolute inset-0 bg-black/45 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-6 text-center text-white">
                {item.fabricante && (
                  <p className="text-xl uppercase tracking-widest text-[#faa18F] font-semibold mt-1 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.fabricante}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
