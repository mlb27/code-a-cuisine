import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';
import { IngredientInput } from './components/ingredient-input/ingredient-input';
import { IngredientList } from './components/ingredient-list/ingredient-list';

/** Displays the recipe generator page. */
@Component({
  selector: 'app-recipe-generator',
  imports: [Header, IngredientInput, IngredientList],
  templateUrl: './recipe-generator.html',
  styleUrl: './recipe-generator.scss',
})
export class RecipeGenerator {}
