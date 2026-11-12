'use client';

import type { Profile } from '@/lib/types';

const CHOICES: { value: Profile['reminder_frequency']; label: string }[] = [
  { value: 'off', label: 'No reminders' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

export function ReminderFields({ frequency, time, onFrequency, onTime }: {
  frequency: Profile['reminder_frequency'];
  time: string;
  onFrequency: (value: Profile['reminder_frequency']) => void;
  onTime: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <fieldset>
        <legend className="field-label">How often?</legend>
        <div className="flex flex-wrap gap-2">
          {CHOICES.map(({ value, label }) => (
            <label key={value} className="pill">
              <input type="radio" name="reminder" className="sr-only" checked={frequency === value} onChange={() => onFrequency(value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {frequency !== 'off' && (
        <div>
          <label htmlFor="reminder-time" className="field-label">What time?</label>
          <input id="reminder-time" type="time" className="field max-w-40" value={time.slice(0, 5)} onChange={(event) => onTime(event.target.value)} />
        </div>
      )}
    </div>
  );
}
