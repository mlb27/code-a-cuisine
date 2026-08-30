import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';

import { RecipeGenerationService } from '../services/recipe-generation.service';
import { RecipeGeneratorService } from '../services/recipe-generator.service';

/** Keeps the preferences step behind a valid ingredient selection. */
export const ingredientsRequiredGuard: CanActivateFn = (): boolean | UrlTree => {
  const recipeGeneratorService = inject(RecipeGeneratorService);
  const router = inject(Router);

  return recipeGeneratorService.hasIngredients() || router.createUrlTree(['/generator']);
};

/** Keeps the loading step behind one complete recipe-generation request. */
export const generationRequestRequiredGuard: CanActivateFn = (): boolean | UrlTree => {
  const recipeGeneratorService = inject(RecipeGeneratorService);
  const router = inject(Router);

  return recipeGeneratorService.canGenerate() || router.createUrlTree(['/generator/preferences']);
};

/** Keeps the result page behind a successful recipe generation. */
export const generatedRecipesRequiredGuard: CanActivateFn = (): boolean | UrlTree => {
  const recipeGenerationService = inject(RecipeGenerationService);
  const router = inject(Router);

  return recipeGenerationService.hasRecipes() || router.createUrlTree(['/generator']);
};

/** Opens recipe details only for a generated recipe in the current session. */
export const generatedRecipeRequiredGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree => {
  const recipeGenerationService = inject(RecipeGenerationService);
  const router = inject(Router);
  const recipeId: string | null = route.paramMap.get('recipeId');

  if (recipeGenerationService.getRecipeById(recipeId)) return true;
  return recipeGenerationService.hasRecipes()
    ? router.createUrlTree(['/results'])
    : router.createUrlTree(['/generator']);
};
