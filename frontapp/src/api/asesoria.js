import apiClient from './client';

/**
 * Obtiene la disponibilidad de franjas horarias de 1 hora para una fecha (YYYY-MM-DD)
 */
export async function getDisponibilidadApi(fecha) {
  const response = await apiClient.get('/armario/asesoria/disponibilidad', {
    params: { fecha },
  });
  return response.data;
}

/**
 * Reserva una nueva cita de asesoría VIP de 1 hora
 */
export async function createAsesoriaApi({ fecha, horaInicio, motivo }) {
  const response = await apiClient.post('/armario/asesoria', {
    fecha,
    horaInicio,
    motivo,
  });
  return response.data;
}

/**
 * Lista las asesorías concertadas del usuario autenticado
 */
export async function getMisAsesoriasApi() {
  const response = await apiClient.get('/armario/asesoria/mis-asesorias');
  return response.data;
}

/**
 * Cancela una asesoría previamente concertada
 */
export async function cancelarAsesoriaApi(id) {
  const response = await apiClient.patch(`/armario/asesoria/${id}/cancelar`);
  return response.data;
}
