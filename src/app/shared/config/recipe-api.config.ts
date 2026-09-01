import { InjectionToken } from '@angular/core';

/** Public endpoint used to start the recipe-generation workflow. */
export const recipeGenerationWebhookUrl =
  'https://morleon.app.n8n.cloud/webhook/generate-recipe';

/** Public endpoint used to restore stored recipe results. */
export const recipeLookupWebhookUrl = 'https://morleon.app.n8n.cloud/webhook/recipes';

/** Public endpoint used to add or remove one recipe heart. */
export const recipeLikeWebhookUrl = 'https://morleon.app.n8n.cloud/webhook/recipes/like';

/** Makes the workflow URL replaceable for local and hosted environments. */
export const RECIPE_GENERATION_WEBHOOK_URL = new InjectionToken<string>(
  'RECIPE_GENERATION_WEBHOOK_URL',
);

/** Makes the recipe lookup URL replaceable for local and hosted environments. */
export const RECIPE_LOOKUP_WEBHOOK_URL = new InjectionToken<string>('RECIPE_LOOKUP_WEBHOOK_URL');

/** Makes the recipe-like URL replaceable for local and hosted environments. */
export const RECIPE_LIKE_WEBHOOK_URL = new InjectionToken<string>('RECIPE_LIKE_WEBHOOK_URL');
