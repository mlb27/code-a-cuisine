import {
  computed,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';

import { Header } from '../../layout/header/header';
import { GeneratedRecipe } from '../../shared/models/generated-recipe';
import { CUISINE_STYLES, CuisineStyle } from '../../shared/models/recipe-preferences';
import { RecipeLibraryService } from '../../shared/services/recipe-library.service';
import { CuisinePagination } from './components/cuisine-pagination/cuisine-pagination';
import { CuisineRecipeCard } from './components/cuisine-recipe-card/cuisine-recipe-card';

interface CuisineDetails {
  name: string;
  bannerSource: string;
  bannerHeight: number;
  headingTop: number;
  mobileBannerSource: string;
  mobileBannerHeight: number;
  mobileHeadingTop: number;
  mobileHeadingWidth: number;
}

/** Displays the saved recipes for the selected cuisine. */
@Component({
  selector: 'app-cuisine-recipes',
  imports: [CuisinePagination, CuisineRecipeCard, Header, RouterLink],
  templateUrl: './cuisine-recipes.html',
  styleUrl: './cuisine-recipes.scss',
})
export class CuisineRecipes implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly recipeLibraryService = inject(RecipeLibraryService);
  private readonly router = inject(Router);
  private readonly pageSize = 20;

  protected readonly cuisine: CuisineDetails;
  protected readonly cuisineStyle: CuisineStyle;
  protected readonly currentPage: WritableSignal<number> = signal(1);
  protected readonly totalPages: WritableSignal<number> = signal(0);
  protected readonly recipes: WritableSignal<GeneratedRecipe[]> = signal([]);
  protected readonly isLoading: WritableSignal<boolean> = signal(true);
  protected readonly loadError: WritableSignal<string | null> = signal(null);
  protected readonly returnLink: Signal<string> = computed((): string => {
    const pageQuery: string = this.currentPage() > 1 ? `?page=${this.currentPage()}` : '';
    return `/cookbook/${this.cuisineStyle}${pageQuery}`;
  });

  private readonly cuisines: Record<CuisineStyle, CuisineDetails> = {
    fusion: {
      name: 'Fusion',
      bannerSource: 'img/cuisine-recipes/fusion-cuisine-banner.png',
      bannerHeight: 132,
      headingTop: 39,
      mobileBannerSource: 'img/cuisine-recipes/mobile-fusion-cuisine-banner.png',
      mobileBannerHeight: 91,
      mobileHeadingTop: 34,
      mobileHeadingWidth: 118,
    },
    german: {
      name: 'German',
      bannerSource: 'img/cuisine-recipes/german-cuisine-banner.png',
      bannerHeight: 151,
      headingTop: 48,
      mobileBannerSource: 'img/cuisine-recipes/mobile-german-cuisine-banner.png',
      mobileBannerHeight: 91,
      mobileHeadingTop: 34,
      mobileHeadingWidth: 132,
    },
    gourmet: {
      name: 'Gourmet',
      bannerSource: 'img/cuisine-recipes/gourmet-cuisine-banner.png',
      bannerHeight: 165,
      headingTop: 74,
      mobileBannerSource: 'img/cuisine-recipes/mobile-gourmet-cuisine-banner.png',
      mobileBannerHeight: 90,
      mobileHeadingTop: 33,
      mobileHeadingWidth: 139,
    },
    indian: {
      name: 'Indian',
      bannerSource: 'img/cuisine-recipes/indian-cuisine-banner.png',
      bannerHeight: 132,
      headingTop: 39,
      mobileBannerSource: 'img/cuisine-recipes/mobile-indian-cuisine-banner.png',
      mobileBannerHeight: 91,
      mobileHeadingTop: 34,
      mobileHeadingWidth: 116,
    },
    italian: {
      name: 'Italian',
      bannerSource: 'img/cuisine-recipes/italian-cuisine-banner.png',
      bannerHeight: 144,
      headingTop: 51,
      mobileBannerSource: 'img/cuisine-recipes/mobile-italian-cuisine-banner.png',
      mobileBannerHeight: 94,
      mobileHeadingTop: 35,
      mobileHeadingWidth: 117,
    },
    japanese: {
      name: 'Japanese',
      bannerSource: 'img/cuisine-recipes/japanese-cuisine-banner.png',
      bannerHeight: 156,
      headingTop: 50,
      mobileBannerSource: 'img/cuisine-recipes/mobile-japanese-cuisine-banner.png',
      mobileBannerHeight: 90,
      mobileHeadingTop: 30,
      mobileHeadingWidth: 147,
    },
  };

  constructor() {
    const cuisineSlug: string =
      this.activatedRoute.snapshot.paramMap.get('cuisine')?.toLowerCase() ?? 'italian';
    this.cuisineStyle = this.isCuisineStyle(cuisineSlug) ? cuisineSlug : 'italian';
    this.cuisine = this.cuisines[this.cuisineStyle];
  }

  /** Loads recipe pages whenever the shareable page query changes. */
  public ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .pipe(
        map((queryParameters): number => this.parsePage(queryParameters.get('page'))),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page: number): void => {
        this.currentPage.set(page);
        this.loadRecipePage(page);
      });
  }

  /** Updates the shareable page query and loads the selected recipe page. */
  protected selectPage(page: number): void {
    if (page === this.currentPage() || page < 1 || page > this.totalPages()) return;
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: page === 1 ? null : page },
      queryParamsHandling: 'merge',
    });
  }

  /** Repeats the current cuisine request after a recoverable error. */
  protected retryRecipePage(): void {
    this.loadRecipePage(this.currentPage());
  }

  /** Returns one continuous recipe number across all pages. */
  protected getRecipeNumber(index: number): number {
    return (this.currentPage() - 1) * this.pageSize + index + 1;
  }

  /** Converts stored enum values into the tags shown on a recipe card. */
  protected getRecipeTags(recipe: GeneratedRecipe): string[] {
    const tags: string[] = [this.toDisplayLabel(recipe.cookingTimeCategory)];
    if (recipe.dietPreference !== 'unrestricted') {
      tags.unshift(this.toDisplayLabel(recipe.dietPreference));
    }
    return tags;
  }

  /** Requests one public page for the active cuisine. */
  private loadRecipePage(page: number): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.recipeLibraryService
      .loadRecipes({ cuisineStyle: this.cuisineStyle, page, pageSize: this.pageSize })
      .subscribe({
        next: (response): void => {
          if (response.pagination.totalPages > 0 && page > response.pagination.totalPages) {
            const lastPage: number = response.pagination.totalPages;
            void this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: { page: lastPage === 1 ? null : lastPage },
              queryParamsHandling: 'merge',
              replaceUrl: true,
            });
            return;
          }

          this.recipes.set(response.recipes);
          this.totalPages.set(response.pagination.totalPages);
          this.isLoading.set(false);
        },
        error: (): void => {
          this.recipes.set([]);
          this.totalPages.set(0);
          this.loadError.set('The recipes could not be loaded.');
          this.isLoading.set(false);
        },
      });
  }

  /** Parses a positive route page and falls back to the first page. */
  private parsePage(value: string | null): number {
    const page: number = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  /** Checks whether one route value is a supported cuisine style. */
  private isCuisineStyle(value: string): value is CuisineStyle {
    return CUISINE_STYLES.some((cuisineStyle: CuisineStyle): boolean => cuisineStyle === value);
  }

  /** Converts one API enum value into a user-facing label. */
  private toDisplayLabel(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
