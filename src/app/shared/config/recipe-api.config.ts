import { InjectionToken } from '@angular/core';

/** Public endpoint used to start the recipe-generation workflow. */
export const recipeGenerationWebhookUrl = 'http://localhost:5678/webhook/generate-recipe';

/** Public endpoint used to restore stored recipe results. */
export const recipeLookupWebhookUrl = 'http://localhost:5678/webhook/recipes';

/** Makes the workflow URL replaceable for local and hosted environments. */
export const RECIPE_GENERATION_WEBHOOK_URL = new InjectionToken<string>(
  'RECIPE_GENERATION_WEBHOOK_URL',
);

/** Makes the recipe lookup URL replaceable for local and hosted environments. */
export const RECIPE_LOOKUP_WEBHOOK_URL = new InjectionToken<string>('RECIPE_LOOKUP_WEBHOOK_URL');
