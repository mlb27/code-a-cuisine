import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

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
