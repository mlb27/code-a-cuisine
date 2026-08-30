import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Header } from '../../layout/header/header';
import { RecipeGenerationFailure } from '../../shared/models/generated-recipe';
import { RecipeGenerationRequest } from '../../shared/models/recipe-generation-request';
import { RecipeGenerationService } from '../../shared/services/recipe-generation.service';
import { RecipeGeneratorService } from '../../shared/services/recipe-generator.service';

const NON_RETRYABLE_ERROR_CODES: readonly string[] = [
  'INVALID_REQUEST',
  'IP_DAILY_LIMIT_REACHED',
  'SYSTEM_DAILY_LIMIT_REACHED',
];

/** Displays recipe generation progress and workflow errors. */
@Component({
  selector: 'app-recipe-loading',
  imports: [Header],
  templateUrl: './recipe-loading.html',
  styleUrl: './recipe-loading.scss',
})
export class RecipeLoading implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly recipeGenerationService = inject(RecipeGenerationService);
  private readonly recipeGeneratorService = inject(RecipeGeneratorService);
  private readonly router = inject(Router);
  private readonly failureState: WritableSignal<RecipeGenerationFailure | null> = signal(null);

  protected readonly failure: Signal<RecipeGenerationFailure | null> =
    this.failureState.asReadonly();
  protected readonly canRetry: Signal<boolean> = computed((): boolean => {
    const failure: RecipeGenerationFailure | null = this.failureState();
    return failure !== null && !NON_RETRYABLE_ERROR_CODES.includes(failure.code);
  });

  ngOnInit(): void {
    this.generateRecipes();
  }

  /** Repeats a failed request when it is safe to try again. */
  protected retryGeneration(): void {
    this.generateRecipes();
  }

  /** Returns to the preferences so invalid input can be adjusted. */
  protected returnToPreferences(): void {
    void this.router.navigateByUrl('/generator/preferences');
  }

  /** Sends the complete generator request and opens the generated results. */
  private generateRecipes(): void {
    const request: RecipeGenerationRequest | null = this.recipeGeneratorService.generationRequest();
    if (!request) {
      void this.router.navigateByUrl('/generator/preferences');
      return;
    }

    this.failureState.set(null);
    this.recipeGenerationService
      .generateRecipes(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (): void => {
          void this.router.navigateByUrl('/results');
        },
        error: (error: unknown): void => {
          this.failureState.set(this.recipeGenerationService.getFailure(error));
        },
      });
  }
}
