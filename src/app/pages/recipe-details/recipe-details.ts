import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { GeneratedRecipe } from '../../shared/models/generated-recipe';
import { RecipeGenerationService } from '../../shared/services/recipe-generation.service';
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
export class RecipeDetails {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly recipeGenerationService = inject(RecipeGenerationService);

  protected readonly recipe: GeneratedRecipe = this.getCurrentRecipe();

  /** Resolves the selected generated recipe after the route guard has validated it. */
  private getCurrentRecipe(): GeneratedRecipe {
    const recipeId: string | null = this.activatedRoute.snapshot.paramMap.get('recipeId');
    const recipe: GeneratedRecipe | null = this.recipeGenerationService.getRecipeById(recipeId);

    if (!recipe) throw new Error('The selected recipe could not be found.');
    return recipe;
  }
}
