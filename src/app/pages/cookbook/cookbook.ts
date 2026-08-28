import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../layout/header/header';
import { CuisineCard } from './components/cuisine-card/cuisine-card';
import { MostLikedRecipeCard } from './components/most-liked-recipe-card/most-liked-recipe-card';

interface MostLikedRecipe {
  title: string;
  cookingTime: string;
  likes: number;
}

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
export class Cookbook {
  protected readonly mostLikedRecipes: MostLikedRecipe[] = [
    {
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: '20min',
      likes: 66,
    },
    {
      title: 'Low Carb Vegan No-Bake Paleo Bars',
      cookingTime: '35min',
      likes: 57,
    },
    {
      title: 'Schnitzel with fries',
      cookingTime: '35min',
      likes: 93,
    },
    {
      title: 'Pasta with spinach and cherry tomatoes',
      cookingTime: '20min',
      likes: 66,
    },
    {
      title: 'Low Carb Vegan No-Bake Paleo Bars',
      cookingTime: '35min',
      likes: 57,
    },
  ];

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
}
