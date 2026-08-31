import { GeneratedRecipe } from './generated-recipe';
import { CuisineStyle } from './recipe-preferences';

/** Supported server-side orders for public recipe lists. */
export type RecipeSortOrder = 'latest' | 'likes';

/** Filters and pagination values accepted by the public recipe endpoint. */
export interface RecipeListQuery {
  cuisineStyle?: CuisineStyle;
  page?: number;
  pageSize?: number;
  sort?: RecipeSortOrder;
}

/** Pagination metadata returned with one recipe page. */
export interface RecipePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Successful response containing public recipes from Supabase. */
export interface RecipeListResponse {
  pagination: RecipePagination;
  recipes: GeneratedRecipe[];
  success: true;
}
