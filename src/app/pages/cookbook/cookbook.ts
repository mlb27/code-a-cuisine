import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Header } from '../../layout/header/header';
import { GeneratedRecipe } from '../../shared/models/generated-recipe';
import { RecipeLibraryService } from '../../shared/services/recipe-library.service';
import { CuisineCard } from './components/cuisine-card/cuisine-card';
import { MostLikedRecipeCard } from './components/most-liked-recipe-card/most-liked-recipe-card';

interface Cuisine {
  name: string;
  slug: string;
  emoji: string;
  imageSource: string;
  imageAlt: string;
}

/** Displays the public recipe cookbook. */
@Component({
  selector: 'app-cookbook',
  imports: [CuisineCard, Header, MostLikedRecipeCard, RouterLink],
  templateUrl: './cookbook.html',
  styleUrl: './cookbook.scss',
})
export class Cookbook implements OnInit {
  private readonly recipeLibraryService = inject(RecipeLibraryService);

  protected readonly mostLikedRecipes: WritableSignal<GeneratedRecipe[]> = signal([]);
  protected readonly isLoading: WritableSignal<boolean> = signal(true);
  protected readonly loadError: WritableSignal<string | null> = signal(null);

  protected readonly cuisines: Cuisine[] = [
    {
      name: 'Italian',
      slug: 'italian',
      emoji: '🤌',
      imageSource: 'img/cookbook/italian-cuisine.png',
      imageAlt: 'Italian pasta and pizza dishes',
    },
    {
      name: 'German',
      slug: 'german',
      emoji: '🥨',
      imageSource: 'img/cookbook/german-cuisine.png',
      imageAlt: 'German dishes with schnitzel, pretzels and dumplings',
    },
    {
      name: 'Japanese',
      slug: 'japanese',
      emoji: '🥢',
      imageSource: 'img/cookbook/japanese-cuisine.png',
      imageAlt: 'Fresh Japanese salmon sushi',
    },
    {
      name: 'Gourmet',
      slug: 'gourmet',
      emoji: '✨',
      imageSource: 'img/cookbook/gourmet-cuisine.png',
      imageAlt: 'A colorful gourmet dish',
    },
    {
      name: 'Indian',
      slug: 'indian',
      emoji: '🍛',
      imageSource: 'img/cookbook/indian-cuisine.png',
      imageAlt: 'An Indian thali with rice, bread and curries',
    },
    {
      name: 'Fusion',
      slug: 'fusion',
      emoji: '🍢',
      imageSource: 'img/cookbook/fusion-cuisine.png',
      imageAlt: 'A modern fusion cuisine tasting plate',
    },
  ];

  /** Loads the most-liked public recipes when the cookbook opens. */
  public ngOnInit(): void {
    this.loadMostLikedRecipes();
  }

  /** Repeats the public recipe request after a recoverable error. */
  protected retryMostLikedRecipes(): void {
    this.loadMostLikedRecipes();
  }

  /** Requests up to five recipes ordered by their persisted heart count. */
  private loadMostLikedRecipes(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.recipeLibraryService
      .loadRecipes({ page: 1, pageSize: 5, sort: 'likes' })
      .pipe(finalize((): void => this.isLoading.set(false)))
      .subscribe({
        next: (response): void => this.mostLikedRecipes.set(response.recipes),
        error: (): void => {
          this.mostLikedRecipes.set([]);
          this.loadError.set('The most-liked recipes could not be loaded.');
        },
      });
  }
}
