import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';

import {
  getIngredientSuggestions,
  getSupportedIngredient,
  isSupportedIngredient,
  normalizeIngredientName,
} from '../../../../shared/data/supported-ingredients';
import {
  Ingredient,
  IngredientDraft,
  IngredientSaveResult,
  INGREDIENT_UNIT_OPTIONS,
  IngredientUnit,
  IngredientUnitOption,
} from '../../../../shared/models/ingredient';
import { RecipeGeneratorService } from '../../../../shared/services/recipe-generator.service';
import { IngredientSuggestions } from '../ingredient-suggestions/ingredient-suggestions';

const MAX_INGREDIENT_AMOUNT: number = 100000;
const MAX_INGREDIENT_NAME_LENGTH: number = 50;
const MINIMUM_SUGGESTION_QUERY_LENGTH: number = 1;
const MAXIMUM_VISIBLE_SUGGESTIONS: number = 8;

const supportedIngredientValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: unknown = control.value;
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  return isSupportedIngredient(value) ? null : { unsupportedIngredient: true };
};

interface IngredientFormControls {
  amount: FormControl<number | null>;
  name: FormControl<string>;
  unit: FormControl<IngredientUnit>;
}

type IngredientFormGroup = FormGroup<IngredientFormControls>;

/** Displays and manages the ingredient entry form for the first generator step. */
@Component({
  selector: 'app-ingredient-input',
  imports: [IngredientSuggestions, ReactiveFormsModule],
  templateUrl: './ingredient-input.html',
  styleUrl: './ingredient-input.scss',
})
export class IngredientInput {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly recipeGeneratorService = inject(RecipeGeneratorService);

