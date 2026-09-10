// src/lib/ghl/types.ts
// Tipos "raw" tal cual los devuelve GoHighLevel, y los DTO limpios que
// consume el frontend. Nunca uses los tipos Raw fuera de blog-services.ts / mapper.ts.

// ---------- RAW (tal cual responde GHL) ----------

export interface GHLCategoryRaw {
  _id: string;
  label: string; // ej: "mind-body-spirit"
  urlSlug: string;
}

export interface GHLPostListItemRaw {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAltText?: string;
  status: string;
  categories: GHLCategoryRaw[]; // en el listado vienen como objetos ya resueltos
  urlSlug: string;
  publishedAt: string | null;
  updatedAt: string;
  updatedBy?: string;
}

export interface GHLPostListResponseRaw {
  blogs: GHLPostListItemRaw[];
  count: number; // total, para paginación
}

export interface GHLPostDetailRaw {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAltText?: string;
  status: string;
  categories: string[]; // en el detalle SOLO vienen los IDs (no objetos)
  rawHTML: string;
  publishedAt: string | null;
  updatedAt: string;
  readTimeInMinutes: number;
}

export interface GHLPostDetailResponseRaw {
  blogPost: GHLPostDetailRaw;
}

export interface GHLCategoriesResponseRaw {
  categories: GHLCategoryRaw[];
  count: number;
}

// ---------- DTO (lo que recibe el frontend) ----------
// Forma solicitada: date, id, title, description, image, idCategory.

export interface BlogCardDTO {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string; // formateada, no ISO
  idCategory: string; // id de la primera categoría del post ("" si no tiene)
}

export interface BlogPostDetailDTO {
  id: string;
  image: string;
  date: string;
  autor: string;
  title: string;
  content: string | TrustedHTML; // HTML completo
}

export interface CategoryDTO {
  id: string;
  label: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
