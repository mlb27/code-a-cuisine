import { Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { GeneratedRecipe } from '../../shared/models/generated-recipe';
import { RecipeGenerationService } from '../../shared/services/recipe-generation.service';
import { RecipeResultCard } from './components/recipe-result-card/recipe-result-card';

/** Displays the generated recipe suggestions. */
@Component({
  selector: 'app-recipe-results',
  imports: [Header, RecipeResultCard, RouterLink],
  templateUrl: './recipe-results.html',
  styleUrl: './recipe-results.scss',
})
export class RecipeResults {
  private readonly recipeGenerationService = inject(RecipeGenerationService);

  protected readonly recipes: Signal<GeneratedRecipe[]> = this.recipeGenerationService.recipes;
  protected readonly preferenceLabels: Signal<string[]> = computed((): string[] => {
    const firstRecipe: GeneratedRecipe | undefined = this.recipes()[0];
    return firstRecipe
      ? [
          this.toDisplayLabel(firstRecipe.cuisineStyle),
          this.toDisplayLabel(firstRecipe.cookingTimeCategory),
        ]
      : [];
  });
  protected readonly remainingGenerationLabel: Signal<string> = computed((): string => {
    const remainingGenerations: number =
      this.recipeGenerationService.response()?.remainingGenerations.ip ?? 0;
    const generationLabel: string = remainingGenerations === 1 ? 'generation' : 'generations';
    return remainingGenerations + ' ' + generationLabel + ' left today';
  });

  /** Converts an API enum value into a user-facing label. */
  private toDisplayLabel(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
