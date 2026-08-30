import { IngredientDraft } from './ingredient';
import { CookingTimeCategory, CuisineStyle, DietPreference } from './recipe-preferences';

/** JSON payload sent to the recipe-generation workflow. */
export interface RecipeGenerationRequest {
  cookingPeopleCount: number;
  cookingTime: CookingTimeCategory;
  cuisineStyle: CuisineStyle;
  dietPreference: DietPreference;
  ingredients: IngredientDraft[];
  portionCount: number;
}
