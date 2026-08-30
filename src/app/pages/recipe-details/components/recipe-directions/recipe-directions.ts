import { Component, input, InputSignal, signal, WritableSignal } from '@angular/core';

import { GeneratedRecipe } from '../../../../shared/models/generated-recipe';

/** Displays the individual cooking steps of a recipe. */
@Component({
  selector: 'app-recipe-directions',
  templateUrl: './recipe-directions.html',
  styleUrl: './recipe-directions.scss',
})
export class RecipeDirections {
  public readonly recipe: InputSignal<GeneratedRecipe> = input.required<GeneratedRecipe>();

  protected readonly directionsVisible: WritableSignal<boolean> = signal(true);

  /** Shows or hides the preparation steps on compact screens. */
  protected toggleDirections(): void {
    this.directionsVisible.update((isVisible: boolean): boolean => !isVisible);
  }

  /** Returns the matching visual for the cook assigned to a step. */
  protected getCookIcon(cookNumber: number): string {
    return cookNumber % 2 === 0
      ? 'img/recipe-details/chef-two.png'
      : 'img/recipe-details/chef-one.png';
  }

  /** Returns the width used by the matching cook visual. */
  protected getCookIconWidth(cookNumber: number): number {
    return cookNumber % 2 === 0 ? 25 : 28;
  }
}
