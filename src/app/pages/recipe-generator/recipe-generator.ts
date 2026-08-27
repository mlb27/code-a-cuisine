import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { IngredientInput } from './components/ingredient-input/ingredient-input';
import { IngredientList } from './components/ingredient-list/ingredient-list';

/** Displays the recipe generator page. */
@Component({
  selector: 'app-recipe-generator',
  imports: [Header, IngredientInput, IngredientList, RouterLink],
  templateUrl: './recipe-generator.html',
  styleUrl: './recipe-generator.scss',
})
export class RecipeGenerator {}
