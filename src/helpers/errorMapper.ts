export const baseErrorMessage = {
  // ERROR MESSAGES
  Unknown: "Unknown",
  ReachedCategoriesLimit: "ReachedCategoriesLimit",
  ReachedProductsLimit: "ReachedProductsLimit",
  ReachedRestaurantsLimit: "ReachedRestaurantsLimit",
  ReachedRequestsLimit: "ReachedRequestsLimit",
} as const;

export const errorMapper = (errorMessage: string) => {
  if (errorMessage in baseErrorMessage) {
    return baseErrorMessage[errorMessage as keyof typeof baseErrorMessage];
  }

  return baseErrorMessage.Unknown;
};
