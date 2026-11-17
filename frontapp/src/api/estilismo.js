import apiClient from './client';

/**
 * Create a new styling / VIP consultation request
 */
export async function createStylingRequestApi({
  tipoServicio,
  notas,
  fechaPreferida,
  horaPreferida,
}) {
  const response = await apiClient.post('/armario/estilismo/solicitudes', {
    tipoServicio: tipoServicio || 'Asesoría Integral',
    notas,
    fechaPreferida,
    horaPreferida,
  });
  return response.data;
}

/**
 * List current user's styling requests
 */
export async function getStylingRequestsApi() {
  const response = await apiClient.get('/armario/estilismo/solicitudes');
  return response.data;
}

/**
 * List clients for stylist view
 */
export async function listClientsApi() {
  const response = await apiClient.get('/armario/estilismo/clientes');
  return response.data;
}
