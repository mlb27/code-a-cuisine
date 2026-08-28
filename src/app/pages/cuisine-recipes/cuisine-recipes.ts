import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { CuisinePagination } from './components/cuisine-pagination/cuisine-pagination';
import { CuisineRecipeCard } from './components/cuisine-recipe-card/cuisine-recipe-card';

interface RecipeTemplate {
  title: string;
  cookingTime: string;
  likes: number;
  tags: string[];
}

interface CuisineRecipe extends RecipeTemplate {
  number: number;
}

/** Displays the saved recipes for the selected cuisine. */
@Component({
  selector: 'app-cuisine-recipes',
  imports: [CuisinePagination, CuisineRecipeCard, Header, RouterLink],
  templateUrl: './cuisine-recipes.html',
  styleUrl: './cuisine-recipes.scss',
})
export class CuisineRecipes {
  protected readonly cuisineName: string;

  private readonly cuisineNames: Record<string, string> = {
    fusion: 'Fusion',
    german: 'German',
    gourmet: 'Gourmet',
    indian: 'Indian',
    italian: 'Italian',
    japanese: 'Japanese',
  };

  private readonly recipeTemplates: RecipeTemplate[] = [
    {
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: '20min',
      likes: 66,
      tags: ['Vegetarian', 'Quick'],
    },
    {
      title: 'Creamy garlic shrimp pasta',
      cookingTime: '22min',
      likes: 32,
      tags: ['Quick'],
    },
    {
      title: 'Funghi salami pizza',
      cookingTime: '16min',
      likes: 42,
      tags: ['Quick'],
    },
  ];

  protected readonly recipes: CuisineRecipe[] = Array.from({ length: 15 }, (_, index) => ({
    ...this.recipeTemplates[index % this.recipeTemplates.length],
    number: index + 1,
  }));

  constructor(route: ActivatedRoute) {
    const cuisineSlug = route.snapshot.paramMap.get('cuisine')?.toLowerCase() ?? 'italian';
    this.cuisineName = this.cuisineNames[cuisineSlug] ?? 'Italian';
  }
}
