import apiClient from './client';

/**
 * Formats backend Outfit entity into frontend representation
 */
export function formatOutfitFromApi(apiOutfit) {
  if (!apiOutfit) return null;

  const items = (apiOutfit.items || []).map((item, idx) => {
    const prenda = item.prenda || {};
    const notas = prenda.notasAdicionales || {};
    return {
      id: prenda.id || `item-${idx}`,
      title: prenda.nombre || 'Pieza de Atelier',
      brand: notas.brand || 'Atelier',
      material: prenda.estilo || item.posicion || '',
      image: prenda.fotoUrl || '',
      posicion: item.posicion || '',
    };
  });

  return {
    id: apiOutfit.id,
    title: apiOutfit.nombre,
    subtitle: apiOutfit.descripcion || '',
    occasion: apiOutfit.ocasion || 'Smart Casual',
    temporada: apiOutfit.temporada || 'Todo Año',
    esPropuestaEstilista: Boolean(apiOutfit.esPropuestaEstilista),
    notaEstilista: apiOutfit.notaEstilista || '',
    createdAt: apiOutfit.createdAt,
    itemsCount: items.length,
    items,
    raw: apiOutfit,
  };
}

/**
 * Get all outfits for current user
 */
export async function getOutfitsApi() {
  const response = await apiClient.get('/armario/outfits');
  return (response.data || []).map(formatOutfitFromApi);
}

/**
 * Get an outfit by ID
 */
export async function getOutfitByIdApi(id) {
  const response = await apiClient.get(`/armario/outfits/${id}`);
  return formatOutfitFromApi(response.data);
}

/**
 * Create a new outfit
 */
export async function createOutfitApi(payload) {
  const response = await apiClient.post('/armario/outfits', payload);
  return formatOutfitFromApi(response.data);
}

/**
 * Delete an outfit
 */
export async function deleteOutfitApi(id) {
  const response = await apiClient.delete(`/armario/outfits/${id}`);
  return response.data;
}
