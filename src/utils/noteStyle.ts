/** Deterministic per-recipe decoration so notes look "tossed" but stable. */

const PASTELS = [
  "pastel-yellow",
  "pastel-mint",
  "pastel-pink",
  "pastel-blue",
  "pastel-peach",
  "pastel-lilac",
];

const ROTATIONS = [-5, -3, -1, 1, 2, 4];

const MAGNETS = ["mag-red", "mag-blue", "mag-green", "mag-yellow"];

function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

export interface NoteDecor {
  pastel: string;
  rotation: number;
  magnet: string;
  /** Alternate fasteners so not everything has a magnet */
  fastener: "magnet" | "tape";
}

export function noteDecor(id: string): NoteDecor {
  const h = hash(id);
  return {
    pastel: PASTELS[h % PASTELS.length],
    rotation: ROTATIONS[(h >> 3) % ROTATIONS.length],
    magnet: MAGNETS[(h >> 6) % MAGNETS.length],
    fastener: (h >> 9) % 3 === 0 ? "tape" : "magnet",
  };
}
