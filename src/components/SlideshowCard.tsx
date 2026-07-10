import { useState, useEffect } from 'react';

interface SlideshowCardProps {
  images: string[];
  title: string;
  description: string;
}

export default function SlideshowCard({ images, title, description }: SlideshowCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative h-64 overflow-hidden border-2 border-white shadow-lg cursor-pointer rounded-none">
      {images.map((imgSrc, idx) => (
        <img
          key={imgSrc}
          src={imgSrc}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 z-20">
        <h3 className="text-white font-semibold text-xl">{description}</h3>
      </div>
    </div>
  );
}
