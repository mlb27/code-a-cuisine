import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { RECIPE_LIKE_WEBHOOK_URL } from '../config/recipe-api.config';
import { RecipeLikeResponse } from '../models/recipe-like';

const LIKED_RECIPE_STORAGE_KEY = 'code-a-cuisine-liked-recipes';

/** Persists recipe hearts and manages the current browser's liked recipes. */
@Injectable({
  providedIn: 'root',
})
export class RecipeLikeService {
  private readonly httpClient = inject(HttpClient);
  private readonly likeWebhookUrl = inject(RECIPE_LIKE_WEBHOOK_URL);
  private readonly likedRecipeIdsState: WritableSignal<ReadonlySet<string>> = signal(
    this.loadLikedRecipeIds(),
  );

  /** Adds or removes one persisted heart and remembers the browser-local state. */
  public setRecipeLike(recipeId: string, liked: boolean): Observable<RecipeLikeResponse> {
    return this.httpClient.post<RecipeLikeResponse>(this.likeWebhookUrl, { liked, recipeId }).pipe(
      tap((response: RecipeLikeResponse): void => {
        if (!this.isLikeResponse(response, recipeId, liked)) {
          throw new Error('The recipe workflow returned an invalid like response.');
        }

        this.storeRecipeLike(recipeId, liked);
      }),
    );
  }

  /** Returns whether this browser has already given the recipe a heart. */
  public isRecipeLiked(recipeId: string): boolean {
    return this.likedRecipeIdsState().has(recipeId);
  }

  /** Adds or removes one ID from the local set and persists a new immutable copy. */
  private storeRecipeLike(recipeId: string, liked: boolean): void {
    const likedRecipeIds: Set<string> = new Set(this.likedRecipeIdsState());
    liked ? likedRecipeIds.add(recipeId) : likedRecipeIds.delete(recipeId);
    this.likedRecipeIdsState.set(likedRecipeIds);
    this.persistLikedRecipeIds(likedRecipeIds);
  }

  /** Restores valid recipe IDs from local storage. */
  private loadLikedRecipeIds(): ReadonlySet<string> {
    try {
      const storedValue: string | null =
        this.getStorage()?.getItem(LIKED_RECIPE_STORAGE_KEY) ?? null;
      if (!storedValue) return new Set<string>();
      const parsedValue: unknown = JSON.parse(storedValue);
      return new Set(
        Array.isArray(parsedValue)
          ? parsedValue.filter((value: unknown): value is string => typeof value === 'string')
          : [],
      );
    } catch {
      return new Set<string>();
    }
  }

  /** Writes the browser-local recipe IDs when local storage is available. */
  private persistLikedRecipeIds(likedRecipeIds: ReadonlySet<string>): void {
    try {
      this.getStorage()?.setItem(LIKED_RECIPE_STORAGE_KEY, JSON.stringify([...likedRecipeIds]));
    } catch {
      return;
    }
  }

  /** Returns local storage when the current environment supports it. */
  private getStorage(): Storage | null {
    return typeof globalThis.localStorage === 'undefined' ? null : globalThis.localStorage;
  }

  /** Checks the minimum response shape required after changing a heart. */
  private isLikeResponse(response: RecipeLikeResponse, recipeId: string, liked: boolean): boolean {
    return (
      response?.success === true &&
      response.recipeId === recipeId &&
      response.liked === liked &&
      Number.isInteger(response.likesCount) &&
      response.likesCount >= 0
    );
  }
}
