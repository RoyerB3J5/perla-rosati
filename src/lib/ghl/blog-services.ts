// src/lib/ghl/blog-services.ts
//
// Estas 3 funciones son las 3 queries que necesitas. En Vercel con SSR,
// cada una se ejecuta en el momento en que un usuario visita la página
// correspondiente (dentro de la función serverless) — no en build time.
import { ghlFetch, GHLApiError } from "./client";
import {
  mapPostListItemToCard,
  mapPostDetailToDTO,
  mapCategoryToDTO,
  ALL_CATEGORY,
} from "./mapper";
import type {
  GHLPostListResponseRaw,
  GHLPostDetailResponseRaw,
  GHLCategoriesResponseRaw,
  BlogCardDTO,
  BlogPostDetailDTO,
  CategoryDTO,
  PaginatedResult,
} from "./types";

const LOCATION_ID = import.meta.env.GHL_LOCATION_ID;
const BLOG_ID = import.meta.env.GHL_BLOG_ID;

const POSTS_PAGE_SIZE = 9;

/**
 * Query 1: página de posts publicados. Se llama en cada visita a /blog.
 */
export async function getPostsPage(
  page: number = 1,
): Promise<PaginatedResult<BlogCardDTO>> {
  const data = await ghlFetch<GHLPostListResponseRaw>("/blogs/posts/all", {
    params: {
      locationId: LOCATION_ID,
      blogId: BLOG_ID,
      limit: POSTS_PAGE_SIZE,
      offset: (page - 1) * POSTS_PAGE_SIZE,
      status: "PUBLISHED",
    },
  });

  return {
    items: data.blogs.map(mapPostListItemToCard),
    total: data.count,
    page,
    pageSize: POSTS_PAGE_SIZE,
    totalPages: Math.ceil(data.count / POSTS_PAGE_SIZE),
  };
}

/**
 * Query 2: post individual por su _id. Se llama en cada visita a /blog/[id].
 * Devuelve null si no existe (404 manejado en la página).
 */
export async function getPostById(
  postId: string,
): Promise<BlogPostDetailDTO | null> {
  try {
    const data = await ghlFetch<GHLPostDetailResponseRaw>(
      `/blogs/posts/${postId}`,
      { params: { locationId: LOCATION_ID } },
    );
    return mapPostDetailToDTO(data.blogPost);
  } catch (err) {
    if (err instanceof GHLApiError) return null;
    throw err;
  }
}

/**
 * Query 3: categorías para la barra de filtros. Se llama junto con getPostsPage.
 */
export async function getCategories(): Promise<CategoryDTO[]> {
  const data = await ghlFetch<GHLCategoriesResponseRaw>("/blogs/categories", {
    params: { locationId: LOCATION_ID, limit: 8, offset: 0 },
  });

  return [ALL_CATEGORY, ...data.categories.map(mapCategoryToDTO)];
}
