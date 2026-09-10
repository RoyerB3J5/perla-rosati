// src/lib/ghl/mapper.ts
import type {
  GHLCategoryRaw,
  GHLPostListItemRaw,
  GHLPostDetailRaw,
  BlogCardDTO,
  BlogPostDetailDTO,
  CategoryDTO,
} from "./types";

const FALLBACK_IMAGE = "/images/blog-placeholder.jpg";
const DEFAULT_AUTHOR = "Enyermy";

export const ALL_CATEGORY: CategoryDTO = { id: "all", label: "All" };

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Item del listado de GHL -> tarjeta que consume el frontend. */
export function mapPostListItemToCard(raw: GHLPostListItemRaw): BlogCardDTO {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description,
    image: raw.imageUrl ?? FALLBACK_IMAGE,
    date: formatDate(raw.publishedAt ?? raw.updatedAt),
    // El listado trae categorías como objetos; tomamos la primera como
    // categoría "principal" del post.
    idCategory: raw.categories?.[0]?._id ?? "",
  };
}

/** Detalle de un post de GHL -> DTO de página individual. */
export function mapPostDetailToDTO(raw: GHLPostDetailRaw): BlogPostDetailDTO {
  return {
    id: raw._id,
    title: raw.title,
    description: raw.description,
    image: raw.imageUrl ?? FALLBACK_IMAGE,
    date: formatDate(raw.publishedAt ?? raw.updatedAt),
    // OJO: en el detalle, `categories` son solo IDs (string[]), a
    // diferencia del listado donde son objetos completos.
    autor: DEFAULT_AUTHOR,
    content: raw.rawHTML,
  };
}

export function mapCategoryToDTO(raw: GHLCategoryRaw): CategoryDTO {
  return {
    id: raw._id,
    label: toTitleCase(raw.label),
  };
}
