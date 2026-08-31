import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import {
  RECIPE_GENERATION_WEBHOOK_URL,
  RECIPE_LIKE_WEBHOOK_URL,
  RECIPE_LOOKUP_WEBHOOK_URL,
  recipeGenerationWebhookUrl,
  recipeLikeWebhookUrl,
  recipeLookupWebhookUrl,
} from './shared/config/recipe-api.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    {
      provide: RECIPE_GENERATION_WEBHOOK_URL,
      useValue: recipeGenerationWebhookUrl,
    },
    {
      provide: RECIPE_LOOKUP_WEBHOOK_URL,
      useValue: recipeLookupWebhookUrl,
    },
    {
      provide: RECIPE_LIKE_WEBHOOK_URL,
      useValue: recipeLikeWebhookUrl,
    },
  ],
};
