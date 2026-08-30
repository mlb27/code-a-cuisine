import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  RECIPE_GENERATION_WEBHOOK_URL,
  recipeGenerationWebhookUrl,
} from './shared/config/recipe-api.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: RECIPE_GENERATION_WEBHOOK_URL,
      useValue: recipeGenerationWebhookUrl,
    },
  ],
};
