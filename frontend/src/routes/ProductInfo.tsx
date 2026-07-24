import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

interface ProductInfoProps {
  product?: any;
}

export default function ProductInfo({ product: customProduct }: ProductInfoProps) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [apiProduct, setApiProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Retrieve passed item state if available from navigation
  const stateProduct = location.state?.product || location.state?.item;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, location.state]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    setLoading(true);

    async function fetchProductDetail() {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) throw new Error('No encontrado');
        const data = await response.json();

        if (isMounted && data) {
          const mainImage = data.photos && data.photos.length > 0 
            ? (data.photos.find((p: any) => p.isMain)?.url || data.photos[0].url) 
            : (data.imagenUrl || data.imagen);

          setApiProduct({
            id: data.id,
            nombre: data.nombre,
            fabricante: data.fabricante,
            tienda: data.tienda || data.fabricante,
            descripcion: data.descripcion,
            temporada: data.temporada,
            precio: data.precio,
            enlaceSitio: data.enlaceSitio,
            imagen: mainImage,
          });
        }
      } catch (err) {
        console.warn('No se pudo obtener el detalle del producto desde el servidor:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProductDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Combine custom props, API data, or state data from previous list item click
  const product = {
    id: customProduct?.id || apiProduct?.id || stateProduct?.id,
    nombre: customProduct?.nombre || apiProduct?.nombre || stateProduct?.title || stateProduct?.nombre,
    fabricante: customProduct?.fabricante || apiProduct?.fabricante || stateProduct?.fabricante,
    tienda: customProduct?.tienda || apiProduct?.tienda || stateProduct?.tienda || stateProduct?.fabricante,
    descripcion: customProduct?.descripcion || apiProduct?.descripcion || stateProduct?.descripcion,
    temporada: customProduct?.temporada || apiProduct?.temporada || stateProduct?.temporada,
    precio: customProduct?.precio || apiProduct?.precio || stateProduct?.price || stateProduct?.precio,
    enlaceSitio: customProduct?.enlaceSitio || apiProduct?.enlaceSitio || stateProduct?.enlaceSitio,
    imagen: customProduct?.imagen || apiProduct?.imagen || stateProduct?.src || stateProduct?.imagen,
  };

  return (
    <div className="min-h-screen bg-[#FEEBE7] font-sans text-[#654321] pt-28 pb-16 px-4 md:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        {/* Navigation / Back link */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-[#654321]/70 hover:text-[#faa18F] transition-colors gap-2 group cursor-pointer"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Volver a artículos
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xl font-bold tracking-widest text-[#faa18F] uppercase animate-pulse">
            Cargando producto...
          </div>
        ) : !product.nombre ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold text-[#faa18F] uppercase mb-2">Producto no encontrado</h2>
            <p className="text-sm opacity-80">El artículo solicitado no existe en la base de datos del servidor.</p>
          </div>
        ) : (
          /* Main Product Container */
          <div className="bg-[#8db1cd] backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/40 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center text-[#FFDFCA]">

            {/* Left Column: Product Photo */}
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] bg-neutral-100 shadow-md">
              <img
                src={product.imagen || 'https://via.placeholder.com/600x800?text=Sin+Imagen'}
                alt={product.nombre}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=Imagen+No+Disponible';
                }}
              />
            </div>

            {/* Right Column: Product Information */}
            <div className="flex flex-col justify-center">
              {/* Tienda (Store / Brand) */}
              {product.tienda && (
                <div className="mb-3">
                  <span className="inline-block bg-[#FFDFCA]/15 text-[#FFDFCA] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#FFDFCA]/30">
                    {product.tienda}
                  </span>
                </div>
              )}

              {/* Nombre (Product Name) */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFDFCA] tracking-tight mb-2">
                {product.nombre}
              </h1>

              {/* Precio & Temporada */}
              <div className="flex items-center gap-4 mb-4">
                {product.precio && (
                  <span className="text-2xl font-bold text-[#FFDFCA]">{product.precio}</span>
                )}
                {product.temporada && (
                  <span className="text-sm opacity-80 border-l border-[#FFDFCA]/40 pl-4">{product.temporada}</span>
                )}
              </div>

              {/* Descripción (Description) */}
              <div className="mb-8 border-t border-b border-[#FFDFCA]/20 py-5">
                <p className="text-base text-[#FFDFCA] leading-relaxed font-normal">
                  {product.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>

              {/* Enlace al sitio (Store link button) */}
              {product.enlaceSitio && (
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
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
