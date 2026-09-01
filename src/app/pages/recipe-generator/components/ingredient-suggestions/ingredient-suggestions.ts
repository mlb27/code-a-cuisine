import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';

/** Displays the matching entries for the ingredient combobox. */
@Component({
  selector: 'app-ingredient-suggestions',
  templateUrl: './ingredient-suggestions.html',
  styleUrl: './ingredient-suggestions.scss',
})
export class IngredientSuggestions {
  public readonly suggestions: InputSignal<readonly string[]> = input.required<readonly string[]>();
  public readonly activeIndex: InputSignal<number> = input.required<number>();
  public readonly ingredientSelected: OutputEmitterRef<string> = output<string>();
}
