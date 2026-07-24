import { useState, useEffect } from 'react';
import { Product } from './types/product';
import { API_BASE_URL, ADMIN_API_KEY } from './config/api';
import AdminHeader from './components/AdminHeader';
import ProductFormPreviewModal from './components/ProductFormPreviewModal';
import { Edit3, Trash2, ShoppingBag, AlertCircle, Tag, ExternalLink } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Delete confirmation modal state
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      let url = `${API_BASE_URL}/products`;
      const queryParams: string[] = [];
      
      if (selectedCategory !== 'all') {
        queryParams.push(`categoria=${selectedCategory}`);
      }
      if (searchQuery.trim()) {
        queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudo cargar el catálogo desde el servidor.');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la API de Okarea');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': ADMIN_API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error('Fallo al eliminar el artículo.');
      }

      setDeletingProductId(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar producto');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Header & Category Filters */}
      <AdminHeader
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={fetchProducts}
        isRefreshing={isRefreshing}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-red-400 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={fetchProducts}
              className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Dashboard Title & Stats */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-purple-400" />
              Colección del Catálogo ({products.length} artículos)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Administración en tiempo real de productos publicados en la web okarea.local
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-400 font-medium">Cargando colección desde el servidor...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty Catalog State */
          <div className="py-20 px-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300 mb-1">No hay artículos en el catálogo</h3>
            <p className="text-xs text-slate-500 mb-6">
              El catálogo está completamente vacío. Inserta tu primer artículo desde el botón inferior.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
            >
              + Insertar Primer Artículo
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const displayImage =
                product.photos && product.photos.length > 0
                  ? product.photos[0].url
                  : product.imagenUrl || 'https://via.placeholder.com/400x500?text=Sin+Imagen';

              return (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group shadow-lg"
                >
                  {/* Product Image Container */}
                  <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                    <img
                      src={displayImage}
                      alt={product.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Sin+Imagen';
                      }}
                    />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {product.categoria}
                      </span>
                    </div>

                    {/* Price Badge */}
                    {product.precio && (
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                          {product.precio}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {product.tienda && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          {product.tienda}
                        </p>
                      )}
                      <h3 className="text-sm font-bold text-white line-clamp-1 mb-2">
                        {product.nombre}
                      </h3>
                      {product.descripcion && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                          {product.descripcion}
                        </p>
                      )}
                      {product.enlaceSitio && (
                        <a
                          href={product.enlaceSitio}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-purple-400 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" /> Sitio Oficial
                        </a>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-3">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Modificar
                      </button>

                      <button
                        onClick={() => setDeletingProductId(product.id || null)}
                        title="Eliminar artículo"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">¿Confirmar Eliminación?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Esta acción eliminará el artículo permanentemente de la base de datos y de la web pública.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => deletingProductId && handleDeleteProduct(deletingProductId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal with Live ProductInfo Web Preview */}
      <ProductFormPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProducts}
        initialProduct={selectedProduct}
      />

    </div>
  );
}
