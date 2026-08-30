import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

import {
  RECIPE_GENERATION_WEBHOOK_URL,
  RECIPE_LOOKUP_WEBHOOK_URL,
} from '../config/recipe-api.config';
import {
  GeneratedRecipe,
  RecipeGenerationFailure,
  RecipeGenerationResponse,
  RecipeLookupResponse,
} from '../models/generated-recipe';
import { RecipeGenerationRequest } from '../models/recipe-generation-request';
import { SessionStorageService } from './session-storage.service';

const GENERATION_RESPONSE_STORAGE_KEY = 'code-a-cuisine-generation-response';

/** Calls the recipe workflow and keeps its latest successful response available. */
@Injectable({
  providedIn: 'root',
})
export class RecipeGenerationService {
  private readonly httpClient = inject(HttpClient);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly webhookUrl = inject(RECIPE_GENERATION_WEBHOOK_URL);
  private readonly lookupWebhookUrl = inject(RECIPE_LOOKUP_WEBHOOK_URL);
  private readonly responseState: WritableSignal<RecipeGenerationResponse | null> = signal(
    this.loadResponse(),
  );
  private readonly restoredRecipeState: WritableSignal<GeneratedRecipe | null> = signal(null);

  public readonly response: Signal<RecipeGenerationResponse | null> =
    this.responseState.asReadonly();
  public readonly recipes: Signal<GeneratedRecipe[]> = computed(
    (): GeneratedRecipe[] => this.responseState()?.recipes ?? [],
  );
  public readonly hasRecipes: Signal<boolean> = computed(
    (): boolean => this.recipes().length === 3,
  );

  /** Starts recipe generation and stores a validated successful response. */
  public generateRecipes(request: RecipeGenerationRequest): Observable<RecipeGenerationResponse> {
    this.clearResults();
    return this.httpClient
      .post<RecipeGenerationResponse>(this.webhookUrl, request)
      .pipe(tap((response: RecipeGenerationResponse): void => this.storeResponse(response)));
  }

  /** Restores one complete generation from persistent recipe storage. */
  public loadGeneration(generationId: string): Observable<RecipeGenerationResponse> {
    const currentResponse: RecipeGenerationResponse | null = this.responseState();
    if (currentResponse?.generationId === generationId && this.hasRecipes()) {
      return of(currentResponse);
    }

    return this.httpClient
      .get<RecipeGenerationResponse>(this.lookupWebhookUrl, {
        params: { generationId },
      })
      .pipe(tap((response: RecipeGenerationResponse): void => this.storeResponse(response)));
  }

  /** Restores one public recipe from persistent recipe storage. */
  public loadRecipe(recipeId: string): Observable<GeneratedRecipe> {
    const cachedRecipe: GeneratedRecipe | null = this.getRecipeById(recipeId);
    if (cachedRecipe) return of(cachedRecipe);

    return this.httpClient
      .get<RecipeLookupResponse>(this.lookupWebhookUrl, {
        params: { recipeId },
      })
      .pipe(
        map((response: RecipeLookupResponse): GeneratedRecipe => {
          if (response.success !== true || !this.isGeneratedRecipe(response.recipe)) {
            throw new Error('The recipe workflow returned an invalid recipe.');
          }

          this.restoredRecipeState.set(response.recipe);
          return response.recipe;
        }),
      );
  }

  /** Returns one generated recipe from the current session. */
  public getRecipeById(recipeId: string | null): GeneratedRecipe | null {
    if (!recipeId) return null;
    return (
      this.recipes().find((recipe: GeneratedRecipe): boolean => recipe.id === recipeId) ??
      (this.restoredRecipeState()?.id === recipeId ? this.restoredRecipeState() : null)
    );
  }

  /** Converts HTTP and workflow errors into safe user-facing information. */
  public getFailure(error: unknown): RecipeGenerationFailure {
    const fallbackFailure: RecipeGenerationFailure = {
      code: 'GENERATION_FAILED',
      message: 'We could not generate your recipes. Please try again.',
      validationErrors: [],
    };

    if (!(error instanceof HttpErrorResponse)) return fallbackFailure;
    if (error.status === 0) {
      return {
        ...fallbackFailure,
        code: 'WORKFLOW_UNAVAILABLE',
        message: 'The recipe service is currently unavailable. Please try again shortly.',
      };
    }

    const responseBody: unknown = error.error;
    if (typeof responseBody !== 'object' || responseBody === null) return fallbackFailure;

    const failure = responseBody as Partial<RecipeGenerationFailure>;
    return {
      code: typeof failure.code === 'string' ? failure.code : fallbackFailure.code,
      message: typeof failure.message === 'string' ? failure.message : fallbackFailure.message,
      validationErrors: Array.isArray(failure.validationErrors)
        ? failure.validationErrors.filter(
            (validationError: unknown): validationError is string =>
              typeof validationError === 'string',
          )
        : [],
    };
  }

  /** Removes a previous response before another generation attempt begins. */
  public clearResults(): void {
    this.responseState.set(null);
    this.sessionStorageService.remove(GENERATION_RESPONSE_STORAGE_KEY);
  }

  /** Validates and persists one successful workflow response. */
  private storeResponse(response: RecipeGenerationResponse): void {
    if (!this.isGenerationResponse(response)) {
      throw new Error('The recipe workflow returned an invalid response.');
    }

    this.responseState.set(response);
    this.sessionStorageService.set(GENERATION_RESPONSE_STORAGE_KEY, JSON.stringify(response));
  }

  /** Restores the latest valid response from the current browser session. */
  private loadResponse(): RecipeGenerationResponse | null {
    try {
      const storedValue: string | null = this.sessionStorageService.get(
        GENERATION_RESPONSE_STORAGE_KEY,
      );
      if (!storedValue) return null;
      const response: unknown = JSON.parse(storedValue);
      return this.isGenerationResponse(response) ? response : null;
    } catch {
      return null;
    }
  }

  /** Checks the minimum response shape required by results and detail pages. */
  private isGenerationResponse(value: unknown): value is RecipeGenerationResponse {
    if (typeof value !== 'object' || value === null) return false;
    const response = value as Partial<RecipeGenerationResponse>;
    return (
      response.success === true &&
      typeof response.generationId === 'string' &&
      Array.isArray(response.recipes) &&
      response.recipes.length === 3 &&
      response.recipes.every((recipe: GeneratedRecipe): boolean => this.isGeneratedRecipe(recipe))
    );
  }

  /** Checks the minimum recipe shape required by results and detail pages. */
  private isGeneratedRecipe(value: unknown): value is GeneratedRecipe {
    if (typeof value !== 'object' || value === null) return false;
    const recipe: Partial<GeneratedRecipe> = value as Partial<GeneratedRecipe>;
    return typeof recipe.id === 'string' && typeof recipe.title === 'string';
  }
}
