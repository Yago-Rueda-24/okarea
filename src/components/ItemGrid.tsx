export interface GridItem {
  src: string;
  title?: string;
  price?: string;
}

interface ItemGridProps {
  title: string;
  items: GridItem[];
}

export default function ItemGrid({ title, items }: ItemGridProps) {
  return (
    <div className="pt-32 pb-20 px-6 sm:px-8 max-w-7xl mx-auto font-sans">
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
          <div key={index} className="group cursor-pointer flex flex-col">
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[3/4] bg-neutral-100 mb-4 rounded-none">
              <img
                src={item.src}
                alt={item.title || `Product ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            
            {/* Item Details */}
            {item.title && (
              <h3 className="text-sm font-semibold tracking-wider text-[#faa18F] uppercase mt-1">
                {item.title}
              </h3>
            )}
            {item.price && (
              <p className="text-sm opacity-70 font-medium mt-1 text-[#faa18F]">
                {item.price}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
