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
      brand: notas.brand || 'Vestiaire Studio',
      material: prenda.estilo || item.posicion || 'Tejido Noble',
      image: prenda.fotoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgS8-8hZjsFo9jdf8gI0s6w_79-3xFfRQ7-XP3oyeNspmnV-4ktwcU1sI4OGTxPb9H6gCjnnl0S5whAlfvbq_FD2Bv6yybw-JBr08pXsEEGCuwsoebRm3BjT-P_gHYylqFUVV7JhzqB5IAIQKq7z9vk6imapKbWa1YZMditC2QYA6nd2UmIoa42hat_OGN2XvLT1eipUO1CI8nMi13K5anv_uLbf8JyACKnvJXta8',
    };
  });

  return {
    id: apiOutfit.id,
    title: apiOutfit.nombre,
    subtitle: apiOutfit.descripcion || 'Composición sartorial de archivo.',
    occasion: apiOutfit.ocasion || 'Smart Casual',
    weather: apiOutfit.temporada ? `${apiOutfit.temporada}` : '18°C Suave',
    harmonyScore: 94,
    harmonyLabel: 'Excelente',
    lastWorn: apiOutfit.esPropuestaEstilista ? 'Propuesta Estilista' : 'Guardado recientemente',
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
