import React from "react";
import { Bell, Timer, Flame, Heart } from "lucide-react";

/**
 * KitchenBoard — "Today's Picks" home page
 * -----------------------------------------------------------------------
 * A corkboard / pinboard style layout: recipe cards look like sticky notes
 * and photos pinned to a wall, complete with pushpin dots, tape, and a
 * paperclip. Built with Tailwind CSS utility classes + lucide-react icons.
 *
 * Drop this file into a React + TypeScript project that already has
 * Tailwind CSS configured. Install icons with:
 *   npm install lucide-react
 *
 * Everything is self-contained in this one file for easy copy/paste —
 * feel free to split RecipeCard / PolaroidNote / StickyNote / NavBar
 * into their own files as your project grows.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PinColor = "red" | "green" | "blue" | "yellow";

type CardTheme = "teal" | "yellow" | "pink" | "blue" | "mint";

interface RecipeCardData {
  id: string;
  title: string;
  image: string;
  theme: CardTheme;
  pin?: PinColor;
  time?: string;
  calories?: string;
  excerpt?: string;
  liked?: boolean;
  approved?: boolean;
  tapeStyle?: "tape" | "clip" | "pin";
}

// ---------------------------------------------------------------------------
// Static content — swap these out for real data / API results
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

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const themeStyles: Record<CardTheme, string> = {
  teal: "bg-teal-100",
  yellow: "bg-amber-100",
  pink: "bg-rose-100",
  blue: "bg-sky-100",
  mint: "bg-emerald-100",
};

const pinStyles: Record<PinColor, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
};

// ---------------------------------------------------------------------------
// Small pieces
// ---------------------------------------------------------------------------

const PushPin: React.FC<{ color: PinColor }> = ({ color }) => (
  <span
    className={`absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full shadow-sm ring-2 ring-white ${pinStyles[color]}`}
    aria-hidden="true"
  />
);

const Tape: React.FC = () => (
  <span
    className="absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-14 rounded-sm bg-white/60 shadow-sm rotate-1"
    aria-hidden="true"
  />
);

const Paperclip: React.FC = () => (
  <span
    className="absolute -top-3 right-6 h-7 w-4 rounded-t-full border-2 border-slate-400/70 bg-transparent rotate-6"
    aria-hidden="true"
  />
);

// ---------------------------------------------------------------------------
// Recipe / sticky-note card
// ---------------------------------------------------------------------------

const RecipeCard: React.FC<{ recipe: RecipeCardData; rotate?: string }> = ({
  recipe,
  rotate = "-rotate-1",
}) => {
  const {
    title,
    image,
    theme,
    pin,
    time,
    calories,
    excerpt,
    liked,
    approved,
    tapeStyle,
  } = recipe;

  return (
    <article
      className={`relative ${themeStyles[theme]} ${rotate} rounded-xl p-4 pt-6 shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform duration-200 cursor-pointer`}
    >
      {pin && <PushPin color={pin} />}
      {tapeStyle === "tape" && <Tape />}
      {tapeStyle === "clip" && <Paperclip />}
      {tapeStyle === "pin" && <PushPin color="yellow" />}

      <h3 className="font-serif text-lg font-semibold text-slate-800 mb-3">
        {title}
      </h3>

      <div className="relative overflow-hidden rounded-lg mb-3 aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {excerpt && (
        <p className="text-sm text-slate-600 leading-snug line-clamp-2">
          {excerpt}
        </p>
      )}

      {(time || calories || liked) && (
        <div className="flex items-center justify-between mt-1 text-sm text-slate-700">
          {time && (
            <span className="inline-flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {time}
            </span>
          )}
          {calories && (
            <span className="inline-flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {calories}
            </span>
          )}
          {liked && (
            <Heart className="h-5 w-5 ml-auto text-rose-400 fill-rose-400" />
          )}
        </div>
      )}

      {approved && (
        <span className="inline-block mt-3 rounded-full bg-emerald-200/80 px-3 py-1 text-xs font-medium text-emerald-800">
          Approved
        </span>
      )}
    </article>
  );
};

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

const NavBar: React.FC = () => (
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
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
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
  return (
    <div
      className="min-h-screen bg-[#fbf3ee]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <NavBar />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
              <RecipeCard recipe={recentlyApproved[0]} rotate="rotate-1" />
              <RecipeCard recipe={recentlyApproved[1]} rotate="-rotate-1" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KitchenBoardHome;