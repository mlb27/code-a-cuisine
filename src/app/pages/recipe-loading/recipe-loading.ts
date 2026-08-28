import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';

/** Displays the recipe generation loading state. */
@Component({
  selector: 'app-recipe-loading',
  imports: [Header],
  templateUrl: './recipe-loading.html',
  styleUrl: './recipe-loading.scss',
})
export class RecipeLoading {}
