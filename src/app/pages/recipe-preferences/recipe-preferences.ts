import { Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import {
  CookingTimeCategory,
  CuisineStyle,
  DietPreference,
  RECIPE_PORTIONS,
} from '../../shared/models/recipe-preferences';
import { RecipeGeneratorService } from '../../shared/services/recipe-generator.service';
import { PreferenceCounter } from './components/preference-counter/preference-counter';
import { PreferenceTag } from './components/preference-tag/preference-tag';

interface PreferenceOption {
  label: string;
  width: number;
  hint?: string;
}

interface CookingTimeOption extends PreferenceOption {
  value: CookingTimeCategory;
}

interface CuisineOption extends PreferenceOption {
  value: CuisineStyle;
}

interface DietOption extends PreferenceOption {
  value: DietPreference;
}

/** Displays the second step of the recipe generator. */
@Component({
  selector: 'app-recipe-preferences',
  imports: [Header, PreferenceCounter, PreferenceTag, RouterLink],
  templateUrl: './recipe-preferences.html',
  styleUrl: './recipe-preferences.scss',
})
export class RecipePreferences {
  private readonly recipeGeneratorService = inject(RecipeGeneratorService);

  protected readonly maximumPortionCount: number = RECIPE_PORTIONS.maximum;
  protected readonly minimumPortionCount: number = RECIPE_PORTIONS.minimum;
  protected readonly cookingTime: Signal<CookingTimeCategory | null> =
    this.recipeGeneratorService.cookingTime;
  protected readonly cuisineStyle: Signal<CuisineStyle | null> =
    this.recipeGeneratorService.cuisineStyle;
  protected readonly dietPreference: Signal<DietPreference | null> =
    this.recipeGeneratorService.dietPreference;
  protected readonly portionCount: Signal<number> = this.recipeGeneratorService.portionCount;
  protected readonly cookingTimeOptions: CookingTimeOption[] = [
    { label: 'Quick', value: 'quick', width: 83, hint: 'up to 20 min' },
    { label: 'Medium', value: 'medium', width: 102, hint: '20-45 min' },
    { label: 'Complex', value: 'complex', width: 110, hint: 'over 45 min' },
  ];

  protected readonly cuisineOptions: CuisineOption[] = [
    { label: 'German', value: 'german', width: 100 },
    { label: 'Italian', value: 'italian', width: 82 },
    { label: 'Indian', value: 'indian', width: 82 },
    { label: 'Japanese', value: 'japanese', width: 117 },
    { label: 'Gourmet', value: 'gourmet', width: 107 },
    { label: 'Fusion', value: 'fusion', width: 85 },
  ];

  protected readonly dietOptions: DietOption[] = [
    { label: 'Vegetarian', value: 'vegetarian', width: 128 },
    { label: 'Vegan', value: 'vegan', width: 85 },
    { label: 'Keto', value: 'keto', width: 68 },
    { label: 'No preferences', value: 'unrestricted', width: 169 },
  ];

  /** Updates the cooking-time category used for the current recipe request. */
  protected updateCookingTime(cookingTime: CookingTimeCategory): void {
    this.recipeGeneratorService.setCookingTime(cookingTime);
  }

  /** Updates the cuisine style used for the current recipe request. */
  protected updateCuisineStyle(cuisineStyle: CuisineStyle): void {
    this.recipeGeneratorService.setCuisineStyle(cuisineStyle);
  }

  /** Updates the diet preference used for the current recipe request. */
  protected updateDietPreference(dietPreference: DietPreference): void {
    this.recipeGeneratorService.setDietPreference(dietPreference);
  }

  /** Updates the portion count used for the current recipe request. */
  protected updatePortionCount(portionCount: number): void {
    this.recipeGeneratorService.setPortionCount(portionCount);
  }
}
