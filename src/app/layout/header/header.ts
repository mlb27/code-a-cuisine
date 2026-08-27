import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type HeaderBackgroundTheme = 'dark' | 'light';

/** Displays the shared Code à Cuisine header. */
@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() backgroundTheme: HeaderBackgroundTheme = 'dark';
  @Input() backLabel = '';
  @Input() backLink = '';

  protected readonly logoPaths: Record<HeaderBackgroundTheme, string> = {
    dark: 'img/logo/code-a-cuisine-logo.svg',
    light: 'img/logo/code-a-cuisine-logo-green.svg',
  };
}
