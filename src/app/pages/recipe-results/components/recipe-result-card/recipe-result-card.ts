import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays one generated recipe suggestion. */
@Component({
  selector: 'app-recipe-result-card',
  imports: [RouterLink],
  templateUrl: './recipe-result-card.html',
  styleUrl: './recipe-result-card.scss',
})
export class RecipeResultCard {
  @Input({ required: true }) recipeNumber = 0;
  @Input({ required: true }) title = '';
  @Input({ required: true }) cookingTime = '';
}
