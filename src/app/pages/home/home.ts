import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';
import { HomeHero } from './components/home-hero/home-hero';

/** Displays the Code à Cuisine home page. */
@Component({
  selector: 'app-home',
  imports: [Header, HomeHero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
