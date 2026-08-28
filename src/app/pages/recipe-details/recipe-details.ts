import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';

/** Displays the details of a generated recipe. */
@Component({
  selector: 'app-recipe-details',
  imports: [Header],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.scss',
})
export class RecipeDetails {}
