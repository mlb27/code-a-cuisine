import { EXTENDED_INGREDIENTS } from './extended-ingredients';

const CORE_INGREDIENTS: readonly string[] = [
  'Almond',
  'Apple',
  'Apricot',
  'Artichoke',
  'Asparagus',
  'Avocado',
  'Bacon',
  'Baking powder',
  'Balsamic vinegar',
  'Banana',
  'Basil',
  'Bay leaf',
  'Beef',
  'Beetroot',
  'Bell pepper',
  'Black beans',
  'Black pepper',
  'Blue cheese',
  'Bread',
  'Breadcrumbs',
  'Broccoli',
  'Brown rice',
  'Brussels sprouts',
  'Butter',
  'Butternut squash',
  'Cabbage',
  'Carrot',
  'Cashew',
  'Cauliflower',
  'Celery',
  'Cheddar',
  'Cherry',
  'Cherry tomatoes',
  'Chicken',
  'Chickpeas',
  'Chili flakes',
  'Chili pepper',
  'Chocolate',
  'Cilantro',
  'Cinnamon',
  'Coconut milk',
  'Cod',
  'Corn',
  'Couscous',
  'Cream',
  'Cream cheese',
  'Cucumber',
  'Cumin',
  'Curry powder',
  'Dill',
  'Egg',
  'Eggplant',
  'Feta',
  'Flour',
  'Garlic',
  'Ginger',
  'Goat cheese',
  'Green beans',
  'Green lentils',
  'Green onion',
  'Ground beef',
  'Ham',
  'Hazelnut',
  'Honey',
  'Jalapeno',
  'Kale',
  'Kidney beans',
  'Lamb',
  'Leek',
  'Lemon',
  'Lentils',
  'Lime',
  'Maple syrup',
  'Milk',
  'Mint',
  'Mozzarella',
  'Mushroom',
  'Mustard',
  'Oats',
  'Olive oil',
  'Olives',
  'Onion',
  'Orange',
  'Oregano',
  'Parmesan',
  'Parsley',
  'Parsnip',
  'Passion fruit',
  'Pasta',
  'Pastrami',
  'Peach',
  'Peanut',
  'Peanut butter',
  'Pear',
  'Peas',
  'Pesto',
  'Pine nuts',
  'Pineapple',
  'Pork',
  'Potato',
  'Pumpkin',
  'Quinoa',
  'Red cabbage',
  'Red lentils',
  'Red onion',
  'Rice',
  'Ricotta',
  'Rosemary',
  'Salmon',
  'Salt',
  'Sausage',
  'Shrimp',
  'Soy sauce',
  'Spaghetti',
  'Spinach',
  'Spring onion',
  'Sweet potato',
  'Thyme',
  'Tofu',
  'Tomato',
  'Tomato paste',
  'Tomato sauce',
  'Tuna',
  'Turkey',
  'Walnut',
  'White beans',
  'Whole wheat pasta',
  'Yogurt',
  'Zucchini',
];

/** Ingredient names accepted by the generator and offered by its autocomplete. */
export const SUPPORTED_INGREDIENTS: readonly string[] = [
  ...new Set([...CORE_INGREDIENTS, ...EXTENDED_INGREDIENTS]),
].sort((firstIngredient: string, secondIngredient: string): number =>
  firstIngredient.localeCompare(secondIngredient),
);

const INGREDIENT_ALIASES: Readonly<Record<string, string>> = {
  aubergine: 'Eggplant',
  aubergines: 'Eggplant',
  bicarb: 'Baking soda',
  'bicarbonate of soda': 'Baking soda',
  capsicum: 'Bell pepper',
  chickpea: 'Chickpeas',
  chilli: 'Chili pepper',
  'chilli flakes': 'Chili flakes',
  'chilli pepper': 'Chili pepper',
  coriander: 'Cilantro',
  cornflour: 'Cornstarch',
  courgette: 'Zucchini',
  courgettes: 'Zucchini',
  'confectioners sugar': 'Powdered sugar',
  'french beans': 'Green beans',
  'garbanzo bean': 'Chickpeas',
  'garbanzo beans': 'Chickpeas',
  'icing sugar': 'Powdered sugar',
  maize: 'Corn',
  mangold: 'Swiss chard',
  'minced beef': 'Ground beef',
  paprika: 'Bell pepper',
  passata: 'Tomato sauce',
  prawns: 'Shrimp',
  'plain flour': 'Flour',
  'rapeseed oil': 'Canola oil',
  rocket: 'Arugula',
  scallion: 'Green onion',
  scallions: 'Green onion',
  yoghurt: 'Yogurt',
  carrots: 'Carrot',
  eggs: 'Egg',
  lemons: 'Lemon',
  mushrooms: 'Mushroom',
  onions: 'Onion',
  potatoes: 'Potato',
  tomatoes: 'Tomato',
};

/** Produces the comparison value used for suggestions, validation, and duplicates. */
export function normalizeIngredientName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

/** Returns the catalog spelling for an ingredient name or null when it is unsupported. */
export function getSupportedIngredient(value: string): string | null {
  const normalizedValue: string = normalizeIngredientName(value);
  const catalogIngredient: string | undefined = SUPPORTED_INGREDIENTS.find(
    (ingredient: string): boolean => normalizeIngredientName(ingredient) === normalizedValue,
  );
  return catalogIngredient ?? INGREDIENT_ALIASES[normalizedValue] ?? null;
}

/** Returns unique catalog entries whose names or aliases begin with the query. */
export function getIngredientSuggestions(value: string, maximumResults: number): readonly string[] {
  const normalizedValue: string = normalizeIngredientName(value);
  if (normalizedValue.length === 0) return [];

  const suggestions: string[] = SUPPORTED_INGREDIENTS.filter((ingredient: string): boolean =>
    normalizeIngredientName(ingredient).startsWith(normalizedValue),
  );
  Object.entries(INGREDIENT_ALIASES).forEach(([alias, ingredient]: [string, string]): void => {
    if (alias.startsWith(normalizedValue)) suggestions.push(ingredient);
  });

  return [...new Set(suggestions)].slice(0, maximumResults);
}

/** Checks whether an ingredient name exists in the supported catalog. */
export function isSupportedIngredient(value: string): boolean {
  return getSupportedIngredient(value) !== null;
}
