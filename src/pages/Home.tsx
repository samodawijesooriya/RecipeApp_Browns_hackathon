import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../context/RecipeContext";
import { IMAGES, KITCHEN_TIP, SHOPPING_LIST } from "../data/mockData";
import { StickyNote } from "../components/StickyNote";
import { Icon } from "../components/Icon";

/** The refrigerator door: today's kitchen at a glance. */
export function Home() {
  const { recipes, savedIds } = useRecipes();

  const approved = useMemo(
    () => recipes.filter((r) => r.status === "approved" && !r.parentRecipeId),
    [recipes],
  );

  const todaysPicks = useMemo(
    () => [...approved].sort((a, b) => b.votes - a.votes).slice(0, 6),
    [approved],
  );

  const trending = useMemo(
    () =>
      [...approved]
        .sort(
          (a, b) =>
            b.forkCount * 3 + b.saveCount - (a.forkCount * 3 + a.saveCount),
        )
        .slice(0, 5),
    [approved],
  );

  const recentlyApproved = useMemo(
    () =>
      [...recipes]
        .filter((r) => r.status === "approved")
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    [recipes],
  );

  const savedNotes = recipes.filter((r) => savedIds.includes(r.id)).slice(0, 3);

  return (
    <main className="fridge-texture mx-auto w-full max-w-7xl px-4 py-10 md:px-12">
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Fridge-door sidebar */}
        <aside className="hidden space-y-12 lg:col-span-3 lg:block">
          {/* Family polaroid */}
          <div className="relative mx-auto w-full max-w-[200px] rotate-[-3deg] transform transition-transform hover:rotate-0">
            <div className="magnet mag-blue" />
            <div className="rounded-sm border border-surface-variant bg-white p-3 shadow-lg">
              <img
                src={IMAGES.familyPhoto}
                alt="Family cooking together"
                className="h-auto w-full border border-surface-variant object-cover sepia-[0.1]"
              />
              <p className="mt-2 text-center font-hand text-sm text-on-surface-variant">
                Sunday Brunch!
              </p>
            </div>
          </div>

          {/* Kitchen tip */}
          <div className="relative mx-auto w-full max-w-[220px] rotate-[4deg] border-l-4 border-l-red-300 bg-[#fffdf0] p-4 font-hand shadow-md">
            <div className="tape" />
            <h3 className="mb-2 font-bold text-primary">Tip of the Day</h3>
            <p className="text-sm text-on-surface-variant">{KITCHEN_TIP}</p>
          </div>

          {/* Shopping list */}
          <div className="pastel-yellow relative mx-auto w-full max-w-[220px] rotate-[-2deg] rounded-sm p-4 shadow-md">
            <div className="magnet mag-yellow" />
            <h3 className="mt-1 mb-2 font-hand font-bold text-on-surface">
              Shopping List
            </h3>
            <ul className="space-y-1.5 font-hand text-sm text-on-surface-variant">
              {SHOPPING_LIST.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-sm border border-on-surface-variant/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Saved recipes pinned note */}
          {savedNotes.length > 0 && (
            <div className="pastel-blue relative mx-auto w-full max-w-[220px] rotate-[2deg] rounded-sm p-4 shadow-md">
              <div className="magnet mag-red" />
              <h3 className="mt-1 mb-2 font-hand font-bold text-on-surface">
                From your cookbook
              </h3>
              <ul className="space-y-1.5 text-sm">
                {savedNotes.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/recipe/${r.id}`}
                      className="font-hand text-on-surface-variant underline-offset-2 hover:text-primary hover:underline"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/saved"
                className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
              >
                Open the shelf →
              </Link>
            </div>
          )}
        </aside>

        {/* Main fridge canvas */}
        <div className="space-y-16 lg:col-span-9">
          {/* Hero */}
          <section>
            <p className="mb-1 font-hand text-lg text-on-surface-variant">
              Good morning, the fridge is full of ideas.
            </p>
            <h1 className="relative inline-block text-4xl font-bold text-on-surface md:text-5xl">
              Today's Picks
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary to-transparent opacity-30" />
            </h1>
          </section>

          {/* Sticky note masonry */}
          <section className="masonry !mt-8">
            {todaysPicks.map((recipe) => (
              <div key={recipe.id} className="masonry-item">
                <StickyNote recipe={recipe} />
              </div>
            ))}
          </section>

          {/* Trending strip */}
          <section>
            <h2 className="mb-6 flex w-max items-center gap-2 border-b-2 border-surface-variant pb-2 text-2xl font-semibold text-on-surface">
              <Icon name="local_fire_department" className="text-orange-500" />
              Trending in the Kitchen
            </h2>
            <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-8">
              {trending.map((recipe) => (
                <div key={recipe.id} className="min-w-[240px] shrink-0 snap-start">
                  <StickyNote
                    recipe={recipe}
                    footer={
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-800">
                        {recipe.forkCount} forks · {recipe.saveCount} saves
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Recently approved strip */}
          <section>
            <h2 className="mb-6 flex w-max items-center gap-2 border-b-2 border-surface-variant pb-2 text-2xl font-semibold text-on-surface">
              <Icon name="verified" className="text-accent-green" />
              Recently Approved
            </h2>
            <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto pb-8">
              {recentlyApproved.map((recipe) => (
                <div key={recipe.id} className="min-w-[240px] shrink-0 snap-start">
                  <StickyNote
                    recipe={recipe}
                    footer={
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800">
                        Approved · v{recipe.version}
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
