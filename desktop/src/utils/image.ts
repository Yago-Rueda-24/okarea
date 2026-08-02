import { API_BASE_URL } from '../config/api';

/**
 * Formatea URLs de imágenes provenientes de S3/MinIO o del backend para garantizar
 * que sean accesibles en la aplicación de Escritorio (Electron).
 */
export function formatImageUrl(url?: string | null): string {
  if (!url) return '';

  // Si es un Data URL, Blob URL o URL completa externa, devolver directamente
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // 1. Si existe una anulación explícita por variable de entorno VITE_S3_PUBLIC_URL
  const s3PublicUrl = import.meta.env.VITE_S3_PUBLIC_URL;
  if (s3PublicUrl) {
    const cleanPublicUrl = s3PublicUrl.replace(/\/$/, '');
    if (url.includes('localhost:9000') || url.includes('minio:9000') || url.includes('://minio/')) {
      return url
        .replace(/^https?:\/\/localhost:9000/, cleanPublicUrl)
        .replace(/^https?:\/\/minio:9000/, cleanPublicUrl)
        .replace(/^https?:\/\/minio/, cleanPublicUrl);
    }
  }

  // 2. Extraer el host del servidor API desde API_BASE_URL
  let apiHost = '';
  try {
    if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
      const parsedUrl = new URL(API_BASE_URL);
      apiHost = parsedUrl.hostname;
    }
  } catch (e) {
    // Ignorar error de parsing
  }

  // Verificar si el servidor API configurado es remoto (diferente de localhost / 127.0.0.1 / minio)
  const isRemoteProd = Boolean(
    apiHost &&
    apiHost !== 'localhost' &&
    apiHost !== '127.0.0.1' &&
    apiHost !== 'minio'
  );

  if (isRemoteProd) {
    // Si la app de Electron apunta a un backend de producción (ej. okarea.es),
    // reemplazar localhost:9000 o minio:9000 por ${apiHost}:9000
    if (url.includes('localhost:9000')) {
      return url.replace('localhost:9000', `${apiHost}:9000`);
    }
    if (url.includes('minio:9000')) {
      return url.replace('minio:9000', `${apiHost}:9000`);
    }
    if (url.includes('://minio/')) {
      return url.replace('://minio/', `://${apiHost}:9000/`);
    }
  } else {
    // En desarrollo local, mapear el nombre interno del contenedor Docker 'minio' a 'localhost'
    if (url.includes('minio:9000')) {
      return url.replace('minio:9000', 'localhost:9000');
    }
    if (url.includes('://minio/')) {
      return url.replace('://minio/', '://localhost:9000/');
    }
  }

  return url;
}
