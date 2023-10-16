export const baseErrorMessage = {
  // ERROR MESSAGES
  Unknown: "Unknown",
  ReachedCategoriesLimit: "ReachedCategoriesLimit",
  ReachedProductsLimit: "ReachedProductsLimit",
  ReachedRestaurantsLimit: "ReachedRestaurantsLimit",
  // ERROR CODES
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
} as const;

export const errorMapper = (errorMessage: string) => {
  if (errorMessage in baseErrorMessage) {
    return baseErrorMessage[errorMessage as keyof typeof baseErrorMessage];
  }

  return baseErrorMessage.Unknown;
};
