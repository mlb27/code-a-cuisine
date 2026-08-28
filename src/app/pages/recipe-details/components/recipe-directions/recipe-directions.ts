import { Component } from '@angular/core';

interface RecipeStep {
  number: number;
  title: string;
  description: string;
  chef: string;
  chefIcon: string;
  chefIconWidth: number;
}

/** Displays the individual cooking steps of a recipe. */
@Component({
  selector: 'app-recipe-directions',
  templateUrl: './recipe-directions.html',
  styleUrl: './recipe-directions.scss',
})
export class RecipeDirections {
  readonly steps: RecipeStep[] = [
    {
      number: 1,
      title: 'Cook the pasta',
      description:
        'Cook your noodles in boiling, salted water, until the pasta is al dente. Drain the pasta and reserve some of the pasta water.',
      chef: 'Chef 1',
      chefIcon: 'img/recipe-details/chef-one.png',
      chefIconWidth: 28,
    },
    {
      number: 2,
      title: 'Make the sauce',
      description:
        'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic, and saute until it starts to turn golden. Add the tomatoes, oregano, salt, and pepper, and cook for 3-4 minutes.',
      chef: 'Chef 2',
      chefIcon: 'img/recipe-details/chef-two.png',
      chefIconWidth: 25,
    },
    {
      number: 3,
      title: 'Finish the pasta',
      description:
        'Add the noodles to the sauce, then add pasta water until the sauce is the right consistency. Simmer for 1 minute, then add the spinach, basil, chili flakes, and parmesan.',
      chef: 'Chef 1',
      chefIcon: 'img/recipe-details/chef-one.png',
      chefIconWidth: 28,
    },
    {
      number: 4,
      title: 'Make the sauce',
      description:
        'Lower the heat to low, stir until mixed, and remove from the heat. Season to taste, top with parmesan cheese, and enjoy.',
      chef: 'Chef 2',
      chefIcon: 'img/recipe-details/chef-two.png',
      chefIconWidth: 25,
    },
  ];
}
