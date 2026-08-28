import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';

/** Displays the generated recipe suggestions. */
@Component({
  selector: 'app-recipe-results',
  imports: [Header],
  templateUrl: './recipe-results.html',
  styleUrl: './recipe-results.scss',
})
export class RecipeResults {}
