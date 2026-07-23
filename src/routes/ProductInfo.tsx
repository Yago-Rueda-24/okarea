import { Link } from 'react-router-dom';
import ropa1 from '../assets/ropa/ropa1.png';

export interface ProductDetails {
  id?: string;
  nombre: string;
  descripcion: string;
  tienda: string;
  temporada: string;
  precio: string;
  enlaceSitio: string;
  imagen: string;
}

const defaultProduct: ProductDetails = {
  nombre: 'Camisa Lino Premium',
  descripcion: 'Confeccionada en 100% lino orgánico de alta calidad, esta camisa ofrece una frescura excepcional y una caída fluida. Ideal para días cálidos con un estilo elegante, relajado y atemporal. Presenta cuello italiano, botones de nácar y un diseño versátil.',
  tienda: 'OKAREA Studio',
  temporada: 'Primavera / Verano 2026',
  precio: '49,90 €',
  enlaceSitio: 'https://example.com/producto/camisa-lino',
  imagen: ropa1,
};

interface ProductInfoProps {
  product?: ProductDetails;
}

export default function ProductInfo({ product = defaultProduct }: ProductInfoProps) {
  return (
    <div className="min-h-screen bg-[#FEEBE7] font-sans text-[#654321] pt-28 pb-16 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        {/* Navigation / Back link */}
        <div className="mb-6">
          <Link
            to="/bolsos"
            className="inline-flex items-center text-sm font-medium text-[#654321]/70 hover:text-[#faa18F] transition-colors gap-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver a productos
          </Link>
        </div>

        {/* Main Product Container */}
        <div className="bg-[#8db1cd] backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/40 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center text-[#FFDFCA]">

          {/* Left Column: Product Photo */}
          <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-100 shadow-md">
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Right Column: Product Information */}
          <div className="flex flex-col justify-center">
            {/* Tienda (Store / Brand) */}
            <div className="mb-3">
              <span className="inline-block bg-[#FFDFCA]/15 text-[#FFDFCA] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#FFDFCA]/30">
                {product.tienda}
              </span>
            </div>

            {/* Nombre (Product Name) */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFDFCA] tracking-tight mb-2">
              {product.nombre}
            </h1>

            {/* Descripción (Description) */}
            <div className="mb-8 border-t border-b border-[#FFDFCA]/20 py-5">
              <p className="text-base text-[#FFDFCA] leading-relaxed font-normal">
                {product.descripcion}
              </p>
            </div>

            {/* Enlace al sitio (Store link button) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={product.enlaceSitio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#FFDFCA] hover:bg-[#fce6d8] text-[#FFA18F] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Ir a la tienda oficial</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
