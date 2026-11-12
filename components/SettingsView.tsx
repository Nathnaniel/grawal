'use client';

import { useEffect, useState } from 'react';
import { useApp } from './AppProvider';
import { ReminderFields } from './ReminderFields';

const COLOURS = ['#A8740C', '#33688C', '#B04466', '#3C7A58', '#68741F', '#6650A8', '#BC4F14'];
const DUPLICATE = '23505';

export function SettingsView() {
  const { profile, categories, updateProfile, addCategory, removeCategory } = useApp();
  const [name, setName] = useState(profile.name);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [frequency, setFrequency] = useState(profile.reminder_frequency);
  const [time, setTime] = useState(profile.reminder_time);
  const [zones, setZones] = useState([profile.timezone]);
  const [status, setStatus] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [colour, setColour] = useState(COLOURS[0]);
  const [categoryStatus, setCategoryStatus] = useState('');

  // Filled in after load, because the server and browser can list different zones.
  useEffect(() => {
    setZones([...new Set(['UTC', profile.timezone, ...Intl.supportedValuesOf('timeZone')])]);
  }, [profile.timezone]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    setStatus('');
    try {
      await updateProfile({ name: name.trim(), timezone, reminder_frequency: frequency, reminder_time: time });
      setStatus('Settings saved.');
    } catch {
      setStatus('Settings didn\'t save. Check your connection and try again.');
    }
  }

  async function submitCategory(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setCategoryStatus('');
    try {
      await addCategory(trimmed, colour);
      setNewCategory('');
      setCategoryStatus(`${trimmed} added.`);
    } catch (error) {
      const duplicate = (error as { code?: string }).code === DUPLICATE;
      setCategoryStatus(duplicate ? 'You already have a category with that name.' : 'The category didn\'t save. Try again.');
    }
  }

  async function deleteCategory(id: string, label: string) {
    setCategoryStatus('');
    try {
      await removeCategory(id);
      setCategoryStatus(`${label} deleted. Its wins are still on your wall.`);
    } catch {
      setCategoryStatus('The category didn\'t delete. Try again.');
    }
  }

  const own = categories.filter((category) => category.user_id);

  return (
    <div className="flex max-w-xl flex-col gap-12">
      <h1>Settings</h1>

      <form onSubmit={saveProfile} className="flex flex-col gap-4">
        <div>
          <label htmlFor="settings-name" className="field-label">Your name</label>
          <input id="settings-name" className="field" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="settings-timezone" className="field-label">Timezone</label>
          <select id="settings-timezone" className="field" value={timezone} onChange={(event) => setTimezone(event.target.value)}>
            {zones.map((zone) => <option key={zone} value={zone}>{zone.replaceAll('_', ' ')}</option>)}
          </select>
        </div>
        <div>
          <h2 className="mb-1">Reminders</h2>
          <p className="mb-3 text-soft">Your choice is saved now. Reminder emails are coming soon.</p>
          <ReminderFields frequency={frequency} time={time} onFrequency={setFrequency} onTime={setTime} />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="btn btn-primary">Save settings</button>
          <p role="status">{status}</p>
        </div>
      </form>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-3">Your categories</h2>
        {own.length > 0 && (
          <ul className="mb-4">
            {own.map((category) => (
              <li key={category.id} className="flex items-center gap-2 border-b border-line">
                <span aria-hidden="true" className="size-3 rounded-full" style={{ background: category.colour }} />
                <span>{category.name}</span>
                <button type="button" className="text-link ml-auto min-h-11" aria-label={`Delete ${category.name}`} onClick={() => deleteCategory(category.id, category.name)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={submitCategory} className="flex flex-col gap-3">
          <div>
            <label htmlFor="category-name" className="field-label">New category</label>
            <input id="category-name" className="field" maxLength={40} value={newCategory} onChange={(event) => setNewCategory(event.target.value)} />
          </div>
          <fieldset>
            <legend className="field-label">Colour</legend>
            <div className="flex flex-wrap gap-1">
              {COLOURS.map((option, index) => (
                <label key={option} className="grid size-11 place-items-center rounded-full has-checked:bg-deep/15 has-focus-visible:outline-3 has-focus-visible:outline-deep">
                  <input type="radio" name="colour" className="sr-only" aria-label={`Colour ${index + 1}`} checked={colour === option} onChange={() => setColour(option)} />
                  <span aria-hidden="true" className="size-6 rounded-full" style={{ background: option }} />
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn btn-quiet">Add category</button>
            <p role="status">{categoryStatus}</p>
          </div>
        </form>
      </section>

      <form action="/auth/sign-out" method="post">
        <button type="submit" className="btn btn-quiet">Sign out</button>
      </form>
    </div>
  );
}
