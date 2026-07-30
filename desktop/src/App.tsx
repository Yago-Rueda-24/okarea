import { useState, useEffect } from 'react';
import { Product } from './types/product';
import { EventItem } from './types/event';
import { PlaceItem } from './types/place';
import { API_BASE_URL, ADMIN_API_KEY } from './config/api';
import AdminHeader, { MainTab } from './components/AdminHeader';
import ProductFormPreviewModal from './components/ProductFormPreviewModal';
import EventFormModal from './components/EventFormModal';
import PlaceFormModal from './components/PlaceFormModal';
import { Edit3, Trash2, ShoppingBag, AlertCircle, Tag, ExternalLink, Calendar, MapPin, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('moda');

  // Products Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Events Data State
  const [events, setEvents] = useState<EventItem[]>([]);

  // Places Data State
  const [places, setPlaces] = useState<PlaceItem[]>([]);

  // Shared State
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals Control
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  // Delete confirmation state
  const [deletingItem, setDeletingItem] = useState<{ id: string; type: MainTab; name: string } | null>(null);

  // Fetch Products
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
      if (!res.ok) throw new Error('No se pudo cargar el catálogo de moda.');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la API de OkArea (Moda)');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch Events
  const fetchEvents = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      let url = `${API_BASE_URL}/events`;
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudieron cargar los eventos.');
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la API de OkArea (Eventos)');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch Places
  const fetchPlaces = async () => {
    setIsRefreshing(true);
    setErrorMsg(null);
    try {
      let url = `${API_BASE_URL}/places`;
      if (searchQuery.trim()) {
        url += `?search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudieron cargar los lugares.');
      const data = await res.json();
      setPlaces(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la API de OkArea (Lugares)');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'moda') fetchProducts();
    else if (activeTab === 'eventos') fetchEvents();
    else if (activeTab === 'lugares') fetchPlaces();
  };

  useEffect(() => {
    setLoading(true);
    handleRefresh();
  }, [activeTab, selectedCategory, searchQuery]);

  const handleOpenCreateModal = () => {
    if (activeTab === 'moda') {
      setSelectedProduct(null);
      setIsProductModalOpen(true);
    } else if (activeTab === 'eventos') {
      setSelectedEvent(null);
      setIsEventModalOpen(true);
    } else if (activeTab === 'lugares') {
      setSelectedPlace(null);
      setIsPlaceModalOpen(true);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    try {
      const endpoint =
        deletingItem.type === 'moda'
          ? 'products'
          : deletingItem.type === 'eventos'
          ? 'events'
          : 'places';

      const res = await fetch(`${API_BASE_URL}/${endpoint}/${deletingItem.id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': ADMIN_API_KEY,
        },
      });

      if (!res.ok) {
        throw new Error('Fallo al eliminar el registro.');
      }

      setDeletingItem(null);
      handleRefresh();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el elemento');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Header & Section Navigation */}
      <AdminHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={handleRefresh}
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
              onClick={handleRefresh}
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
              {activeTab === 'moda' && <ShoppingBag className="w-6 h-6 text-purple-400" />}
              {activeTab === 'eventos' && <Calendar className="w-6 h-6 text-purple-400" />}
              {activeTab === 'lugares' && <Compass className="w-6 h-6 text-purple-400" />}
              
              {activeTab === 'moda' && `Colección Moda (${products.length} artículos)`}
              {activeTab === 'eventos' && `Eventos Registrados (${events.length} eventos)`}
              {activeTab === 'lugares' && `Lugares Destacados (${places.length} lugares)`}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Administración en tiempo real de {activeTab} para la plataforma OkArea.
            </p>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-400 font-medium">Cargando {activeTab} desde el servidor...</p>
          </div>
        ) : (
          <>
            {/* 1. MODA GRID */}
            {activeTab === 'moda' && (
              products.length === 0 ? (
                <div className="py-20 px-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center max-w-md mx-auto">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300 mb-1">No hay artículos de moda</h3>
                  <p className="text-xs text-slate-500 mb-6">Inserta tu primer artículo desde el botón superior.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
                  >
                    + Insertar Primer Artículo
                  </button>
                </div>
              ) : (
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
                        <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                          <img
                            src={displayImage}
                            alt={product.nombre}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Sin+Imagen';
                            }}
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                              <Tag className="w-3 h-3" /> {product.categoria}
                            </span>
                          </div>
                          {product.precio && (
                            <div className="absolute bottom-3 right-3">
                              <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                                {product.precio}
                              </span>
                            </div>
                          )}
                        </div>

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

                          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-3">
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsProductModalOpen(true);
                              }}
                              className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Modificar
                            </button>
                            <button
                              onClick={() => setDeletingItem({ id: product.id!, type: 'moda', name: product.nombre })}
                              title="Eliminar artículo"
                              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* 2. EVENTOS GRID */}
            {activeTab === 'eventos' && (
              events.length === 0 ? (
                <div className="py-20 px-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center max-w-md mx-auto">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300 mb-1">No hay eventos creados</h3>
                  <p className="text-xs text-slate-500 mb-6">Añade tu primer evento desde el botón superior.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
                  >
                    + Nuevo Evento
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group shadow-lg"
                    >
                      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                        <img
                          src={evt.foto ? (evt.foto.includes('minio:9000') ? evt.foto.replace('minio:9000', 'localhost:9000') : evt.foto) : 'https://via.placeholder.com/600x400?text=Evento+OkArea'}
                          alt={evt.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Sin+Imagen';
                          }}
                        />
                        {evt.lugar && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {evt.lugar}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1 mb-2">
                            {evt.titulo}
                          </h3>
                          {evt.descripcion && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                              {evt.descripcion}
                            </p>
                          )}
                          {evt.enlace && (
                            <a
                              href={evt.enlace}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] text-purple-400 hover:underline font-medium"
                            >
                              <ExternalLink className="w-3 h-3" /> Ver Evento / Enlace
                            </a>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedEvent(evt);
                              setIsEventModalOpen(true);
                            }}
                            className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Modificar
                          </button>
                          <button
                            onClick={() => setDeletingItem({ id: evt.id!, type: 'eventos', name: evt.titulo })}
                            title="Eliminar evento"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* 3. LUGARES GRID */}
            {activeTab === 'lugares' && (
              places.length === 0 ? (
                <div className="py-20 px-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center max-w-md mx-auto">
                  <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300 mb-1">No hay lugares registrados</h3>
                  <p className="text-xs text-slate-500 mb-6">Añade tu primer lugar destacado desde el botón superior.</p>
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
                  >
                    + Nuevo Lugar
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {places.map((plc) => (
                    <div
                      key={plc.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group shadow-lg"
                    >
                      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                        <img
                          src={plc.foto || 'https://via.placeholder.com/600x400?text=Lugar+OkArea'}
                          alt={plc.nombre}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Sin+Imagen';
                          }}
                        />
                        {plc.lugar && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-slate-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {plc.lugar}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1 mb-2">
                            {plc.nombre}
                          </h3>
                          {plc.descripcion && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                              {plc.descripcion}
                            </p>
                          )}
                          {plc.enlace && (
                            <a
                              href={plc.enlace}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] text-purple-400 hover:underline font-medium"
                            >
                              <ExternalLink className="w-3 h-3" /> Ver Sitio Web
                            </a>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-3">
                          <button
                            onClick={() => {
                              setSelectedPlace(plc);
                              setIsPlaceModalOpen(true);
                            }}
                            className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Modificar
                          </button>
                          <button
                            onClick={() => setDeletingItem({ id: plc.id!, type: 'lugares', name: plc.nombre })}
                            title="Eliminar lugar"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

      </main>

      {/* Delete Confirmation Dialog */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">¿Confirmar Eliminación?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Esta acción eliminará "{deletingItem.name}" permanentemente del servidor.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductFormPreviewModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSuccess={fetchProducts}
        initialProduct={selectedProduct}
      />

      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={fetchEvents}
        initialEvent={selectedEvent}
      />

      <PlaceFormModal
        isOpen={isPlaceModalOpen}
        onClose={() => setIsPlaceModalOpen(false)}
        onSuccess={fetchPlaces}
        initialPlace={selectedPlace}
      />

    </div>
  );
}
