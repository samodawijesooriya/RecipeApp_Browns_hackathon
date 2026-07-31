import React from "react";
import { Timer, Flame, Heart } from "lucide-react";
import type { CardTheme, PinColor, RecipeCardData } from "./types";

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

export const PushPin: React.FC<{ color: PinColor }> = ({ color }) => (
  <span
    className={`absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full shadow-sm ring-2 ring-white ${pinStyles[color]}`}
    aria-hidden="true"
  />
);

export const Tape: React.FC = () => (
  <span
    className="absolute -top-2 left-1/2 -translate-x-1/2 h-5 w-14 rounded-sm bg-white/60 shadow-sm rotate-1"
    aria-hidden="true"
  />
);

export const Paperclip: React.FC = () => (
  <span
    className="absolute -top-3 right-6 h-7 w-4 rounded-t-full border-2 border-slate-400/70 bg-transparent rotate-6"
    aria-hidden="true"
  />
);

interface RecipeCardProps {
  recipe: RecipeCardData;
  rotate?: string;
  onClick?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  rotate = "-rotate-1",
  onClick,
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
      onClick={onClick}
      className={`relative ${themeStyles[theme]} ${rotate} rounded-xl p-4 pt-6 shadow-[0_6px_16px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition-transform duration-200 cursor-pointer`}
    >
      {pin && <PushPin color={pin} />}
      {tapeStyle === "tape" && <Tape />}
      {tapeStyle === "clip" && <Paperclip />}
      {tapeStyle === "pin" && <PushPin color="yellow" />}

      <h3 className="font-serif text-lg font-semibold text-slate-800 mb-3">
        {title}
      </h3>

      <div className="relative overflow-hidden rounded-lg mb-3 aspect-[4/3] bg-slate-200">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
            No photo
          </div>
        )}
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

export default RecipeCard;