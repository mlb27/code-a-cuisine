import { Component } from '@angular/core';

import { Header } from '../../layout/header/header';

/** Displays the Code à Cuisine home page. */
@Component({
  selector: 'app-home',
  imports: [Header],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
