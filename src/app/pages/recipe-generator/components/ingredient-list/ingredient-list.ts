import { Component } from '@angular/core';

interface IngredientListEntry {
  amount: string;
  name: string;
  editLabel: string;
  deleteLabel: string;
}

/** Displays the ingredients currently selected for recipe generation. */
@Component({
  selector: 'app-ingredient-list',
  imports: [],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList {
  protected readonly ingredients: readonly IngredientListEntry[] = [
    {
      amount: '100g',
      name: 'Pasta',
      editLabel: 'Edit Pasta',
      deleteLabel: 'Delete Pasta',
    },
    {
      amount: '100g',
      name: 'Baby spinach',
      editLabel: 'Edit Baby spinach',
      deleteLabel: 'Delete Baby spinach',
    },
    {
      amount: '150g',
      name: 'Cherry tomatoes',
      editLabel: 'Edit Cherry tomatoes',
      deleteLabel: 'Delete Cherry tomatoes',
    },
    {
      amount: '1 pc',
      name: 'Egg',
      editLabel: 'Edit Egg',
      deleteLabel: 'Delete Egg',
    },
  ];
}
