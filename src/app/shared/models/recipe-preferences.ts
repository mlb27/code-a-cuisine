/** Valid range and default value for generated recipe portions. */
export const RECIPE_PORTIONS = {
  default: 2,
  maximum: 12,
  minimum: 1,
} as const;

/** Valid range and default value for people cooking together. */
export const COOKING_PEOPLE = {
  default: 1,
  maximum: 3,
  minimum: 1,
} as const;

/** Cooking-time categories supported by recipe generation. */
export const COOKING_TIME_CATEGORIES = ['quick', 'medium', 'complex'] as const;

/** One selectable cooking-time category. */
export type CookingTimeCategory = (typeof COOKING_TIME_CATEGORIES)[number];

/** Cuisine styles supported by recipe generation. */
export const CUISINE_STYLES = [
  'german',
  'italian',
  'indian',
  'japanese',
  'gourmet',
  'fusion',
] as const;

/** One selectable cuisine style. */
export type CuisineStyle = (typeof CUISINE_STYLES)[number];

/** Diet preferences supported by recipe generation. */
export const DIET_PREFERENCES = ['vegetarian', 'vegan', 'keto', 'unrestricted'] as const;

/** One selectable diet preference. */
export type DietPreference = (typeof DIET_PREFERENCES)[number];