  protected readonly editingIngredient: Signal<Ingredient | null> =
    this.recipeGeneratorService.editingIngredient;
  protected readonly ingredientUnits: readonly IngredientUnitOption[] = INGREDIENT_UNIT_OPTIONS;
  protected readonly submissionError: WritableSignal<string | null> = signal(null);
  protected readonly submitted: WritableSignal<boolean> = signal(false);
  protected readonly ingredientQuery: WritableSignal<string> = signal('');
  protected readonly suggestionsOpen: WritableSignal<boolean> = signal(false);
  protected readonly activeSuggestionIndex: WritableSignal<number> = signal(0);
  protected readonly ingredientSuggestions: Signal<readonly string[]> = computed(
    (): readonly string[] => {
      const normalizedQuery: string = normalizeIngredientName(this.ingredientQuery());
      if (normalizedQuery.length < MINIMUM_SUGGESTION_QUERY_LENGTH) return [];
      return getIngredientSuggestions(normalizedQuery, MAXIMUM_VISIBLE_SUGGESTIONS);
    },
  );
  protected readonly suggestionPanelVisible: Signal<boolean> = computed(
    (): boolean =>
      this.suggestionsOpen() &&
      normalizeIngredientName(this.ingredientQuery()).length >= MINIMUM_SUGGESTION_QUERY_LENGTH,
  );
  protected readonly ingredientForm: IngredientFormGroup = this.formBuilder.group({
    amount: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
      Validators.max(MAX_INGREDIENT_AMOUNT),
    ]),
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/\S/),
      Validators.maxLength(MAX_INGREDIENT_NAME_LENGTH),
      supportedIngredientValidator,
    ]),
    unit: this.formBuilder.nonNullable.control<IngredientUnit>('gram', Validators.required),
  });

  constructor() {
    effect((): void => this.populateForm(this.editingIngredient()));
  }

  /** Validates and saves the current ingredient form values. */
  protected onSubmit(): void {
    this.submitted.set(true);
    this.ingredientForm.markAllAsTouched();

    if (this.ingredientForm.invalid) {
      this.focusFirstInvalidControl();
      return;
    }

    this.handleSaveResult(this.recipeGeneratorService.saveIngredient(this.createDraft()));
  }

  /** Returns whether an invalid control should currently show feedback. */
  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  /** Returns the currently relevant validation or submission message. */
  protected validationMessage(): string | null {
    if (this.submissionError()) return this.submissionError();
    if (this.showError(this.ingredientForm.controls.name)) return this.getNameError();
    if (this.showError(this.ingredientForm.controls.amount)) return this.getAmountError();
    return null;
  }

  /** Clears a duplicate or submission error after the user changes a value. */
  protected clearSubmissionError(): void {
    this.submissionError.set(null);
  }

  /** Filters and opens the suggestions after the ingredient text changes. */
  protected onIngredientInput(): void {
    this.clearSubmissionError();
    this.ingredientQuery.set(this.ingredientForm.controls.name.value);
    this.activeSuggestionIndex.set(0);
    this.suggestionsOpen.set(true);
  }

  /** Reopens matching suggestions when the ingredient field receives focus. */
  protected showIngredientSuggestions(): void {
    this.suggestionsOpen.set(true);
  }

  /** Closes the suggestion panel when focus leaves the ingredient field. */
  protected hideIngredientSuggestions(): void {
    this.suggestionsOpen.set(false);
  }

  /** Supports keyboard navigation and selection in the ingredient listbox. */
  protected onIngredientKeydown(event: KeyboardEvent): void {
    const suggestions: readonly string[] = this.ingredientSuggestions();

    if (event.key === 'Escape') {
      this.hideIngredientSuggestions();
      return;
    }
    if (suggestions.length === 0) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction: number = event.key === 'ArrowDown' ? 1 : -1;
      const currentIndex: number = this.suggestionsOpen() ? this.activeSuggestionIndex() : 0;
      this.suggestionsOpen.set(true);
      this.activeSuggestionIndex.set(
        (currentIndex + direction + suggestions.length) % suggestions.length,
      );
      return;
    }

    if (event.key === 'Enter' && this.suggestionPanelVisible()) {
      event.preventDefault();
      this.selectIngredient(suggestions[this.activeSuggestionIndex()]);
    }
  }

  /** Applies one canonical catalog entry to the ingredient form. */
  protected selectIngredient(ingredient: string): void {
    this.ingredientForm.controls.name.setValue(ingredient);
    this.ingredientForm.controls.name.markAsDirty();
    this.ingredientQuery.set(ingredient);
    this.hideIngredientSuggestions();
    this.clearSubmissionError();
  }

  /** Converts the valid form value into the shared ingredient draft shape. */
  private createDraft(): IngredientDraft {
    const formValue = this.ingredientForm.getRawValue();
    return {
      amount: formValue.amount ?? 0,
      name: getSupportedIngredient(formValue.name) ?? formValue.name,
      unit: formValue.unit,
    };
  }

  /** Updates the form whenever another ingredient is selected for editing. */
  private populateForm(ingredient: Ingredient | null): void {
    this.ingredientForm.reset({
      amount: ingredient?.amount ?? null,
      name: ingredient?.name ?? '',
      unit: ingredient?.unit ?? 'gram',
    });
    this.ingredientQuery.set(ingredient?.name ?? '');
    this.hideIngredientSuggestions();
    this.submitted.set(false);
    this.submissionError.set(null);
  }

  /** Applies feedback or resets the form after a save attempt. */
  private handleSaveResult(result: IngredientSaveResult): void {
    if (result === 'duplicate') {
      this.submissionError.set('This ingredient is already on your list.');
      return;
    }
    if (result === 'invalid') {
      this.submissionError.set('Enter valid ingredient details.');
      return;
    }
    this.populateForm(null);
  }

  /** Returns the validation message belonging to the ingredient name. */
  private getNameError(): string {
    if (this.ingredientForm.controls.name.hasError('maxlength')) {
      return `Use no more than ${MAX_INGREDIENT_NAME_LENGTH} characters.`;
    }
    return this.ingredientForm.controls.name.hasError('unsupportedIngredient')
      ? 'Choose an ingredient from the suggestions.'
      : 'Enter an ingredient.';
  }

  /** Returns the validation message belonging to the ingredient amount. */
  private getAmountError(): string {
    return this.ingredientForm.controls.amount.hasError('max')
      ? `Use an amount up to ${MAX_INGREDIENT_AMOUNT}.`
      : 'Enter an amount greater than 0.';
  }

  /** Moves keyboard focus to the first invalid field after submission. */
  private focusFirstInvalidControl(): void {
    setTimeout((): void => {
      this.elementRef.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
  }
}
