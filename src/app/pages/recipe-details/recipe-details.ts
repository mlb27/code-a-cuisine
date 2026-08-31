import { computed, Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, UrlTree } from '@angular/router';
import { finalize } from 'rxjs';

import { Header } from '../../layout/header/header';
import { GeneratedRecipe } from '../../shared/models/generated-recipe';
import { RecipeGenerationService } from '../../shared/services/recipe-generation.service';
import { RecipeLikeService } from '../../shared/services/recipe-like.service';
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
  private readonly recipeLikeService = inject(RecipeLikeService);
  private readonly router = inject(Router);
  private readonly currentRecipe: GeneratedRecipe = this.getCurrentRecipe();

  protected readonly recipe: WritableSignal<GeneratedRecipe> = signal(this.currentRecipe);
  protected readonly isLiked: WritableSignal<boolean> = signal(
    this.recipeLikeService.isRecipeLiked(this.currentRecipe.id),
  );
  protected readonly likePending: WritableSignal<boolean> = signal(false);
  protected readonly likeError: WritableSignal<string | null> = signal(null);
  protected readonly likeFeedback: Signal<string> = computed((): string => {
    if (this.likeError()) return this.likeError() ?? '';
    return this.isLiked()
      ? 'Thanks! Your heart has been saved.'
      : 'Give it a heart, so that the others know this is delicious.';
  });
  protected readonly backLink: string | UrlTree = this.getBackLink();
  protected readonly backLabel: string = this.isCookbookReturn() ? 'Cookbook' : 'Recipe results';

  /** Persists the opposite heart state while preventing concurrent updates. */
  protected toggleRecipeLike(): void {
    if (this.likePending()) return;
    const nextLikedState: boolean = !this.isLiked();
    const recipeId: string = this.recipe().id;
    this.likePending.set(true);
    this.likeError.set(null);

    this.recipeLikeService
      .setRecipeLike(recipeId, nextLikedState)
      .pipe(finalize((): void => this.likePending.set(false)))
      .subscribe({
        next: (response): void => {
          this.isLiked.set(response.liked);
          this.recipe.update((recipe: GeneratedRecipe): GeneratedRecipe => ({
            ...recipe,
            likesCount: response.likesCount,
          }));
          this.recipeGenerationService.updateRecipeLikes(recipeId, response.likesCount);
        },
        error: (): void => this.likeError.set('Your heart could not be saved. Please try again.'),
      });
  }

  /** Resolves the selected generated recipe after the route guard has validated it. */
  private getCurrentRecipe(): GeneratedRecipe {
    const recipeId: string | null = this.activatedRoute.snapshot.paramMap.get('recipeId');
    const recipe: GeneratedRecipe | null = this.recipeGenerationService.getRecipeById(recipeId);

    if (!recipe) throw new Error('The selected recipe could not be found.');
    return recipe;
  }

  /** Restores the cookbook origin or falls back to this generation's result page. */
  private getBackLink(): UrlTree {
    const returnTo: string | null = this.activatedRoute.snapshot.queryParamMap.get('returnTo');
    return this.isCookbookReturn(returnTo)
      ? this.router.parseUrl(returnTo)
      : this.router.createUrlTree(['/results', this.currentRecipe.generationId]);
  }

  /** Checks whether a return target stays inside the public cookbook routes. */
  private isCookbookReturn(returnTo?: string | null): returnTo is string {
    const returnTarget: string | null =
      returnTo ?? this.activatedRoute.snapshot.queryParamMap.get('returnTo');
    return /^\/cookbook(?:\/(?:german|italian|indian|japanese|gourmet|fusion))?(?:\?page=\d+)?$/.test(
      returnTarget ?? '',
    );
  }
}
