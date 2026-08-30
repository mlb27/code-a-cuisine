import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import {
  Ingredient,
  IngredientDraft,
  IngredientSaveResult,
  INGREDIENT_UNIT_OPTIONS,
  IngredientUnit,
} from '../models/ingredient';
import { RecipeGenerationRequest } from '../models/recipe-generation-request';
import {
  COOKING_PEOPLE,
  COOKING_TIME_CATEGORIES,
  CookingTimeCategory,
  CUISINE_STYLES,
  CuisineStyle,
  DIET_PREFERENCES,
  DietPreference,
  RECIPE_PORTIONS,
} from '../models/recipe-preferences';
import { SessionStorageService } from './session-storage.service';

const COOKING_PEOPLE_STORAGE_KEY: string = 'code-a-cuisine-generator-cooking-people';
const COOKING_TIME_STORAGE_KEY: string = 'code-a-cuisine-generator-cooking-time';
const CUISINE_STYLE_STORAGE_KEY: string = 'code-a-cuisine-generator-cuisine-style';
const DIET_PREFERENCE_STORAGE_KEY: string = 'code-a-cuisine-generator-diet-preference';
const INGREDIENT_STORAGE_KEY: string = 'code-a-cuisine-generator-ingredients';
const PORTION_STORAGE_KEY: string = 'code-a-cuisine-generator-portions';

/** Manages the ingredient state shared by the recipe-generator steps. */
@Injectable({
  providedIn: 'root',
})
export class RecipeGeneratorService {
  private readonly storageService = inject(SessionStorageService);
  private readonly cookingPeopleCountState: WritableSignal<number> = signal(
    this.loadCookingPeopleCount(),
  );
  private readonly cookingTimeState: WritableSignal<CookingTimeCategory | null> = signal(
    this.loadCookingTime(),
  );
  private readonly cuisineStyleState: WritableSignal<CuisineStyle | null> = signal(
    this.loadCuisineStyle(),
  );
  private readonly dietPreferenceState: WritableSignal<DietPreference | null> = signal(
    this.loadDietPreference(),
  );
  private readonly ingredientsState: WritableSignal<Ingredient[]> = signal(this.loadIngredients());
  private readonly portionCountState: WritableSignal<number> = signal(this.loadPortionCount());
  private readonly editingIngredientId: WritableSignal<number | null> = signal(null);
  private nextIngredientId: number = this.getNextIngredientId();

  public readonly cookingPeopleCount: Signal<number> = this.cookingPeopleCountState.asReadonly();
  public readonly cookingTime: Signal<CookingTimeCategory | null> =
    this.cookingTimeState.asReadonly();
  public readonly cuisineStyle: Signal<CuisineStyle | null> = this.cuisineStyleState.asReadonly();
  public readonly dietPreference: Signal<DietPreference | null> =
    this.dietPreferenceState.asReadonly();
  public readonly ingredients: Signal<Ingredient[]> = this.ingredientsState.asReadonly();
  public readonly portionCount: Signal<number> = this.portionCountState.asReadonly();
  public readonly hasIngredients: Signal<boolean> = computed(
    (): boolean => this.ingredientsState().length > 0,
  );
  public readonly generationRequest: Signal<RecipeGenerationRequest | null> = computed(
    (): RecipeGenerationRequest | null => this.createGenerationRequest(),
  );
  public readonly canGenerate: Signal<boolean> = computed(
    (): boolean => this.generationRequest() !== null,
  );
  public readonly editingIngredient: Signal<Ingredient | null> = computed((): Ingredient | null => {
    const ingredientId: number | null = this.editingIngredientId();
    return this.findIngredient(ingredientId);
  });

