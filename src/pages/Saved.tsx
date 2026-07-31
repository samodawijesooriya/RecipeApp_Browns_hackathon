import { useNavigate } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { Icon } from "../components/Icon";
import { noteDecor } from "../utils/noteStyle";

const SPINE_COLORS = [
  "#c0392b",
  "#2e6b5e",
  "#8e5ba6",
  "#b9770e",
  "#34558b",
  "#6d4c41",
];

/** Saved recipes as cookbooks standing on wooden shelves. */
export function Saved() {
  const { recipes, savedIds, toggleSave } = useRecipes();
  const navigate = useNavigate();

  const saved = recipes.filter((r) => savedIds.includes(r.id));

  // Group into shelves of 4 books
  const shelves: typeof saved[] = [];
  for (let i = 0; i < saved.length; i += 4) {
    shelves.push(saved.slice(i, i + 4));
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-12">
      <header className="mb-12">
        <h1 className="mb-2 text-4xl font-bold text-on-surface md:text-5xl">
          Saved Recipes
        </h1>
        <p className="text-lg text-on-surface-variant">
          Your personal cookbook shelf. Pull a book down to start cooking.
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="py-20 text-center">
          <Icon name="auto_stories" className="text-6xl text-on-surface-variant/40" />
          <p className="mt-4 font-hand text-2xl text-on-surface-variant">
            The shelf is empty — save a recipe and it'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex}>
              <div className="flex items-end justify-center gap-4 px-6 md:justify-start md:px-10">
                {shelf.map((recipe, bookIndex) => {
                  const decor = noteDecor(recipe.id);
                  const spine =
                    SPINE_COLORS[(shelfIndex * 4 + bookIndex) % SPINE_COLORS.length];
                  return (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                      title={recipe.title}
                      style={{
                        backgroundColor: spine,
                        transform: `rotate(${decor.rotation * 0.3}deg)`,
                      }}
                      className="group relative h-48 w-16 cursor-pointer rounded-t-sm rounded-b-[2px] shadow-md transition-all duration-300 hover:-translate-y-3 hover:shadow-xl md:h-56 md:w-20"
                    >
                      {/* Book cloth texture bands */}
                      <div className="absolute inset-x-0 top-3 h-1.5 bg-white/25" />
                      <div className="absolute inset-x-0 bottom-3 h-1.5 bg-white/25" />
                      <span
                        className="absolute inset-0 flex items-center justify-center px-1 text-center font-hand text-xs leading-tight font-semibold break-words text-white md:text-sm"
                        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                      >
                        {recipe.title}
                      </span>
                      {/* Unsave on hover */}
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${recipe.title} from shelf`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(recipe.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            toggleSave(recipe.id);
                          }
                        }}
                        className="absolute -top-2 -right-2 hidden h-6 w-6 items-center justify-center rounded-full bg-error text-white shadow-md group-hover:flex"
                      >
                        <Icon name="close" className="text-[14px]" />
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="wood-shelf h-4 w-full" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
