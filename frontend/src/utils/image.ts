import { API_BASE_URL } from '../config/api';

/**
 * Formatea URLs de imágenes provenientes de S3/MinIO o del backend para garantizar
 * que sean accesibles según el entorno (Desarrollo Local vs Producción Remota).
 */
export function formatImageUrl(url?: string | null): string {
  if (!url) return '';

  // Data URLs o Blob URLs se devuelven tal cual
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // 1. Si existe una anulación explícita por variable de entorno VITE_S3_PUBLIC_URL
  const s3PublicUrl = import.meta.env.VITE_S3_PUBLIC_URL;
  if (s3PublicUrl) {
    const cleanPublicUrl = s3PublicUrl.replace(/\/$/, '');
    if (url.includes('localhost:9000') || url.includes('minio:9000') || url.includes('://minio/') || url.includes(':9000/')) {
      return url
        .replace(/^https?:\/\/[^/]+:9000/, cleanPublicUrl)
        .replace(/^https?:\/\/minio:9000/, cleanPublicUrl)
        .replace(/^https?:\/\/minio\//, `${cleanPublicUrl}/`);
    }
  }

  // 2. Determinar host y protocolo desde API_BASE_URL o window.location
  let apiHost = '';
  let protocol = 'http:';
  try {
    if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
      const parsedUrl = new URL(API_BASE_URL);
      apiHost = parsedUrl.hostname;
      protocol = parsedUrl.protocol;
    }
  } catch (e) {
    // ignorar error de parsing
  }

  if (!apiHost && typeof window !== 'undefined' && window.location && window.location.hostname) {
    apiHost = window.location.hostname;
    protocol = window.location.protocol;
  }

  const isDev = !apiHost || apiHost === 'localhost' || apiHost === '127.0.0.1' || apiHost === 'minio';

  if (isDev) {
    // EN DESARROLLO LOCAL:
    // Si la URL provista apunta a producción (ej: https://okarea.es/okarea-catalog/...), la redirigimos a MinIO local en localhost:9000
    let formatted = url;

    if (formatted.includes('okarea.es/okarea-catalog/')) {
      formatted = formatted.replace(/https?:\/\/okarea\.es\/okarea-catalog\//g, 'http://localhost:9000/okarea-catalog/');
    }

    if (formatted.includes('minio:9000')) {
      formatted = formatted.replace(/minio:9000/g, 'localhost:9000');
    }

    if (formatted.includes('://minio/')) {
      formatted = formatted.replace(/:\/\/minio\//g, '://localhost:9000/');
    }

    return formatted;
  } else {
    // EN PRODUCCIÓN REMOTA:
    // Redirigir puertos locales :9000 o nombres de contenedor 'minio' al dominio HTTPS público de producción
    const targetBase = `${protocol}//${apiHost}`;

    return url
      .replace(/^https?:\/\/[^/]+:9000/, targetBase)
      .replace(/^https?:\/\/minio:9000/, targetBase)
      .replace(/^https?:\/\/minio\//, `${targetBase}/`);
  }
}

export const DEFAULT_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='%2364748b'%3EOKAREA%3C/text%3E%3C/svg%3E";
