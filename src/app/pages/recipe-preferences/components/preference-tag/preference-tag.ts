import { Component, Input } from '@angular/core';

/** Displays a selectable recipe preference and an optional hint. */
@Component({
  selector: 'app-preference-tag',
  templateUrl: './preference-tag.html',
  styleUrl: './preference-tag.scss',
})
export class PreferenceTag {
  @Input({ required: true }) label = '';
  @Input() hint = '';
}
