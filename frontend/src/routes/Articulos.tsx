import { useEffect, useState } from 'react';
import ItemGrid, { type GridItem } from '../components/ItemGrid';
import { API_BASE_URL } from '../config/api';
import { formatImageUrl } from '../utils/image';

interface ArticulosProps {
  categoria?: string;
  title?: string;
}

const categoryCache: Record<string, GridItem[]> = {};

export default function Articulos({ categoria = 'bolsos', title }: ArticulosProps) {
  const [items, setItems] = useState<GridItem[]>(() => categoryCache[categoria] || []);
  const [loading, setLoading] = useState<boolean>(() => !categoryCache[categoria]);
  const [apiConnected, setApiConnected] = useState(true);

  const displayTitle = title || `Colección ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`;

  useEffect(() => {
    let isMounted = true;

    // If no cache for this category, set loading to true
    if (!categoryCache[categoria]) {
      setLoading(true);
    } else {
      setItems(categoryCache[categoria]);
      setLoading(false);
    }

    async function fetchCategoryProducts() {
      try {
        const response = await fetch(`${API_BASE_URL}/products?categoria=${categoria}`);
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          const gridItems: GridItem[] = data.map((p: any) => ({
            id: p.id,
            src: formatImageUrl(p.photos && p.photos.length > 0 ? p.photos[0].url : (p.imagenUrl || p.imagen)) || 'https://via.placeholder.com/400x500?text=Sin+Imagen',
            title: p.nombre,
            price: p.precio,
            fabricante: p.fabricante,
            tienda: p.tienda,
            descripcion: p.descripcion,
            enlaceSitio: p.enlaceSitio,
          }));
          categoryCache[categoria] = gridItems;
          setItems(gridItems);
          setApiConnected(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API backend no disponible:', err);
        if (isMounted) {
          setApiConnected(false);
          if (!categoryCache[categoria]) {
            setItems([]);
          }
          setLoading(false);
        }
      }
    }

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [categoria]);

  // Restore scroll after items are rendered in DOM
  useEffect(() => {
    if (!loading && items.length > 0) {
      try {
        const saved = sessionStorage.getItem(`scroll_pos_${window.location.pathname}`);
        if (saved) {
          const y = parseInt(saved, 10);
          if (y > 0) {
            requestAnimationFrame(() => {
              window.scrollTo(0, y);
            });
            setTimeout(() => {
              window.scrollTo(0, y);
            }, 60);
          }
        }
      } catch (e) {}
    }
  }, [loading, items, categoria]);

  return (
    <div className="min-h-screen bg-[#FEEBE7] font-sans text-[#654321]">
      {loading ? (
        <div className="pt-36 text-center text-xl font-bold tracking-widest text-[#faa18F] uppercase animate-pulse">
          Cargando artículos...
        </div>
      ) : items.length === 0 ? (
        <div className="pt-36 pb-20 px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-[#faa18F] uppercase mb-4">
            {displayTitle}
          </h2>
          <p className="text-base text-[#654321]/70 max-w-md mx-auto">
            {apiConnected
              ? 'No hay artículos disponibles en esta categoría actualmente.'
              : 'No se pudo conectar con el servidor para cargar el catálogo.'}
          </p>
        </div>
      ) : (
        <ItemGrid title={displayTitle} items={items} />
      )}
    </div>
  );
}
