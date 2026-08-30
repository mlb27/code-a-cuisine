import { Routes } from '@angular/router';

import { Cookbook } from './pages/cookbook/cookbook';
import { CuisineRecipes } from './pages/cuisine-recipes/cuisine-recipes';
import { Home } from './pages/home/home';
import { RecipeDetails } from './pages/recipe-details/recipe-details';
import { RecipeGenerator } from './pages/recipe-generator/recipe-generator';
import { RecipeLoading } from './pages/recipe-loading/recipe-loading';
import { RecipePreferences } from './pages/recipe-preferences/recipe-preferences';
import { RecipeResults } from './pages/recipe-results/recipe-results';
import {
  generatedRecipeRequiredGuard,
  generatedRecipesRequiredGuard,
  generationRequestRequiredGuard,
  ingredientsRequiredGuard,
} from './shared/guards/recipe-generator.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: 'generator',
    component: RecipeGenerator,
  },
  {
    path: 'generator/preferences',
    component: RecipePreferences,
    canActivate: [ingredientsRequiredGuard],
  },
  {
    path: 'generator/loading',
    component: RecipeLoading,
    canActivate: [generationRequestRequiredGuard],
  },
  {
    path: 'results',
    component: RecipeResults,
    canActivate: [generatedRecipesRequiredGuard],
  },
  {
    path: 'recipe/:recipeId',
    component: RecipeDetails,
    canActivate: [generatedRecipeRequiredGuard],
  },
  {
    path: 'cookbook',
    component: Cookbook,
  },
  {
    path: 'cookbook/:cuisine',
    component: CuisineRecipes,
  },
];
