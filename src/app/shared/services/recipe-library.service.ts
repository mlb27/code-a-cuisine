import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RECIPE_LOOKUP_WEBHOOK_URL } from '../config/recipe-api.config';
import { RecipeListQuery, RecipeListResponse } from '../models/recipe-library';

/** Loads filtered and paginated public recipe lists. */
@Injectable({
  providedIn: 'root',
})
export class RecipeLibraryService {
  private readonly httpClient = inject(HttpClient);
  private readonly lookupWebhookUrl = inject(RECIPE_LOOKUP_WEBHOOK_URL);

  /** Requests one filtered and paginated page of public recipes. */
  public loadRecipes(query: RecipeListQuery = {}): Observable<RecipeListResponse> {
    const page: number = query.page ?? 1;
    const pageSize: number = query.pageSize ?? 20;
    const sort: string = query.sort ?? 'latest';
    let params: HttpParams = new HttpParams()
      .set('view', 'list')
      .set('page', String(page))
      .set('pageSize', String(pageSize))
      .set('sort', sort);

    if (query.cuisineStyle) params = params.set('cuisine', query.cuisineStyle);
    return this.httpClient.get<RecipeListResponse>(this.lookupWebhookUrl, { params });
  }
}
