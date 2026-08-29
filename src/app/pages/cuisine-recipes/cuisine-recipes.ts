import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { CuisinePagination } from './components/cuisine-pagination/cuisine-pagination';
import { CuisineRecipeCard } from './components/cuisine-recipe-card/cuisine-recipe-card';

interface RecipeTemplate {
  title: string;
  cookingTime: string;
  likes: number;
  tags: string[];
}

interface CuisineRecipe extends RecipeTemplate {
  number: number;
}

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
export class CuisineRecipes {
  protected readonly cuisine: CuisineDetails;

  private readonly cuisines: Record<string, CuisineDetails> = {
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

  private readonly recipeTemplates: RecipeTemplate[] = [
    {
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: '20min',
      likes: 66,
      tags: ['Vegetarian', 'Quick'],
    },
    {
      title: 'Creamy garlic shrimp pasta',
      cookingTime: '22min',
      likes: 32,
      tags: ['Quick'],
    },
    {
      title: 'Funghi salami pizza',
      cookingTime: '16min',
      likes: 42,
      tags: ['Quick'],
    },
  ];

  protected readonly recipes: CuisineRecipe[] = Array.from({ length: 15 }, (_, index) => ({
    ...this.recipeTemplates[index % this.recipeTemplates.length],
    number: index + 1,
  }));

  constructor(route: ActivatedRoute) {
    const cuisineSlug = route.snapshot.paramMap.get('cuisine')?.toLowerCase() ?? 'italian';
    this.cuisine = this.cuisines[cuisineSlug] ?? this.cuisines['italian'];
  }
}
