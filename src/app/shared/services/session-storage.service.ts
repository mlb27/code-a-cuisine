import { Injectable } from '@angular/core';

/** Provides guarded access to values stored for the current browser session. */
@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  /** Reads one session value or returns null when storage is unavailable. */
  public get(key: string): string | null {
    try {
      return this.getStorage()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  /** Writes one session value when storage is available. */
  public set(key: string, value: string): void {
    try {
      this.getStorage()?.setItem(key, value);
    } catch {
      return;
    }
  }

  /** Returns session storage when the current environment supports it. */
  private getStorage(): Storage | null {
    return typeof globalThis.sessionStorage === 'undefined' ? null : globalThis.sessionStorage;
  }
}
