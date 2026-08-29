import { Component, inject, Signal } from '@angular/core';

import {
  Ingredient,
  INGREDIENT_UNIT_OPTIONS,
  IngredientUnit,
  IngredientUnitOption,
} from '../../../../shared/models/ingredient';
import { RecipeGeneratorService } from '../../../../shared/services/recipe-generator.service';

/** Displays and manages the ingredients selected for recipe generation. */
@Component({
  selector: 'app-ingredient-list',
  imports: [],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList {
  private readonly recipeGeneratorService = inject(RecipeGeneratorService);

  protected readonly editingIngredient: Signal<Ingredient | null> =
    this.recipeGeneratorService.editingIngredient;
  protected readonly ingredients: Signal<Ingredient[]> = this.recipeGeneratorService.ingredients;

  /** Selects one list entry for editing in the ingredient form. */
  protected editIngredient(ingredientId: number): void {
    this.recipeGeneratorService.startEditing(ingredientId);
  }

  /** Removes one ingredient from the current generator session. */
  protected deleteIngredient(ingredientId: number): void {
    this.recipeGeneratorService.removeIngredient(ingredientId);
  }

  /** Formats one numeric amount with its abbreviated unit. */
  protected formatAmount(ingredient: Ingredient): string {
    return `${ingredient.amount}${this.getUnitAbbreviation(ingredient.unit)}`;
  }

  /** Returns the short label belonging to one ingredient unit. */
  private getUnitAbbreviation(unit: IngredientUnit): string {
    const unitOption: IngredientUnitOption | undefined = INGREDIENT_UNIT_OPTIONS.find(
      (option: IngredientUnitOption): boolean => option.value === unit,
    );
    return unitOption?.abbreviation ?? unit;
  }
}
