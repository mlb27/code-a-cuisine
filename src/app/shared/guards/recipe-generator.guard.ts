import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

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

/** Restores a stored generation before opening its result page. */
export const generatedRecipesRequiredGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const recipeGenerationService = inject(RecipeGenerationService);
  const router = inject(Router);
  const generationId: string | null = route.paramMap.get('generationId');

  if (!generationId) return router.createUrlTree(['/generator']);
  if (
    recipeGenerationService.response()?.generationId === generationId &&
    recipeGenerationService.hasRecipes()
  ) {
    return true;
  }

  return recipeGenerationService.loadGeneration(generationId).pipe(
    map((): boolean => true),
    catchError((): Observable<UrlTree> => of(router.createUrlTree(['/generator']))),
  );
};

/** Redirects the previous result URL to the latest generation in this tab. */
export const latestGeneratedResultsGuard: CanActivateFn = (): UrlTree => {
  const recipeGenerationService = inject(RecipeGenerationService);
  const router = inject(Router);
  const generationId: string | undefined = recipeGenerationService.response()?.generationId;

  return generationId
    ? router.createUrlTree(['/results', generationId])
    : router.createUrlTree(['/generator']);
};

/** Opens recipe details only for a generated recipe in the current session. */
export const generatedRecipeRequiredGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const recipeGenerationService = inject(RecipeGenerationService);
  const router = inject(Router);
  const recipeId: string | null = route.paramMap.get('recipeId');

  if (!recipeId) return router.createUrlTree(['/generator']);
  if (recipeGenerationService.getRecipeById(recipeId)) return true;

  return recipeGenerationService.loadRecipe(recipeId).pipe(
    map((): boolean => true),
    catchError((): Observable<UrlTree> => of(router.createUrlTree(['/generator']))),
  );
};
