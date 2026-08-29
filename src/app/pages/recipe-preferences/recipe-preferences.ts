import { Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { CookingTimeCategory, RECIPE_PORTIONS } from '../../shared/models/recipe-preferences';
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
  protected readonly portionCount: Signal<number> = this.recipeGeneratorService.portionCount;
  protected readonly cookingTimeOptions: CookingTimeOption[] = [
    { label: 'Quick', value: 'quick', width: 83, hint: 'up to 20 min' },
    { label: 'Medium', value: 'medium', width: 102, hint: '20-45 min' },
    { label: 'Complex', value: 'complex', width: 110, hint: 'over 45 min' },
  ];

  protected readonly cuisineOptions: PreferenceOption[] = [
    { label: 'German', width: 100 },
    { label: 'Italian', width: 82 },
    { label: 'Indian', width: 82 },
    { label: 'Japanese', width: 117 },
    { label: 'Gourmet', width: 107 },
    { label: 'Fusion', width: 85 },
  ];

  protected readonly dietOptions: PreferenceOption[] = [
    { label: 'Vegetarian', width: 128 },
    { label: 'Vegan', width: 85 },
    { label: 'Keto', width: 68 },
    { label: 'No preferences', width: 169 },
  ];

  /** Updates the cooking-time category used for the current recipe request. */
  protected updateCookingTime(cookingTime: CookingTimeCategory): void {
    this.recipeGeneratorService.setCookingTime(cookingTime);
  }

  /** Updates the portion count used for the current recipe request. */
  protected updatePortionCount(portionCount: number): void {
    this.recipeGeneratorService.setPortionCount(portionCount);
  }
}
