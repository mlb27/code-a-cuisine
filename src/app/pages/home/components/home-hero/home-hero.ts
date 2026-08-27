import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays the introductory content and navigation actions on the home page. */
@Component({
  selector: 'app-home-hero',
  imports: [RouterLink],
  templateUrl: './home-hero.html',
  styleUrl: './home-hero.scss',
})
export class HomeHero {}
