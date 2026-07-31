# Project Structure

Description of each folder/file in this Recipe App (React + TypeScript).

```
RecipeBox/
├── public/                  # Static assets served as-is (favicon, icons)
├── src/
│   ├── assets/               # Images, icons, and other static media used in components
│   ├── components/           # Reusable, presentational UI building blocks
│   │   ├── RecipeForm/         # Form for adding a new recipe (title, instructions, ingredients)
│   │   ├── RecipeList/         # Renders the list/grid of recipe cards
│   │   ├── RecipeCard/         # Single recipe preview (title, ingredients summary, delete button)
│   │   ├── SearchBar/          # Search input for filtering recipes by name/ingredient
│   │   └── IngredientInput/    # Repeatable input row for adding ingredients within a recipe form
│   ├── pages/                # Top-level views composed of components, mapped to routes/screens
│   │   ├── Home.tsx            # Search bar + recipe list view (browse/delete recipes)
│   │   └── AddRecipe.tsx       # Page for creating a new recipe
│   ├── hooks/                 # Custom React hooks encapsulating stateful logic
│   │   └── useRecipes.ts        # Add/delete/search logic and recipe state management
│   ├── context/               # React Context providers for global/shared state
│   │   └── RecipeContext.tsx    # Provides recipe state and actions across the app
│   ├── types/                  # Shared TypeScript type/interface definitions
│   │   └── recipe.ts            # Recipe and Ingredient interfaces
│   ├── services/               # Data access layer (persistence/API calls)
│   │   └── recipeStorage.ts     # Reads/writes recipes (e.g. localStorage or backend API)
│   ├── utils/                  # Small, pure helper functions
│   │   └── search.ts            # Filtering/matching logic used by the search feature
│   ├── App.tsx                # Root component; sets up routing/layout
│   ├── main.tsx                # Application entry point (renders App into the DOM)
│   └── index.css              # Global styles
├── index.html                # HTML entry point loaded by Vite
├── package.json               # Project dependencies and scripts
├── tsconfig*.json              # TypeScript compiler configuration
└── vite.config.ts             # Vite build/dev server configuration
```

Each empty folder currently contains a `.gitkeep` placeholder so it can be tracked by git until real files are added.
