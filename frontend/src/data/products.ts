import bolso2 from '../assets/bolsos/bolso2.webp';
import ropa1 from '../assets/ropa/ropa1.png';
import ropa2 from '../assets/ropa/ropa2.png';
import ropa3 from '../assets/ropa/ropa3.png';
import ropa4 from '../assets/ropa/ropa4.png';

export interface Product {
  id: string;
  nombre: string;
  fabricante: string;
  tienda: string;
  descripcion: string;
  temporada?: string;
  precio?: string;
  enlaceSitio: string;
  imagen: string;
}

export const products: Record<string, Product> = {
  'kenza-small-cow': {
    id: 'kenza-small-cow',
    nombre: 'Kenza Small Cow',
    fabricante: 'oliviamareque',
    tienda: 'Olivia Mareque',
    descripcion: 'Bolso de mano estilo baguette confeccionado con acabado efecto piel de vaca (cow print). Diseño exclusivo, compacto y sofisticado con cierre de cremallera metálica y asa ajustable.',
    temporada: 'Colección 2026',
    precio: '115,00 €',
    enlaceSitio: 'https://oliviamareque.com',
    imagen: bolso2,
  },
  'bolso-classic-cream': {
    id: 'bolso-classic-cream',
    nombre: 'Bolso Classic Cream',
    fabricante: 'OKAREA Studio',
    tienda: 'OKAREA Studio',
    descripcion: 'Bolso estructurado de líneas mínimas en tono crema suave. Ideal para combinar en cualquier ocasión diaria o de noche.',
    temporada: 'Primavera / Verano 2026',
    precio: '89,90 €',
    enlaceSitio: 'https://vinted.es',
    imagen: bolso2,
  },
  'camisa-lino-premium': {
    id: 'camisa-lino-premium',
    nombre: 'Camisa Lino Premium',
    fabricante: 'OKAREA Studio',
    tienda: 'OKAREA Studio',
    descripcion: 'Confeccionada en 100% lino orgánico de alta calidad, esta camisa ofrece una frescura excepcional y una caída fluida.',
    temporada: 'Primavera / Verano 2026',
    precio: '49,90 €',
    enlaceSitio: 'https://example.com/camisa-lino',
    imagen: ropa1,
  },
  'jersey-lana-ivory': {
    id: 'jersey-lana-ivory',
    nombre: 'Jersey Lana Ivory',
    fabricante: 'Massimo Dutti',
    tienda: 'Massimo Dutti',
    descripcion: 'Jersey de punto grueso en tono marfil con cuello alto vuelto y acabado ultrasuave.',
    temporada: 'Otoño / Invierno 2026',
    precio: '69,90 €',
    enlaceSitio: 'https://massimodutti.com',
    imagen: ropa2,
  },
  'gabardina-clasica': {
    id: 'gabardina-clasica',
    nombre: 'Gabardina Clásica',
    fabricante: 'Zara',
    tienda: 'Zara',
    descripcion: 'Gabardina de corte cruzado resistente al agua con cinturón ajustable y solapas anchas.',
    temporada: 'Primavera 2026',
    precio: '129,00 €',
    enlaceSitio: 'https://zara.com',
    imagen: ropa3,
  },
  'pantalon-lino-oliva': {
    id: 'pantalon-lino-oliva',
    nombre: 'Pantalón Lino Oliva',
    fabricante: 'Mango',
    tienda: 'Mango',
    descripcion: 'Pantalón de pernera ancha con cintura elástica confeccionado en mezcla de lino en verde oliva.',
    temporada: 'Verano 2026',
    precio: '59,90 €',
    enlaceSitio: 'https://mango.com',
    imagen: ropa4,
  },
};

export const getProductById = (id?: string): Product => {
  if (id && products[id]) {
    return products[id];
  }
  // Default fallback product if ID not found
  return products['kenza-small-cow'];
};
