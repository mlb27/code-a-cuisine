/** Successful response after one recipe heart has changed. */
export interface RecipeLikeResponse {
  liked: boolean;
  likesCount: number;
  recipeId: string;
  success: true;
}
