/** Valid range and default value for generated recipe portions. */
export const RECIPE_PORTIONS = {
  default: 2,
  maximum: 12,
  minimum: 1,
} as const;

/** Cooking-time categories supported by recipe generation. */
export const COOKING_TIME_CATEGORIES = ['quick', 'medium', 'complex'] as const;

/** One selectable cooking-time category. */
export type CookingTimeCategory = (typeof COOKING_TIME_CATEGORIES)[number];
