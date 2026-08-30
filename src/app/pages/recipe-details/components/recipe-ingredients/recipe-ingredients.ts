import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';

import {
  GeneratedIngredient,
  GeneratedIngredientUnit,
  GeneratedRecipe,
} from '../../../../shared/models/generated-recipe';

/** Displays the ingredients required for a recipe. */
@Component({
  selector: 'app-recipe-ingredients',
  templateUrl: './recipe-ingredients.html',
  styleUrl: './recipe-ingredients.scss',
})
export class RecipeIngredients {
  public readonly recipe: InputSignal<GeneratedRecipe> = input.required<GeneratedRecipe>();

  protected readonly ingredientsVisible: WritableSignal<boolean> = signal(true);

  /** Shows or hides the ingredient lists on compact screens. */
  protected toggleIngredients(): void {
    this.ingredientsVisible.update((isVisible: boolean): boolean => !isVisible);
  }

  /** Formats an ingredient quantity with a compact unit label. */
  protected formatQuantity(ingredient: GeneratedIngredient): string {
    const amount: string = Number.isInteger(ingredient.amount)
      ? ingredient.amount.toString()
      : ingredient.amount.toFixed(1).replace(/\.0$/, '');
    return amount + this.getUnitLabel(ingredient.unit, ingredient.amount);
  }

  /** Maps generated ingredient units to concise display labels. */
  private getUnitLabel(unit: GeneratedIngredientUnit, amount: number): string {
    const labels: Record<GeneratedIngredientUnit, string> = {
      clove: amount === 1 ? ' clove' : ' cloves',
      gram: 'g',
      kilogram: 'kg',
      liter: 'l',
      milliliter: 'ml',
      piece: amount === 1 ? ' piece' : ' pieces',
      pinch: amount === 1 ? ' pinch' : ' pinches',
      tablespoon: ' tbsp',
      teaspoon: ' tsp',
    };
    return labels[unit];
  }
}
