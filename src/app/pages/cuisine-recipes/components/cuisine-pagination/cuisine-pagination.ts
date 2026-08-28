import { Component } from '@angular/core';

/** Displays the cookbook pagination controls. */
@Component({
  selector: 'app-cuisine-pagination',
  templateUrl: './cuisine-pagination.html',
  styleUrl: './cuisine-pagination.scss',
})
export class CuisinePagination {
  protected readonly visiblePages = [1, 2, 3];
}
