import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';
import { PreferenceCounter } from './components/preference-counter/preference-counter';
import { PreferenceTag } from './components/preference-tag/preference-tag';

interface PreferenceOption {
  label: string;
  width: number;
  hint?: string;
}

/** Displays the second step of the recipe generator. */
@Component({
  selector: 'app-recipe-preferences',
  imports: [Header, PreferenceCounter, PreferenceTag],
  templateUrl: './recipe-preferences.html',
  styleUrl: './recipe-preferences.scss',
})
export class RecipePreferences {
  protected readonly cookingTimeOptions: PreferenceOption[] = [
    { label: 'Quick', width: 83, hint: 'up to 20 min' },
    { label: 'Medium', width: 102, hint: '25-40 min' },
    { label: 'Complex', width: 110, hint: 'over 45 min' },
  ];

  protected readonly cuisineOptions: PreferenceOption[] = [
    { label: 'German', width: 100 },
    { label: 'Italian', width: 82 },
    { label: 'Indian', width: 82 },
    { label: 'Japanese', width: 117 },
    { label: 'Gourmet', width: 107 },
    { label: 'Fusion', width: 85 },
  ];

  protected readonly dietOptions: PreferenceOption[] = [
    { label: 'Vegetarian', width: 128 },
    { label: 'Vegan', width: 85 },
    { label: 'Keto', width: 68 },
    { label: 'No preferences', width: 169 },
  ];
}
