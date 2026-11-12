'use client';

import type { Category } from '@/lib/types';

export function CategoryPicker({ categories, value, onChange }: {
  categories: Category[];
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <fieldset>
      <legend className="field-label">Category</legend>
      <div className="flex flex-wrap gap-2">
        <label className="pill">
          <input type="radio" name="category" className="sr-only" checked={value === null} onChange={() => onChange(null)} />
          <span>None</span>
        </label>
        {categories.map((category) => (
          <label key={category.id} className="pill">
            <input type="radio" name="category" className="sr-only" checked={value === category.id} onChange={() => onChange(category.id)} />
            <span>
              <span aria-hidden="true" className="size-2.5 rounded-full ring-1 ring-white/70" style={{ background: category.colour }} />
              {category.name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
