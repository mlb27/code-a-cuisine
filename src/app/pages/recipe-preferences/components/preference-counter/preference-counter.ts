import { Component, computed, input, output, Signal } from '@angular/core';

/** Displays and controls one bounded numeric recipe preference. */
@Component({
  selector: 'app-preference-counter',
  templateUrl: './preference-counter.html',
  styleUrl: './preference-counter.scss',
})
export class PreferenceCounter {
  public readonly heading = input.required<string>();
  public readonly itemLabel = input.required<string>();
  public readonly maximum = input(Number.MAX_SAFE_INTEGER);
  public readonly minimum = input(0);
  public readonly pluralLabel = input('');
  public readonly value = input.required<number>();
  public readonly valueChange = output<number>();

  protected readonly canDecrement: Signal<boolean> = computed(
    (): boolean => this.value() > this.minimum(),
  );
  protected readonly canIncrement: Signal<boolean> = computed(
    (): boolean => this.value() < this.maximum(),
  );
  protected readonly displayedLabel: Signal<string> = computed((): string =>
    this.value() === 1 ? this.itemLabel() : this.pluralLabel() || `${this.itemLabel()}s`,
  );

  /** Requests the preceding value when the configured minimum allows it. */
  protected decrement(): void {
    this.changeValue(-1);
  }

  /** Requests the following value when the configured maximum allows it. */
  protected increment(): void {
    this.changeValue(1);
  }

  /** Emits a value only when it remains inside the configured range. */
  private changeValue(change: number): void {
    const nextValue: number = this.value() + change;
    if (nextValue < this.minimum() || nextValue > this.maximum()) return;
    this.valueChange.emit(nextValue);
  }
}
