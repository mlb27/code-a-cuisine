import { Routes } from '@angular/router';

import { Cookbook } from './pages/cookbook/cookbook';
import { Home } from './pages/home/home';
import { RecipeGenerator } from './pages/recipe-generator/recipe-generator';
import { RecipePreferences } from './pages/recipe-preferences/recipe-preferences';

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
    path: 'cookbook',
    component: Cookbook,
  },
];
