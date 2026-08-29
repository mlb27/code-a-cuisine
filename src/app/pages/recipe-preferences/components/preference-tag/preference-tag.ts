import { Component, input, output } from '@angular/core';

/** Displays a selectable recipe preference and an optional hint. */
@Component({
  selector: 'app-preference-tag',
  templateUrl: './preference-tag.html',
  styleUrl: './preference-tag.scss',
})
export class PreferenceTag {
  public readonly hint = input('');
  public readonly label = input.required<string>();
  public readonly selected = input(false);
  public readonly selectionChange = output<void>();

  /** Notifies the parent that this preference was selected. */
  protected select(): void {
    this.selectionChange.emit();
  }
}
