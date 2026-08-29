/** Units supported by the ingredient form and generator request. */
export type IngredientUnit = 'gram' | 'liter' | 'piece';

/** Describes one selectable ingredient unit. */
export interface IngredientUnitOption {
  abbreviation: string;
  label: string;
  value: IngredientUnit;
}

/** Units displayed in the ingredient form. */
export const INGREDIENT_UNIT_OPTIONS: readonly IngredientUnitOption[] = [
  { abbreviation: 'g', label: 'gram', value: 'gram' },
  { abbreviation: 'pc', label: 'piece', value: 'piece' },
  { abbreviation: 'l', label: 'liter', value: 'liter' },
];

/** Ingredient stored in the current recipe-generation session. */
export interface Ingredient {
  amount: number;
  id: number;
  name: string;
  unit: IngredientUnit;
}

/** Ingredient values submitted by the entry form. */
export interface IngredientDraft {
  amount: number;
  name: string;
  unit: IngredientUnit;
}

/** Possible outcomes when an ingredient is saved. */
export type IngredientSaveResult = 'added' | 'duplicate' | 'invalid' | 'updated';
