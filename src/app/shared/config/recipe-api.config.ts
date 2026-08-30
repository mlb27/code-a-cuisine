import { InjectionToken } from '@angular/core';

/** Public endpoint used to start the recipe-generation workflow. */
export const recipeGenerationWebhookUrl = 'http://localhost:5678/webhook/generate-recipe';

/** Makes the workflow URL replaceable for local and hosted environments. */
export const RECIPE_GENERATION_WEBHOOK_URL = new InjectionToken<string>(
  'RECIPE_GENERATION_WEBHOOK_URL',
);
