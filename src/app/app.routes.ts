import { Routes } from '@angular/router';

import { Cookbook } from './pages/cookbook/cookbook';
import { Home } from './pages/home/home';
import { RecipeGenerator } from './pages/recipe-generator/recipe-generator';

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
    path: 'cookbook',
    component: Cookbook,
  },
];
