import { Routes } from '@angular/router';

import { Cookbook } from './pages/cookbook/cookbook';
import { Home } from './pages/home/home';
import { RecipeDetails } from './pages/recipe-details/recipe-details';
import { RecipeGenerator } from './pages/recipe-generator/recipe-generator';
import { RecipeLoading } from './pages/recipe-loading/recipe-loading';
import { RecipePreferences } from './pages/recipe-preferences/recipe-preferences';
import { RecipeResults } from './pages/recipe-results/recipe-results';

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
  },
  {
    path: 'generator/loading',
    component: RecipeLoading,
  },
  {
    path: 'results',
    component: RecipeResults,
  },
  {
    path: 'recipe',
    component: RecipeDetails,
  },
  {
    path: 'cookbook',
    component: Cookbook,
  },
];
