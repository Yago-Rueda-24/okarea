import { useState, useEffect } from 'react';
import { Product } from './types/product';
import { EventItem } from './types/event';
import { PlaceItem } from './types/place';
import { API_BASE_URL, ADMIN_API_KEY } from './config/api';
import { formatImageUrl } from './utils/image';
import AdminHeader, { MainTab, WorkspaceType } from './components/AdminHeader';
import ProductFormPreviewModal from './components/ProductFormPreviewModal';
import EventFormModal from './components/EventFormModal';
import PlaceFormModal from './components/PlaceFormModal';
import VisitsStatsView from './components/VisitsStatsView';
import AdminChatView from './components/AdminChatView';
import AsesoriaAdminView from './components/AsesoriaAdminView';
import {
  Edit3,
  Trash2,
  ShoppingBag,
  AlertCircle,
  Tag,
  ExternalLink,
  Calendar,
  MapPin,
  Compass,
} from 'lucide-react';

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('blog');
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

  // Dispatch data fetch based on activeTab
  useEffect(() => {
    if (activeWorkspace !== 'blog') return;

    if (activeTab === 'moda') {
      fetchProducts();
    } else if (activeTab === 'eventos') {
      fetchEvents();
    } else if (activeTab === 'lugares') {
      fetchPlaces();
    }
  }, [activeWorkspace, activeTab, selectedCategory]);

  // Debounced search trigger
  useEffect(() => {
    if (activeWorkspace !== 'blog') return;

    const timer = setTimeout(() => {
      if (activeTab === 'moda') fetchProducts();
      else if (activeTab === 'eventos') fetchEvents();
      else if (activeTab === 'lugares') fetchPlaces();
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRefresh = () => {
    if (activeWorkspace === 'armario') return;
    if (activeTab === 'moda') fetchProducts();
    else if (activeTab === 'eventos') fetchEvents();
    else if (activeTab === 'lugares') fetchPlaces();
  };

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
      let endpoint = '';
      if (deletingItem.type === 'moda') endpoint = `/products/${deletingItem.id}`;
      else if (deletingItem.type === 'eventos') endpoint = `/events/${deletingItem.id}`;
      else if (deletingItem.type === 'lugares') endpoint = `/places/${deletingItem.id}`;

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    <div className="min-h-screen bg-[#faf2ee] text-[#1e1b19] font-sans flex flex-col antialiased">
      {/* Header & Section Navigation */}
      <AdminHeader
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={(ws) => {
          setActiveWorkspace(ws);
          if (ws === 'armario') {
            setActiveTab('asesorias');
          } else if (activeTab === 'asesorias') {
            setActiveTab('moda');
          }
          setSearchQuery('');
        }}
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
        {activeWorkspace === 'armario' || activeTab === 'asesorias' ? (
          <AsesoriaAdminView />
        ) : activeTab === 'estadisticas' ? (
          <VisitsStatsView />
        ) : activeTab === 'chat' ? (
          <AdminChatView />
        ) : (
          <div>
            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 flex items-center justify-between text-[#93000a] text-sm shadow-xs animate-fade-in">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="text-xs bg-[#93000a] hover:bg-[#ba1a1a] px-3 py-1.5 rounded-lg text-white font-semibold transition-all cursor-pointer shadow-xs"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Dashboard Title & Stats */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#eee7e3] shadow-xs">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[#1e1b19] tracking-tight flex items-center gap-2.5">
                  {activeTab === 'moda' && <ShoppingBag className="w-5 h-5 text-primary" />}
                  {activeTab === 'eventos' && <Calendar className="w-5 h-5 text-primary" />}
                  {activeTab === 'lugares' && <Compass className="w-5 h-5 text-primary" />}

                  {activeTab === 'moda' && `Colección Moda (${products.length} artículos)`}
                  {activeTab === 'eventos' && `Eventos Registrados (${events.length} eventos)`}
                  {activeTab === 'lugares' && `Lugares Destacados (${places.length} lugares)`}
                </h1>
                <p className="text-xs text-[#88726c] mt-1">
                  Administración editorial en tiempo real de {activeTab} para OkArea Blog.
                </p>
              </div>
            </div>

            {/* Loading Spinner */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-[#88726c] font-medium">Cargando {activeTab} desde el servidor...</p>
              </div>
            ) : (
              <>
                {/* 1. MODA GRID */}
                {activeTab === 'moda' && (
                  products.length === 0 ? (
                    <div className="py-20 px-6 rounded-2xl bg-white border border-[#eee7e3] text-center max-w-md mx-auto shadow-xs">
                      <ShoppingBag className="w-12 h-12 text-[#88726c]/40 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-[#1e1b19] mb-1">No hay artículos de moda</h3>
                      <p className="text-xs text-[#88726c] mb-6">Inserta tu primer artículo desde el botón superior.</p>
                      <button
                        onClick={handleOpenCreateModal}
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        + Insertar Primer Artículo
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map((product) => {
                        const rawImage =
                          product.photos && product.photos.length > 0
                            ? product.photos[0].url
                            : product.imagenUrl;
                        const displayImage = formatImageUrl(rawImage) || 'https://via.placeholder.com/400x500?text=Sin+Imagen';

                        return (
                          <div
                            key={product.id}
                            className="bg-white border border-[#eee7e3] rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col group shadow-xs hover:shadow-sm"
                          >
                            <div className="relative aspect-[3/4] bg-[#faf2ee] overflow-hidden">
                              <img
                                src={displayImage}
                                alt={product.nombre}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Sin+Imagen';
                                }}
                              />
                              <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur-md text-[#1e1b19] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#eee7e3] flex items-center gap-1 shadow-2xs">
                                  <Tag className="w-3 h-3 text-primary" /> {product.categoria}
                                </span>
                              </div>
                              {product.precio && (
                                <div className="absolute bottom-3 right-3">
                                  <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                                    {product.precio}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                {product.tienda && (
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#88726c] mb-1">
                                    {product.tienda}
                                  </p>
                                )}
                                <h3 className="text-sm font-bold text-[#1e1b19] line-clamp-1 mb-1.5 font-serif">
                                  {product.nombre}
                                </h3>
                                {product.descripcion && (
                                  <p className="text-xs text-[#55433e] line-clamp-2 leading-relaxed mb-3">
                                    {product.descripcion}
                                  </p>
                                )}
                                {product.enlaceSitio && (
                                  <a
                                    href={product.enlaceSitio}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline font-semibold"
                                  >
                                    <ExternalLink className="w-3 h-3" /> Sitio Oficial
                                  </a>
                                )}
                              </div>

                              <div className="pt-3 border-t border-[#eee7e3] flex items-center justify-between gap-2 mt-3">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="flex-1 py-2 px-3 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] text-[#1e1b19] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#eee7e3]"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-primary" /> Modificar
                                </button>
                                <button
                                  onClick={() => setDeletingItem({ id: product.id!, type: 'moda', name: product.nombre })}
                                  title="Eliminar artículo"
                                  className="p-2 rounded-xl bg-[#faf2ee] hover:bg-[#ffdad6] text-[#88726c] hover:text-[#93000a] transition-colors cursor-pointer border border-[#eee7e3]"
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
                    <div className="py-20 px-6 rounded-2xl bg-white border border-[#eee7e3] text-center max-w-md mx-auto shadow-xs">
                      <Calendar className="w-12 h-12 text-[#88726c]/40 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-[#1e1b19] mb-1">No hay eventos creados</h3>
                      <p className="text-xs text-[#88726c] mb-6">Añade tu primer evento desde el botón superior.</p>
                      <button
                        onClick={handleOpenCreateModal}
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        + Nuevo Evento
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {events.map((evt) => (
                        <div
                          key={evt.id}
                          className="bg-white border border-[#eee7e3] rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col group shadow-xs hover:shadow-sm"
                        >
                          <div className="relative aspect-[16/10] bg-[#faf2ee] overflow-hidden">
                            <img
                              src={formatImageUrl(evt.foto) || 'https://via.placeholder.com/600x400?text=Evento+OkArea'}
                              alt={evt.titulo}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Sin+Imagen';
                              }}
                            />
                            {evt.lugar && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur-md text-[#1e1b19] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#eee7e3] flex items-center gap-1 shadow-2xs">
                                  <MapPin className="w-3 h-3 text-primary" /> {evt.lugar}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-[#1e1b19] line-clamp-1 mb-1.5 font-serif">
                                {evt.titulo}
                              </h3>
                              {evt.descripcion && (
                                <p className="text-xs text-[#55433e] line-clamp-2 leading-relaxed mb-3">
                                  {evt.descripcion}
                                </p>
                              )}
                              {evt.enlace && (
                                <a
                                  href={evt.enlace}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline font-semibold"
                                >
                                  <ExternalLink className="w-3 h-3" /> Ver Evento / Enlace
                                </a>
                              )}
                            </div>

                            <div className="pt-3 border-t border-[#eee7e3] flex items-center justify-between gap-2 mt-3">
                              <button
                                onClick={() => {
                                  setSelectedEvent(evt);
                                  setIsEventModalOpen(true);
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] text-[#1e1b19] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#eee7e3]"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-primary" /> Modificar
                              </button>
                              <button
                                onClick={() => setDeletingItem({ id: evt.id!, type: 'eventos', name: evt.titulo })}
                                title="Eliminar evento"
                                className="p-2 rounded-xl bg-[#faf2ee] hover:bg-[#ffdad6] text-[#88726c] hover:text-[#93000a] transition-colors cursor-pointer border border-[#eee7e3]"
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
                    <div className="py-20 px-6 rounded-2xl bg-white border border-[#eee7e3] text-center max-w-md mx-auto shadow-xs">
                      <Compass className="w-12 h-12 text-[#88726c]/40 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-[#1e1b19] mb-1">No hay lugares registrados</h3>
                      <p className="text-xs text-[#88726c] mb-6">Añade tu primer lugar destacado desde el botón superior.</p>
                      <button
                        onClick={handleOpenCreateModal}
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
                      >
                        + Nuevo Lugar
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {places.map((plc) => (
                        <div
                          key={plc.id}
                          className="bg-white border border-[#eee7e3] rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col group shadow-xs hover:shadow-sm"
                        >
                          <div className="relative aspect-[16/10] bg-[#faf2ee] overflow-hidden">
                            <img
                              src={formatImageUrl(plc.foto) || 'https://via.placeholder.com/600x400?text=Lugar+OkArea'}
                              alt={plc.nombre}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Sin+Imagen';
                              }}
                            />
                            {plc.lugar && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur-md text-[#1e1b19] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#eee7e3] flex items-center gap-1 shadow-2xs">
                                  <MapPin className="w-3 h-3 text-primary" /> {plc.lugar}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-[#1e1b19] line-clamp-1 mb-1.5 font-serif">
                                {plc.nombre}
                              </h3>
                              {plc.descripcion && (
                                <p className="text-xs text-[#55433e] line-clamp-2 leading-relaxed mb-3">
                                  {plc.descripcion}
                                </p>
                              )}
                              {plc.enlace && (
                                <a
                                  href={plc.enlace}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[11px] text-primary hover:underline font-semibold"
                                >
                                  <ExternalLink className="w-3 h-3" /> Ver Sitio Web
                                </a>
                              )}
                            </div>

                            <div className="pt-3 border-t border-[#eee7e3] flex items-center justify-between gap-2 mt-3">
                              <button
                                onClick={() => {
                                  setSelectedPlace(plc);
                                  setIsPlaceModalOpen(true);
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] text-[#1e1b19] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#eee7e3]"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-primary" /> Modificar
                              </button>
                              <button
                                onClick={() => setDeletingItem({ id: plc.id!, type: 'lugares', name: plc.nombre })}
                                title="Eliminar lugar"
                                className="p-2 rounded-xl bg-[#faf2ee] hover:bg-[#ffdad6] text-[#88726c] hover:text-[#93000a] transition-colors cursor-pointer border border-[#eee7e3]"
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
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-[#eee7e3] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1e1b19]">¿Confirmar Eliminación?</h3>
            <p className="text-xs text-[#55433e] leading-relaxed">
              Esta acción eliminará &quot;{deletingItem.name}&quot; permanentemente del servidor.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl bg-[#faf2ee] hover:bg-[#eee7e3] text-[#1e1b19] text-xs font-semibold border border-[#eee7e3] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteItem}
                className="px-4 py-2 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold shadow-xs cursor-pointer"
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
