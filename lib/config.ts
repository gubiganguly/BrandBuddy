import appConfig from '@/config/app-config.json';

export interface AppConfig {
  categories: string[];
  cities: string[];
}

/**
 * Get the application configuration for categories and cities
 * This reads from the centralized config/app-config.json file
 */
export function getAppConfig(): AppConfig {
  return {
    categories: appConfig.categories,
    cities: appConfig.cities
  };
}

/**
 * Get available categories for brand selection
 */
export function getCategories(): string[] {
  return appConfig.categories;
}

/**
 * Get available cities for location selection
 */
export function getCities(): string[] {
  return appConfig.cities;
}

/**
 * Check if a category is valid
 */
export function isValidCategory(category: string): boolean {
  return appConfig.categories.includes(category);
}

/**
 * Check if a city is valid
 */
export function isValidCity(city: string): boolean {
  return appConfig.cities.includes(city);
} 