  /** Adds a new ingredient or updates the currently edited entry. */
  public saveIngredient(draft: IngredientDraft): IngredientSaveResult {
    const normalizedDraft: IngredientDraft = this.normalizeDraft(draft);
    const ingredientId: number | null = this.editingIngredientId();

    if (!this.isDraftValid(normalizedDraft)) return 'invalid';
    if (this.hasDuplicateName(normalizedDraft.name, ingredientId)) return 'duplicate';

    ingredientId === null
      ? this.addIngredient(normalizedDraft)
      : this.updateIngredient(ingredientId, normalizedDraft);
    this.cancelEditing();
    return ingredientId === null ? 'added' : 'updated';
  }

  /** Selects one ingredient so its values can be edited. */
  public startEditing(ingredientId: number): void {
    if (
      this.ingredientsState().some(
        (ingredient: Ingredient): boolean => ingredient.id === ingredientId,
      )
    ) {
      this.editingIngredientId.set(ingredientId);
    }
  }

  /** Clears the active ingredient editing state. */
  public cancelEditing(): void {
    this.editingIngredientId.set(null);
  }

  /** Stores a valid number of people cooking during the current session. */
  public setCookingPeopleCount(cookingPeopleCount: number): void {
    if (!this.isValidCookingPeopleCount(cookingPeopleCount)) return;
    this.cookingPeopleCountState.set(cookingPeopleCount);
    this.persistCookingPeopleCount(cookingPeopleCount);
  }

  /** Stores the cooking-time category for the current generator session. */
  public setCookingTime(cookingTime: CookingTimeCategory): void {
    if (!this.isCookingTimeCategory(cookingTime)) return;
    this.cookingTimeState.set(cookingTime);
    this.persistCookingTime(cookingTime);
  }

  /** Stores the cuisine style for the current generator session. */
  public setCuisineStyle(cuisineStyle: CuisineStyle): void {
    if (!this.isCuisineStyle(cuisineStyle)) return;
    this.cuisineStyleState.set(cuisineStyle);
    this.persistCuisineStyle(cuisineStyle);
  }

  /** Stores the diet preference for the current generator session. */
  public setDietPreference(dietPreference: DietPreference): void {
    if (!this.isDietPreference(dietPreference)) return;
    this.dietPreferenceState.set(dietPreference);
    this.persistDietPreference(dietPreference);
  }

  /** Stores a valid portion count for the current generator session. */
  public setPortionCount(portionCount: number): void {
    if (!this.isValidPortionCount(portionCount)) return;
    this.portionCountState.set(portionCount);
    this.persistPortionCount(portionCount);
  }

  /** Removes one ingredient from the current generator session. */
  public removeIngredient(ingredientId: number): void {
    const ingredients: Ingredient[] = this.ingredientsState().filter(
      (ingredient: Ingredient): boolean => ingredient.id !== ingredientId,
    );

    this.setIngredients(ingredients);
    if (this.editingIngredientId() === ingredientId) this.cancelEditing();
  }

  /** Creates the validated workflow payload when every required value is available. */
  private createGenerationRequest(): RecipeGenerationRequest | null {
    const cookingTime: CookingTimeCategory | null = this.cookingTimeState();
    const cuisineStyle: CuisineStyle | null = this.cuisineStyleState();
    const dietPreference: DietPreference | null = this.dietPreferenceState();
    const ingredients: IngredientDraft[] = this.getRequestIngredients();

    if (!cookingTime || !cuisineStyle || !dietPreference || ingredients.length === 0) return null;
    return {
      cookingPeopleCount: this.cookingPeopleCountState(),
      cookingTime,
      cuisineStyle,
      dietPreference,
      ingredients,
      portionCount: this.portionCountState(),
    };
  }

  /** Removes UI-only ingredient IDs before data is sent to the workflow. */
  private getRequestIngredients(): IngredientDraft[] {
    return this.ingredientsState().map(({ amount, name, unit }: Ingredient): IngredientDraft => ({
      amount,
      name,
      unit,
    }));
  }

  /** Adds one validated ingredient with a new session-local ID. */
  private addIngredient(draft: IngredientDraft): void {
    const ingredient: Ingredient = { ...draft, id: this.nextIngredientId++ };
    this.setIngredients([...this.ingredientsState(), ingredient]);
  }

