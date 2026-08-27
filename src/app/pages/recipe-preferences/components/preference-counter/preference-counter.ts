import { Component, Input } from '@angular/core';

/** Displays a preference value between decrement and increment controls. */
@Component({
  selector: 'app-preference-counter',
  templateUrl: './preference-counter.html',
  styleUrl: './preference-counter.scss',
})
export class PreferenceCounter {
  @Input({ required: true }) heading = '';
  @Input({ required: true }) itemLabel = '';
  @Input({ required: true }) value = 0;
}
