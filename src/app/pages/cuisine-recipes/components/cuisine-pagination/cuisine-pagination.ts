import { Component, EventEmitter, Input, Output } from '@angular/core';

type PaginationEntry = number | 'ellipsis';

/** Displays the cookbook pagination controls. */
@Component({
  selector: 'app-cuisine-pagination',
  templateUrl: './cuisine-pagination.html',
  styleUrl: './cuisine-pagination.scss',
})
export class CuisinePagination {
  @Input({ required: true }) currentPage = 1;
  @Input({ required: true }) totalPages = 1;
  @Output() readonly pageChange = new EventEmitter<number>();

  /** Returns a compact page list while keeping the first and last page visible. */
  protected get visibleEntries(): PaginationEntry[] {
    if (this.totalPages <= 7) {
      return Array.from({ length: this.totalPages }, (_, index: number): number => index + 1);
    }

    const pageNumbers: number[] = [
      1,
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      this.totalPages,
    ]
      .filter((page: number): boolean => page >= 1 && page <= this.totalPages)
      .filter(
        (page: number, index: number, pages: number[]): boolean => pages.indexOf(page) === index,
      )
      .sort((firstPage: number, secondPage: number): number => firstPage - secondPage);

    return pageNumbers.flatMap((page: number, index: number): PaginationEntry[] => {
      const previousPage: number | undefined = pageNumbers[index - 1];
      return previousPage !== undefined && page - previousPage > 1 ? ['ellipsis', page] : [page];
    });
  }

  /** Emits one valid page selected by a pagination control. */
  protected selectPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
