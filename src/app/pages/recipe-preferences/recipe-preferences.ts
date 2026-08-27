import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';
import { PreferenceCounter } from './components/preference-counter/preference-counter';

/** Displays the second step of the recipe generator. */
@Component({
  selector: 'app-recipe-preferences',
  imports: [Header, PreferenceCounter],
  templateUrl: './recipe-preferences.html',
  styleUrl: './recipe-preferences.scss',
})
export class RecipePreferences {}
