export enum CategoryType {
  BOLSOS = 'bolsos',
  CALZADO = 'calzado',
  ROPA = 'ropa',
  ACCESORIOS = 'accesorios',
}

export interface Photo {
  id: string;
  filename: string;
  s3Key: string;
  url: string;
  isMain: boolean;
}

export interface Product {
  id?: string;
  nombre: string;
  categoria: CategoryType;
  fabricante?: string;
  tienda?: string;
  descripcion?: string;
  temporada?: string;
  precio?: string;
  enlaceSitio?: string;
  imagenUrl?: string;
  photos?: Photo[];
  createdAt?: string;
  updatedAt?: string;
}
