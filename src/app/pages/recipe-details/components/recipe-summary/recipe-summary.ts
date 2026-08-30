import { Component, input, InputSignal } from '@angular/core';

import { GeneratedRecipe } from '../../../../shared/models/generated-recipe';

/** Displays the title, cooks and nutritional information of a recipe. */
@Component({
  selector: 'app-recipe-summary',
  templateUrl: './recipe-summary.html',
  styleUrl: './recipe-summary.scss',
})
export class RecipeSummary {
  public readonly recipe: InputSignal<GeneratedRecipe> = input.required<GeneratedRecipe>();

  /** Creates the one-based cook numbers displayed for the generated team. */
  protected getCookNumbers(): number[] {
    return Array.from(
      { length: this.recipe().cookingPeopleCount },
      (_: unknown, index: number): number => index + 1,
    );
  }

  /** Returns the matching visual for a cook number. */
  protected getCookIcon(cookNumber: number): string {
    return cookNumber % 2 === 0
      ? 'img/recipe-details/chef-two.png'
      : 'img/recipe-details/chef-one.png';
  }

  /** Returns the width used by the matching cook visual. */
  protected getCookIconWidth(cookNumber: number): number {
    return cookNumber % 2 === 0 ? 25 : 28;
  }

  /** Converts one API enum value into a display label. */
  protected toDisplayLabel(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
