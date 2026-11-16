import { useState, useEffect } from 'react';
import { API_BASE_URL, ADMIN_API_KEY } from '../config/api';
import {
  Sparkles,
  User,
  ShoppingBag,
  Shirt,
  Search,
  RefreshCw,
  CheckCircle2,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../types/product';

interface ClientSummary {
  id: string;
  nombre: string;
  email: string;
  preferenciasEstilo?: Record<string, any>;
  totalPrendas: number;
  totalOutfits: number;
  createdAt: string;
}

interface PrendaItem {
  id: string;
  nombre: string;
  tipoPrenda: string;
  color?: string;
  temporada?: string;
  estilo?: string;
  fotoUrl: string;
  notasAdicionales?: Record<string, any>;
}

interface OutfitItem {
  id: string;
  nombre: string;
  descripcion?: string;
  ocasion?: string;
  temporada?: string;
  esPropuestaEstilista: boolean;
  notaEstilista?: string;
  createdAt: string;
  items?: { id: string; prenda: PrendaItem; posicion?: string }[];
  productosRecomendados?: { id: string; product: Product; comentario?: string }[];
}

export default function StylistView() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Client Details State
  const [wardrobe, setWardrobe] = useState<PrendaItem[]>([]);
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'armario' | 'outfits' | 'nuevo'>('armario');

  // Products from Okarea Catalog (for recommendation)
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);

  // Recommendation Form State
  const [newOutfitName, setNewOutfitName] = useState('');
  const [newOutfitOcasion, setNewOutfitOcasion] = useState('');
  const [newOutfitTemporada, setNewOutfitTemporada] = useState('');
  const [stylistNote, setStylistNote] = useState('');
  const [selectedPrendaIds, setSelectedPrendaIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchCatalogProducts();
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      fetchClientDetails(selectedClientId);
      // Reset form
      setSelectedPrendaIds([]);
      setSelectedProductIds([]);
      setNewOutfitName('');
      setStylistNote('');
      setSubmitSuccess(false);
    }
  }, [selectedClientId]);

  const fetchClients = async () => {
    setLoadingClients(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/armario/estilismo/clientes`, {
        headers: { 'x-api-key': ADMIN_API_KEY },
      });
      if (!res.ok) throw new Error('Error al cargar clientes');
      const data = await res.json();
      setClients(data);
      if (data.length > 0 && !selectedClientId) {
        setSelectedClientId(data[0].id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'No se pudieron cargar los clientes del servicio móvil.');
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchCatalogProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setCatalogProducts(data.items || data || []);
      }
    } catch (err) {
      // Silently catch catalog load error
    }
  };

  const fetchClientDetails = async (clientId: string) => {
    setLoadingDetails(true);
    try {
      const [wardrobeRes, outfitsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/armario/estilismo/clientes/${clientId}/armario`, {
          headers: { 'x-api-key': ADMIN_API_KEY },
        }),
        fetch(`${API_BASE_URL}/armario/estilismo/clientes/${clientId}/outfits`, {
          headers: { 'x-api-key': ADMIN_API_KEY },
        }),
      ]);

      if (wardrobeRes.ok) {
        setWardrobe(await wardrobeRes.json());
      }
      if (outfitsRes.ok) {
        setOutfits(await outfitsRes.json());
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoadingDetails(false);
    }
  };

  const toggleSelectPrenda = (id: string) => {
    setSelectedPrendaIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id],
    );
  };

  const handleSendRecommendation = async () => {
    if (!selectedClientId) return;
    if (!newOutfitName.trim()) {
      alert('Por favor introduce un nombre para el outfit.');
      return;
    }
    if (!stylistNote.trim()) {
      alert('Por favor introduce una nota o consejo del estilista.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nombre: newOutfitName,
        notaEstilista: stylistNote,
        ocasion: newOutfitOcasion || undefined,
        temporada: newOutfitTemporada || undefined,
        items: selectedPrendaIds.map((id) => ({ prendaId: id })),
        productosRecomendados: selectedProductIds.map((id) => ({
          productId: id,
          comentario: 'Sugerencia de catálogo Okarea',
        })),
      };

      const res = await fetch(
        `${API_BASE_URL}/armario/estilismo/clientes/${selectedClientId}/recomendar-outfit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ADMIN_API_KEY,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error('Error al enviar recomendación');

      setSubmitSuccess(true);
      fetchClientDetails(selectedClientId);
      setActiveTab('outfits');
    } catch (err: any) {
      alert(err.message || 'Error al enviar outfit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const filteredClients = clients.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[650px]">
      {/* 1. SIDEBAR: LISTA DE CLIENTES */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <User className="w-5 h-5 text-purple-400" />
            <span>Clientes App ({clients.length})</span>
          </div>
          <button
            onClick={fetchClients}
            title="Refrescar lista"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Búsqueda */}
        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[550px]">
          {loadingClients ? (
            <div className="py-12 text-center text-slate-400 text-xs">Cargando clientes...</div>
          ) : filteredClients.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No se han encontrado usuarios registrados en el servicio móvil.
            </div>
          ) : (
            filteredClients.map((client) => {
              const isSelected = client.id === selectedClientId;
              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-medium text-sm flex items-center justify-between">
                    <span>{client.nombre}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {client.totalPrendas} prendas
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{client.email}</div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. PANEL PRINCIPAL: ARMARIO Y ASESORÍA */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
        {selectedClient ? (
          <>
            {/* Cabecera del Cliente */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{selectedClient.nombre}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedClient.email}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>Prendas en armario: <strong className="text-purple-300">{wardrobe.length}</strong></span>
                  <span>•</span>
                  <span>Outfits totales: <strong className="text-purple-300">{outfits.length}</strong></span>
                </p>
              </div>

              {/* Pestañas de Vista */}
              <div className="flex items-center gap-2 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
                <button
                  onClick={() => setActiveTab('armario')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'armario'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Armario ({wardrobe.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('outfits')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'outfits'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Outfits ({outfits.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('nuevo')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'nuevo'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                      : 'text-purple-400 hover:text-purple-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recomendar Look</span>
                </button>
              </div>
            </div>

            {/* CONTENIDO SEGÚN PESTAÑA */}
            <div className="flex-1 mt-6">
              {loadingDetails ? (
                <div className="py-20 text-center text-slate-400 text-xs">Cargando datos del cliente...</div>
              ) : activeTab === 'armario' ? (
                /* TAB 1: ARMARIO DEL CLIENTE */
                wardrobe.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-sm">
                    El usuario aún no ha subido prendas a su armario desde la app móvil.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {wardrobe.map((prenda) => (
                      <div
                        key={prenda.id}
                        className="bg-slate-800/40 border border-slate-800 rounded-xl overflow-hidden group hover:border-purple-500/50 transition-all flex flex-col"
                      >
                        <div className="aspect-square bg-slate-950 relative overflow-hidden">
                          <img
                            src={prenda.fotoUrl}
                            alt={prenda.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white uppercase font-semibold">
                            {prenda.tipoPrenda}
                          </span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div className="font-medium text-xs text-white line-clamp-1">{prenda.nombre}</div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                            <span>{prenda.color || 'Color n/d'}</span>
                            <span>{prenda.temporada || 'Todo el año'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : activeTab === 'outfits' ? (
                /* TAB 2: OUTFITS DEL CLIENTE */
                outfits.length === 0 ? (
                  <div className="py-20 text-center text-slate-500 text-sm">
                    No hay looks registrados para este usuario todavía.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {outfits.map((outfit) => (
                      <div
                        key={outfit.id}
                        className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white text-sm">{outfit.nombre}</h3>
                            {outfit.esPropuestaEstilista && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-pink-400" />
                                Sugerido por Estilista
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(outfit.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {outfit.notaEstilista && (
                          <div className="text-xs bg-purple-950/30 border border-purple-800/40 rounded-lg p-2.5 text-purple-200">
                            <strong>Consejo del estilista:</strong> {outfit.notaEstilista}
                          </div>
                        )}

                        {/* Prendas del outfit */}
                        {outfit.items && outfit.items.length > 0 && (
                          <div>
                            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
                              Prendas combinadas del usuario:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {outfit.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-2 bg-slate-900 border border-slate-700/60 rounded-lg p-1.5 pr-2.5"
                                >
                                  <img
                                    src={item.prenda?.fotoUrl}
                                    alt={item.prenda?.nombre}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                  <div className="text-[11px] text-slate-300">
                                    <div className="font-medium line-clamp-1">{item.prenda?.nombre}</div>
                                    <div className="text-[10px] text-slate-500">{item.prenda?.tipoPrenda}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Productos Okarea recomendados */}
                        {outfit.productosRecomendados && outfit.productosRecomendados.length > 0 && (
                          <div>
                            <span className="text-[11px] text-pink-400 font-medium block mb-1.5">
                              Prendas recomendadas del catálogo Okarea:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {outfit.productosRecomendados.map((rec) => (
                                <div
                                  key={rec.id}
                                  className="flex items-center gap-2 bg-pink-950/20 border border-pink-500/30 rounded-lg p-1.5 pr-2.5"
                                >
                                  {rec.product?.photos?.[0]?.url && (
                                    <img
                                      src={rec.product.photos[0].url}
                                      alt={rec.product?.nombre}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                  )}
                                  <div className="text-[11px] text-pink-200">
                                    <div className="font-medium line-clamp-1">{rec.product?.nombre}</div>
                                    <div className="text-[10px] text-pink-400">{rec.product?.precio || 'Okarea'}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* TAB 3: CREADOR / RECOMENDADOR DE OUTFIT */
                <div className="flex flex-col gap-6">
                  {/* Datos del outfit */}
                  {submitSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-xs text-green-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <span>¡Outfit recomendado enviado con éxito al cliente!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="text-xs text-slate-300 font-medium block mb-1">Nombre del Outfit *</label>
                      <input
                        type="text"
                        placeholder="ej: Look Elegante de Verano para Cena"
                        value={newOutfitName}
                        onChange={(e) => setNewOutfitName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Ocasión / Evento</label>
                      <input
                        type="text"
                        placeholder="ej: Cena formal, Boda, Casual"
                        value={newOutfitOcasion}
                        onChange={(e) => setNewOutfitOcasion(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-medium block mb-1">Temporada</label>
                      <input
                        type="text"
                        placeholder="ej: Primavera, Verano, Todo el año"
                        value={newOutfitTemporada}
                        onChange={(e) => setNewOutfitTemporada(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      Consejo y Recomendación del Estilista *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Escribe tu recomendación personalizada para el usuario (ej: 'Te sugerimos combinar tu blazer con estos pantalones de lino y este bolso artesanal...')"
                      value={stylistNote}
                      onChange={(e) => setStylistNote(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Paso 1: Seleccionar prendas del usuario */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white font-semibold flex items-center gap-1.5">
                        <Shirt className="w-4 h-4 text-purple-400" />
                        <span>1. Selecciona prendas del armario del usuario ({selectedPrendaIds.length} seleccionadas)</span>
                      </label>
                    </div>
                    {wardrobe.length === 0 ? (
                      <p className="text-xs text-slate-500">El usuario no tiene prendas en su armario.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800">
                        {wardrobe.map((prenda) => {
                          const isSelected = selectedPrendaIds.includes(prenda.id);
                          return (
                            <button
                              key={prenda.id}
                              type="button"
                              onClick={() => toggleSelectPrenda(prenda.id)}
                              className={`relative rounded-lg overflow-hidden border p-1 text-left transition-all ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500'
                                  : 'border-slate-800 hover:border-slate-700 bg-slate-900'
                              }`}
                            >
                              <img
                                src={prenda.fotoUrl}
                                alt={prenda.nombre}
                                className="w-full aspect-square object-cover rounded"
                              />
                              <div className="text-[10px] text-white font-medium mt-1 truncate">{prenda.nombre}</div>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-purple-400 absolute top-2 right-2 bg-slate-900 rounded-full" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Paso 2: Seleccionar productos del catálogo Okarea para complementar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs text-white font-semibold flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-pink-400" />
                        <span>2. Añadir piezas sugeridas del catálogo Okarea ({selectedProductIds.length} seleccionadas)</span>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800">
                      {catalogProducts.map((prod) => {
                        const isSelected = prod.id ? selectedProductIds.includes(prod.id) : false;
                        const photoUrl = prod.photos?.[0]?.url || prod.imagenUrl;
                        return (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => prod.id && toggleSelectProduct(prod.id)}
                            className={`relative rounded-lg overflow-hidden border p-1 text-left transition-all ${
                              isSelected
                                ? 'border-pink-500 bg-pink-950/40 ring-2 ring-pink-500'
                                : 'border-slate-800 hover:border-slate-700 bg-slate-900'
                            }`}
                          >
                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={prod.nombre}
                                className="w-full aspect-square object-cover rounded"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500">
                                Sin foto
                              </div>
                            )}
                            <div className="text-[10px] text-white font-medium mt-1 truncate">{prod.nombre}</div>
                            <div className="text-[9px] text-pink-300">{prod.precio || 'Okarea'}</div>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-pink-400 absolute top-2 right-2 bg-slate-900 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Botón de Enviar */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSendRecommendation}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isSubmitting ? 'Enviando recomendación...' : 'Enviar Outfit al Cliente'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="m-auto text-center text-slate-500 text-sm">
            Selecciona un cliente de la lista para ver su armario o recomendarle outfits.
          </div>
        )}
      </div>
    </div>
  );
}
