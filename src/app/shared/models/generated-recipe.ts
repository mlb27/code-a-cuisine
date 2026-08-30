import { IngredientUnit } from './ingredient';
import { CookingTimeCategory, CuisineStyle, DietPreference } from './recipe-preferences';

/** Additional units the AI may use for basic recipe ingredients. */
export type GeneratedIngredientUnit =
  IngredientUnit | 'clove' | 'kilogram' | 'milliliter' | 'pinch' | 'tablespoon' | 'teaspoon';

/** One ingredient contained in a generated recipe. */
export interface GeneratedIngredient {
  amount: number;
  name: string;
  unit: GeneratedIngredientUnit;
}

/** Macronutrients generated either per portion or for the whole recipe. */
export interface RecipeNutrition {
  caloriesKcal: number;
  carbohydratesGrams: number;
  carbohydratesPercentage: number;
  fatGrams: number;
  fatPercentage: number;
  proteinGrams: number;
  proteinPercentage: number;
}

/** One chronological instruction assigned to a member of the cooking team. */
export interface GeneratedRecipeStep {
  assignedCook: number;
  canRunInParallel: boolean;
  description: string;
  durationMinutes: number;
  number: number;
  title: string;
}

/** Complete recipe returned by the generation workflow. */
export interface GeneratedRecipe {
  additionalIngredients: GeneratedIngredient[];
  availableIngredients: GeneratedIngredient[];
  cookingPeopleCount: number;
  cookingTimeCategory: CookingTimeCategory;
  cookingTimeMinutes: number;
  createdAt: string;
  cuisineStyle: CuisineStyle;
  dietPreference: DietPreference;
  generationId: string;
  id: string;
  imageUrl: string | null;
  isPublic: boolean;
  likesCount: number;
  nutritionPerPortion: RecipeNutrition;
  nutritionTotal: RecipeNutrition;
  portionCount: number;
  steps: GeneratedRecipeStep[];
  summary: string;
  title: string;
  usedIngredientPercentage: number;
}

/** Remaining daily generation slots after one successful request. */
export interface RemainingGenerations {
  ip: number;
  systemWide: number;
}

/** Successful response returned by the n8n recipe workflow. */
export interface RecipeGenerationResponse {
  generationId: string;
  recipes: GeneratedRecipe[];
  remainingGenerations?: RemainingGenerations;
  success: true;
}

/** Successful response returned when one stored recipe is requested by ID. */
export interface RecipeLookupResponse {
  recipe: GeneratedRecipe;
  success: true;
}

/** Normalized error information displayed when recipe generation fails. */
export interface RecipeGenerationFailure {
  code: string;
  message: string;
  validationErrors: string[];
}
