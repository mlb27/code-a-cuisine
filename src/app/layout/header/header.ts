import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays the shared Code à Cuisine header. */
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
