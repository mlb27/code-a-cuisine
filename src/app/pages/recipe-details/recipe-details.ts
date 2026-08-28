import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { RecipeDirections } from './components/recipe-directions/recipe-directions';
import { RecipeIngredients } from './components/recipe-ingredients/recipe-ingredients';
import { RecipeSummary } from './components/recipe-summary/recipe-summary';

/** Displays the details of a generated recipe. */
@Component({
  selector: 'app-recipe-details',
  imports: [Header, RecipeSummary, RecipeIngredients, RecipeDirections, RouterLink],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.scss',
})
export class RecipeDetails {}
