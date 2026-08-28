import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';
import { RecipeResultCard } from './components/recipe-result-card/recipe-result-card';

interface RecipeSuggestion {
  number: number;
  title: string;
  cookingTime: string;
}

/** Displays the generated recipe suggestions. */
@Component({
  selector: 'app-recipe-results',
  imports: [Header, RecipeResultCard],
  templateUrl: './recipe-results.html',
  styleUrl: './recipe-results.scss',
})
export class RecipeResults {
  protected readonly recipeSuggestions: RecipeSuggestion[] = [
    {
      number: 1,
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: '20min',
    },
    {
      number: 2,
      title: 'Creamy garlic shrimp pasta',
      cookingTime: '22min',
    },
    {
      number: 3,
      title: 'Pasta alla Trapanese (Sicilian Tomato Pesto)',
      cookingTime: '20min',
    },
  ];
}
