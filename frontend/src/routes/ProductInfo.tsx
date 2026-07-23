import { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getProductById, type Product } from '../data/products';

interface ProductInfoProps {
  product?: Product;
}

export default function ProductInfo({ product: customProduct }: ProductInfoProps) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Retrieve passed item state if available
  const stateProduct = location.state?.product || location.state?.item;
  const catalogProduct = getProductById(id);

  // Merge custom props, state data, and catalog data
  const product: Product = {
    id: customProduct?.id || stateProduct?.id || catalogProduct.id,
    nombre: customProduct?.nombre || stateProduct?.title || stateProduct?.nombre || catalogProduct.nombre,
    fabricante: customProduct?.fabricante || stateProduct?.fabricante || catalogProduct.fabricante,
    tienda: customProduct?.tienda || stateProduct?.tienda || stateProduct?.fabricante || catalogProduct.tienda,
    descripcion: customProduct?.descripcion || stateProduct?.descripcion || catalogProduct.descripcion,
    temporada: customProduct?.temporada || stateProduct?.temporada || catalogProduct.temporada,
    precio: customProduct?.precio || stateProduct?.price || stateProduct?.precio || catalogProduct.precio,
    enlaceSitio: customProduct?.enlaceSitio || stateProduct?.enlaceSitio || catalogProduct.enlaceSitio,
    imagen: customProduct?.imagen || stateProduct?.src || stateProduct?.imagen || catalogProduct.imagen,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, location.state]);
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
