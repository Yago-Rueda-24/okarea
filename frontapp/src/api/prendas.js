import apiClient from './client';

/**
 * Category to TipoPrenda mapping
 */
export function mapCategoryToTipoPrenda(category) {
  if (!category) return 'otro';
  const c = category.toLowerCase();
  if (c.includes('chaqueta') || c.includes('blazer') || c.includes('abrigo')) {
    return 'abrigo';
  }
  if (c.includes('top') || c.includes('camisa') || c.includes('punto') || c.includes('jersey')) {
    return 'superior';
  }
  if (c.includes('pantal') || c.includes('falda') || c.includes('short')) {
    return 'inferior';
  }
  if (c.includes('calzado') || c.includes('zapato') || c.includes('mocas')) {
    return 'calzado';
  }
  if (c.includes('bolso') || c.includes('accesorio') || c.includes('joy')) {
    return 'accesorio';
  }
  return 'otro';
}

/**
 * TipoPrenda to UI category mapping
 */
export function mapTipoPrendaToCategory(tipo) {
  switch (tipo) {
    case 'superior':
      return 'Tops & Camisas';
    case 'inferior':
      return 'Pantalones & Faldas';
    case 'calzado':
      return 'Calzado';
    case 'abrigo':
      return 'Chaquetas & Blazers';
    case 'accesorio':
      return 'Bolsos & Accesorios';
    default:
      return 'Otros';
  }
}

/**
 * Formats backend Prenda entity into frontend representation
 */
export function formatPrendaFromApi(apiPrenda) {
  if (!apiPrenda) return null;
  const notas = apiPrenda.notasAdicionales || {};

  return {
    id: apiPrenda.id,
    ref: notas.ref || `VS-${(apiPrenda.id || '').toString().slice(0, 8).toUpperCase()}`,
    brand: notas.brand || 'Maison Atelier',
    title: apiPrenda.nombre,
    category: notas.category || mapTipoPrendaToCategory(apiPrenda.tipoPrenda),
    tipoPrenda: apiPrenda.tipoPrenda,
    size: notas.size || '38 FR',
    wearCount: notas.wearCount ?? 0,
    isFavorite: Boolean(notas.isFavorite),
    season: apiPrenda.temporada || 'Todo Año',
    palette: apiPrenda.color || 'Tierra & Neutros',
    status: notas.status || 'Limpio',
    image: apiPrenda.fotoUrl,
    detailImage: apiPrenda.fotoUrl,
    badges: notas.badges || [
      {
        text: mapTipoPrendaToCategory(apiPrenda.tipoPrenda).split(' ')[0],
        bg: 'bg-surface-container-lowest/90 text-primary font-semibold',
      },
    ],
    suggestedPairings: notas.suggestedPairings || [],
    raw: apiPrenda,
  };
}

/**
 * Get all garments for current user
 */
export async function getPrendasApi(filters = {}) {
  const response = await apiClient.get('/armario/prendas', { params: filters });
  return (response.data || []).map(formatPrendaFromApi);
}

/**
 * Get a single garment by ID
 */
export async function getPrendaByIdApi(id) {
  const response = await apiClient.get(`/armario/prendas/${id}`);
  return formatPrendaFromApi(response.data);
}

/**
 * Create a new garment
 */
export async function createPrendaApi(payload) {
  let response;
  if (payload instanceof FormData) {
    response = await apiClient.post('/armario/prendas', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } else {
    response = await apiClient.post('/armario/prendas', payload);
  }
  return formatPrendaFromApi(response.data);
}

/**
 * Update an existing garment
 */
export async function updatePrendaApi(id, data) {
  const response = await apiClient.patch(`/armario/prendas/${id}`, data);
  return formatPrendaFromApi(response.data);
}

/**
 * Delete a garment
 */
export async function deletePrendaApi(id) {
  const response = await apiClient.delete(`/armario/prendas/${id}`);
  return response.data;
}
