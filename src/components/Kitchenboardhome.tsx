import React, { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import RecipeCard from "../components/recipeCard";
import AddRecipeModal from "../components/addRecipeModel";
import { useRecipes } from "./useRecipes";
import type { CardTheme, NewRecipeInput, PinColor, RecipeCardData, StoredRecipe } from "./types";

/**
 * KitchenBoard — "Today's Picks" home page
 * -----------------------------------------------------------------------
 * A corkboard / pinboard style layout: recipe cards look like sticky notes
 * and photos pinned to a wall. "Commit Recipe" opens a modal form; recipes
 * committed there are saved to localStorage and appear in a
 * "Your Recipes" section below.
 *
 * Requires: Tailwind CSS + `npm install lucide-react`
 */

// ---------------------------------------------------------------------------
// Static demo content — swap out for real data / API results
// ---------------------------------------------------------------------------

const todaysPicks: RecipeCardData[] = [
  {
    id: "lemon-herb-salmon",
    title: "Lemon Herb Salmon",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
    theme: "teal",
    pin: "red",
    time: "25m",
    calories: "420 kcal",
  },
  {
    id: "avocado-toast-supreme",
    title: "Avocado Toast Supreme",
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop",
    theme: "yellow",
    pin: "green",
    excerpt:
      "The secret is rubbing the toasted sourdough with raw garlic before mashing the avo...",
  },
  {
    id: "berry-smoothie-bowl",
    title: "Berry Smoothie Bowl",
    image:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&h=400&fit=crop",
    theme: "pink",
    time: "10m",
    liked: true,
    tapeStyle: "tape",
  },
];

const recentlyApproved: RecipeCardData[] = [
  {
    id: "creamy-tomato-soup",
    title: "Creamy Tomato Soup",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop",
    theme: "blue",
    approved: true,
    tapeStyle: "pin",
  },
  {
    id: "classic-carbonara",
    title: "Classic Carbonara",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop",
    theme: "mint",
    approved: true,
    tapeStyle: "clip",
  },
];

const cardThemes: CardTheme[] = ["teal", "yellow", "pink", "blue", "mint"];
const pinColors: PinColor[] = ["red", "green", "blue", "yellow"];
const rotations = ["-rotate-2", "-rotate-1", "rotate-1", "rotate-2"];

function pickFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** Converts a user-committed recipe into the shape RecipeCard renders. */
function toCardData(recipe: StoredRecipe, index: number): RecipeCardData {
  const firstIngredient = recipe.ingredients
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)[0];

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.photo ?? "",
    theme: pickFrom(cardThemes, index),
    pin: pickFrom(pinColors, index),
    time: recipe.prepTime || recipe.cookTime || undefined,
    excerpt: recipe.notes || firstIngredient || undefined,
  };
}

// ---------------------------------------------------------------------------
// Sidebar widgets
// ---------------------------------------------------------------------------

const SundayBrunchPolaroid: React.FC = () => (
  <div className="relative -rotate-2 bg-white rounded-md shadow-md p-2 pb-4 w-64">
    <span
      className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white shadow-sm"
      aria-hidden="true"
    />
    <div className="aspect-[4/3] overflow-hidden rounded-sm bg-slate-100">
      <img
        src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=375&fit=crop"
        alt="Sunday brunch spread"
        className="h-full w-full object-cover"
      />
    </div>
    <p className="mt-2 text-center font-serif text-sm text-slate-700">
      Sunday Brunch!
    </p>
  </div>
);

const TipOfTheDay: React.FC = () => (
  <div className="relative rotate-1 bg-yellow-50 border-l-4 border-rose-300 rounded-sm shadow-md p-4 w-64">
    <h4 className="font-serif font-semibold text-slate-800 mb-1">
      Tip of the Day
    </h4>
    <p className="text-sm text-slate-600 leading-snug">
      Keep avocados fresh longer by storing them with a cut onion in an
      airtight container!
    </p>
  </div>
);

// ---------------------------------------------------------------------------
// Nav bar
// ---------------------------------------------------------------------------

const navLinks = ["Home", "Community", "Library", "Saved", "Leaderboard"];

const NavBar: React.FC<{ onCommitRecipeClick: () => void }> = ({
  onCommitRecipeClick,
}) => (
  <header className="flex items-center justify-between px-8 py-4 bg-[#fbf3ee]/90 backdrop-blur border-b border-black/5">
    <span className="font-serif text-xl text-slate-700">KitchenBoard</span>

    <nav className="hidden md:flex items-center gap-8 text-slate-600">
      {navLinks.map((link) => (
        <a
          key={link}
          href="#"
          className={`text-sm font-medium pb-1 ${
            link === "Home"
              ? "text-slate-900 border-b-2 border-slate-800"
              : "hover:text-slate-900"
          }`}
        >
          {link}
        </a>
      ))}
    </nav>

    <div className="flex items-center gap-4">
      <button
        aria-label="Notifications"
        className="text-slate-600 hover:text-slate-900"
      >
        <Bell className="h-5 w-5" />
      </button>
      <button
        onClick={onCommitRecipeClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
      >
        Commit Recipe
      </button>
      <img
        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop"
        alt="Your profile"
        className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow"
      />
    </div>
  </header>
);

// ---------------------------------------------------------------------------
// Section heading with underline flourish
// ---------------------------------------------------------------------------

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="font-serif text-4xl font-extrabold text-slate-900 mb-6 pb-2 border-b-2 border-slate-800/70 inline-block">
    {children}
  </h2>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const KitchenBoardHome: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { recipes, addRecipe } = useRecipes();

  const yourRecipeCards = useMemo(
    () => recipes.map((r, i) => toCardData(r, i)),
    [recipes]
  );

  const handleCommit = (input: NewRecipeInput) => {
    addRecipe(input);
  };

  return (
    <div
      className="min-h-screen bg-[#fbf3ee]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <NavBar onCommitRecipeClick={() => setModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-10">
          {/* Sidebar */}
          <aside className="flex flex-col items-center lg:items-start gap-8">
            <SundayBrunchPolaroid />
            <TipOfTheDay />
          </aside>

          {/* Main content */}
          <div>
            <SectionHeading>Today&apos;s Picks</SectionHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <RecipeCard recipe={todaysPicks[0]} rotate="-rotate-1" />
              <RecipeCard recipe={todaysPicks[1]} rotate="rotate-1" />
              <RecipeCard recipe={todaysPicks[2]} rotate="-rotate-2" />
            </div>

            <SectionHeading>Recently Approved</SectionHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 max-w-3xl">
              <RecipeCard recipe={recentlyApproved[0]} rotate="rotate-1" />
              <RecipeCard recipe={recentlyApproved[1]} rotate="-rotate-1" />
            </div>

            {/* Recipes the user has committed themselves, from localStorage */}
            {yourRecipeCards.length > 0 && (
              <>
                <SectionHeading>Your Recipes</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {yourRecipeCards.map((card, i) => (
                    <RecipeCard
                      key={card.id}
                      recipe={card}
                      rotate={pickFrom(rotations, i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <AddRecipeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCommit={handleCommit}
      />
    </div>
  );
};

export default KitchenBoardHome;