# Configuration Management

This directory contains centralized configuration files for the BrandBuddy application.

## `app-config.json`

This file contains the main application configuration including categories and cities that are used throughout the application.

### Categories

Categories are used in:
- Browse sponsors filter dropdown
- Add brand form category selection
- Edit brand page category selection

To add or remove categories:
1. Open `config/app-config.json`
2. Modify the `categories` array
3. Save the file - changes will be automatically reflected across the entire application

### Cities

Cities are used in:
- Add brand form location selection
- Edit brand page location selection

To add or remove cities:
1. Open `config/app-config.json`
2. Modify the `cities` array
3. Save the file - changes will be automatically reflected across the entire application

### Example

```json
{
  "categories": [
    "Technology",
    "Food & Beverage",
    "Your New Category"
  ],
  "cities": [
    "New York, NY",
    "Los Angeles, CA",
    "Your New City, STATE"
  ]
}
```

## How It Works

The configuration is accessed through utility functions in `lib/config.ts`:

- `getCategories()` - Returns all available categories
- `getCities()` - Returns all available cities
- `isValidCategory(category)` - Checks if a category is valid
- `isValidCity(city)` - Checks if a city is valid

These functions are used throughout the application to ensure consistency and make configuration changes easy to manage from a single location.

## Files That Use This Configuration

1. **`components/browse-sponsors/search-filters.tsx`** - Category filter dropdown
2. **`app/profile-settings/page.tsx`** - Add brand form (categories and cities)
3. **`app/edit-brand/[bid]/page.tsx`** - Edit brand form (categories and cities)

## Benefits

- **Centralized Management**: All categories and cities are managed from a single JSON file
- **Consistency**: Ensures the same options are available across all parts of the application
- **Easy Updates**: Adding or removing options requires changes to only one file
- **No Code Changes**: Configuration changes don't require code modifications or redeployment 