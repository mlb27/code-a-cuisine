import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays one cuisine category with its representative dish. */
@Component({
  selector: 'app-cuisine-card',
  imports: [RouterLink],
  templateUrl: './cuisine-card.html',
  styleUrl: './cuisine-card.scss',
})
export class CuisineCard {
  @Input({ required: true }) name = '';
  @Input({ required: true }) slug = '';
  @Input({ required: true }) emoji = '';
  @Input({ required: true }) imageSource = '';
  @Input({ required: true }) imageAlt = '';
}