  /** Replaces the values of one existing ingredient. */
  private updateIngredient(ingredientId: number, draft: IngredientDraft): void {
    const ingredients: Ingredient[] = this.ingredientsState().map(
      (ingredient: Ingredient): Ingredient =>
        ingredient.id === ingredientId ? { ...draft, id: ingredientId } : ingredient,
    );
    this.setIngredients(ingredients);
  }

  /** Normalizes text and numeric values before they enter the state. */
  private normalizeDraft(draft: IngredientDraft): IngredientDraft {
    return {
      amount: Number.isFinite(draft.amount) ? draft.amount : 0,
      name: draft.name.trim().replace(/\s+/g, ' '),
      unit: draft.unit,
    };
  }

  /** Returns whether a submitted draft has a valid shape. */
  private isDraftValid(draft: IngredientDraft): boolean {
    return draft.name.length > 0 && draft.amount > 0 && this.isIngredientUnit(draft.unit);
  }

  /** Returns whether another ingredient already uses the submitted name. */
  private hasDuplicateName(name: string, excludedId: number | null): boolean {
    const normalizedName: string = name.toLocaleLowerCase();
    return this.ingredientsState().some(
      (ingredient: Ingredient): boolean =>
        ingredient.id !== excludedId && ingredient.name.toLocaleLowerCase() === normalizedName,
    );
  }

  /** Finds one ingredient or returns null when no editing ID is selected. */
  private findIngredient(ingredientId: number | null): Ingredient | null {
    if (ingredientId === null) return null;
    return (
      this.ingredientsState().find(
        (ingredient: Ingredient): boolean => ingredient.id === ingredientId,
      ) ?? null
    );
  }

  /** Updates the state and its session-storage representation together. */
  private setIngredients(ingredients: Ingredient[]): void {
    this.ingredientsState.set(ingredients);
    this.persistIngredients(ingredients);
  }

  /** Restores validated ingredients from the current browser session. */
  private loadIngredients(): Ingredient[] {
    try {
      const storedValue: string | null = this.storageService.get(INGREDIENT_STORAGE_KEY);
      return storedValue ? this.parseIngredients(storedValue) : [];
    } catch {
      return [];
    }
  }

  /** Parses a stored JSON value and discards malformed entries. */
  private parseIngredients(storedValue: string): Ingredient[] {
    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((value: unknown): value is Ingredient => this.isIngredient(value))
      : [];
  }

  /** Stores the current ingredients when session storage is available. */
  private persistIngredients(ingredients: Ingredient[]): void {
    this.storageService.set(INGREDIENT_STORAGE_KEY, JSON.stringify(ingredients));
  }

  /** Restores the number of people cooking or returns the configured default. */
  private loadCookingPeopleCount(): number {
    const storedValue: string | null = this.storageService.get(COOKING_PEOPLE_STORAGE_KEY);
    const cookingPeopleCount: number = Number(storedValue);
    return this.isValidCookingPeopleCount(cookingPeopleCount)
      ? cookingPeopleCount
      : COOKING_PEOPLE.default;
  }

  /** Stores the number of people cooking when session storage is available. */
  private persistCookingPeopleCount(cookingPeopleCount: number): void {
    this.storageService.set(COOKING_PEOPLE_STORAGE_KEY, String(cookingPeopleCount));
  }

  /** Checks whether a cooking-person count is an integer inside the supported range. */
  private isValidCookingPeopleCount(cookingPeopleCount: number): boolean {
    return (
      Number.isInteger(cookingPeopleCount) &&
      cookingPeopleCount >= COOKING_PEOPLE.minimum &&
      cookingPeopleCount <= COOKING_PEOPLE.maximum
    );
  }

  /** Restores a validated cooking-time category from session storage. */
  private loadCookingTime(): CookingTimeCategory | null {
    const storedValue: string | null = this.storageService.get(COOKING_TIME_STORAGE_KEY);
    return this.isCookingTimeCategory(storedValue) ? storedValue : null;
  }

