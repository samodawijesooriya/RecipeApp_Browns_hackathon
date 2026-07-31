import { useState } from "react";
import { Icon } from "./Icon";

interface RecipeImageProps {
  src?: string;
  alt: string;
  className?: string;
}

/** Recipe photo that degrades to a warm placeholder if the image fails. */
export function RecipeImage({ src, alt, className = "" }: RecipeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-[#ffe3cf] via-[#fff9c4] to-[#cdeeea] ${className}`}
      >
        <Icon name="skillet" className="text-4xl text-on-surface-variant/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
