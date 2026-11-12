// How a win looks on the wall: which paper it's written on and what it says.

export type NoteColour = 'yellow' | 'white' | 'pink' | 'blue';
const COLOURS: NoteColour[] = ['yellow', 'white', 'pink', 'blue'];

/** The same paper for the same win every time, spread evenly across the four. */
export function noteColour(id: string): NoteColour {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return COLOURS[Math.abs(hash) % COLOURS.length];
}

/** The note shows the category as its heading and the story beneath, as in Figma. */
export function noteText(entry: { title: string; reflection: string | null }, categoryName: string | undefined) {
  const story = entry.reflection?.trim();
  return { heading: categoryName ?? entry.title, story: story || (categoryName ? entry.title : '') };
}

// The create form lists categories in the design's order, then any of the person's own.
export const CATEGORY_ORDER = ['Answered Prayer', 'Faith', 'Work', 'Family', 'Health', 'Finances', 'Studies', 'Relationships', 'Travel', 'Personal Growth'];

export function orderCategories<T extends { name: string; user_id: string | null }>(categories: T[]): T[] {
  const rank = (category: T) => {
    const index = CATEGORY_ORDER.indexOf(category.name);
    return category.user_id === null && index >= 0 ? index : CATEGORY_ORDER.length;
  };
  return [...categories].sort((a, b) => rank(a) - rank(b));
}
