import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays one compact recipe teaser in the most-liked carousel. */
@Component({
  selector: 'app-most-liked-recipe-card',
  imports: [RouterLink],
  templateUrl: './most-liked-recipe-card.html',
  styleUrl: './most-liked-recipe-card.scss',
})
export class MostLikedRecipeCard {
  @Input({ required: true }) recipeId = '';
  @Input({ required: true }) title = '';
  @Input({ required: true }) cookingTime = '';
  @Input({ required: true }) likes = 0;
}
