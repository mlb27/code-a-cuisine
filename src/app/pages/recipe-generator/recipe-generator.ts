import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';

/** Displays the recipe generator page. */
@Component({
  selector: 'app-recipe-generator',
  imports: [Header],
  templateUrl: './recipe-generator.html',
  styleUrl: './recipe-generator.scss',
})
export class RecipeGenerator {}