  /** Stores the selected cooking-time category when session storage is available. */
  private persistCookingTime(cookingTime: CookingTimeCategory): void {
    this.storageService.set(COOKING_TIME_STORAGE_KEY, cookingTime);
  }

  /** Checks whether a value is one of the supported cooking-time categories. */
  private isCookingTimeCategory(value: unknown): value is CookingTimeCategory {
    return COOKING_TIME_CATEGORIES.some(
      (category: CookingTimeCategory): boolean => category === value,
    );
  }

  /** Restores a validated cuisine style from session storage. */
  private loadCuisineStyle(): CuisineStyle | null {
    const storedValue: string | null = this.storageService.get(CUISINE_STYLE_STORAGE_KEY);
    return this.isCuisineStyle(storedValue) ? storedValue : null;
  }

  /** Stores the selected cuisine style when session storage is available. */
  private persistCuisineStyle(cuisineStyle: CuisineStyle): void {
    this.storageService.set(CUISINE_STYLE_STORAGE_KEY, cuisineStyle);
  }

  /** Checks whether a value is one of the supported cuisine styles. */
  private isCuisineStyle(value: unknown): value is CuisineStyle {
    return CUISINE_STYLES.some((cuisineStyle: CuisineStyle): boolean => cuisineStyle === value);
  }

  /** Restores a validated diet preference from session storage. */
  private loadDietPreference(): DietPreference | null {
    const storedValue: string | null = this.storageService.get(DIET_PREFERENCE_STORAGE_KEY);
    return this.isDietPreference(storedValue) ? storedValue : null;
  }

  /** Stores the selected diet preference when session storage is available. */
  private persistDietPreference(dietPreference: DietPreference): void {
    this.storageService.set(DIET_PREFERENCE_STORAGE_KEY, dietPreference);
  }

  /** Checks whether a value is one of the supported diet preferences. */
  private isDietPreference(value: unknown): value is DietPreference {
    return DIET_PREFERENCES.some(
      (dietPreference: DietPreference): boolean => dietPreference === value,
    );
  }

  /** Restores the selected portion count or returns the configured default. */
  private loadPortionCount(): number {
    const storedValue: string | null = this.storageService.get(PORTION_STORAGE_KEY);
    const portionCount: number = Number(storedValue);
    return this.isValidPortionCount(portionCount) ? portionCount : RECIPE_PORTIONS.default;
  }

  /** Stores the selected portion count when session storage is available. */
  private persistPortionCount(portionCount: number): void {
    this.storageService.set(PORTION_STORAGE_KEY, String(portionCount));
  }

  /** Checks whether a portion count is an integer inside the supported range. */
  private isValidPortionCount(portionCount: number): boolean {
    return (
      Number.isInteger(portionCount) &&
      portionCount >= RECIPE_PORTIONS.minimum &&
      portionCount <= RECIPE_PORTIONS.maximum
    );
  }

  /** Checks whether a restored value is a valid ingredient. */
  private isIngredient(value: unknown): value is Ingredient {
    if (typeof value !== 'object' || value === null) return false;
    const ingredient: Partial<Ingredient> = value as Partial<Ingredient>;
    return (
      Number.isInteger(ingredient.id) &&
      typeof ingredient.name === 'string' &&
      typeof ingredient.amount === 'number' &&
      ingredient.amount > 0 &&
      this.isIngredientUnit(ingredient.unit)
    );
  }

  /** Checks whether a value is one of the supported ingredient units. */
  private isIngredientUnit(value: unknown): value is IngredientUnit {
    return INGREDIENT_UNIT_OPTIONS.some((option): boolean => option.value === value);
  }

  /** Creates the next numeric ID after all restored ingredients. */
  private getNextIngredientId(): number {
    const ingredientIds: number[] = this.ingredientsState().map(
      (ingredient: Ingredient): number => ingredient.id,
    );
    return Math.max(0, ...ingredientIds) + 1;
  }
}
