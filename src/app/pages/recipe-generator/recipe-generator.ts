import { Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { Ingredient } from '../../shared/models/ingredient';
import { RecipeGeneratorService } from '../../shared/services/recipe-generator.service';
import { IngredientInput } from './components/ingredient-input/ingredient-input';
import { IngredientList } from './components/ingredient-list/ingredient-list';

/** Displays the recipe generator page. */
@Component({
  selector: 'app-recipe-generator',
  imports: [Header, IngredientInput, IngredientList, RouterLink],
  templateUrl: './recipe-generator.html',
  styleUrl: './recipe-generator.scss',
})
export class RecipeGenerator {
  private readonly recipeGeneratorService = inject(RecipeGeneratorService);

  protected readonly ingredients: Signal<Ingredient[]> = this.recipeGeneratorService.ingredients;
  protected readonly hasIngredients: Signal<boolean> = this.recipeGeneratorService.hasIngredients;
}
