import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays one saved recipe in a cuisine overview. */
@Component({
  selector: 'app-cuisine-recipe-card',
  imports: [RouterLink],
  templateUrl: './cuisine-recipe-card.html',
  styleUrl: './cuisine-recipe-card.scss',
})
export class CuisineRecipeCard {
  @Input({ required: true }) recipeId = '';
  @Input({ required: true }) recipeNumber = 0;
  @Input({ required: true }) title = '';
  @Input({ required: true }) cookingTime = '';
  @Input({ required: true }) likes = 0;
  @Input() tags: string[] = [];
  @Input() returnLink = '/cookbook';
}
