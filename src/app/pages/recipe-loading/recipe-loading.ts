import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Header } from '../../layout/header/header';

/** Displays the recipe generation loading state. */
@Component({
  selector: 'app-recipe-loading',
  imports: [Header],
  templateUrl: './recipe-loading.html',
  styleUrl: './recipe-loading.scss',
})
export class RecipeLoading implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private redirectTimerId: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    // Temporary delay so the loading animation is visible during development
    this.redirectTimerId = setTimeout(() => {
      void this.router.navigateByUrl('/results');
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.redirectTimerId !== undefined) {
      clearTimeout(this.redirectTimerId);
    }
  }
}
