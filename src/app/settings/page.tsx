'use client';

import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ALL_TOPICS, TOPIC_META } from '@/config/topics';
import type { Topic, DifficultyLevel } from '@/types/content';

const DIFFICULTY_OPTIONS: Array<{ value: DifficultyLevel | 'all'; label: string }> = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const toggleTopic = (topic: Topic) => {
    const current = settings.preferredTopics;
    if (current.includes(topic)) {
      updateSettings({ preferredTopics: current.filter((t) => t !== topic) });
    } else {
      updateSettings({ preferredTopics: [...current, topic] });
    }
  };

  return (
    <>
      <TopBar title="Settings" />
      <div className="px-4 py-6 space-y-6">

        {/* Timer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Quiz Timer</p>
              <p className="text-xs text-slate-500 mt-0.5">Show countdown for quiz questions</p>
            </div>
            <button
              onClick={() => updateSettings({ timerEnabled: !settings.timerEnabled })}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                settings.timerEnabled ? 'bg-primary-600' : 'bg-slate-200',
              ].join(' ')}
              role="switch"
              aria-checked={settings.timerEnabled}
            >
              <span
                className={[
                  'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
                  settings.timerEnabled ? 'translate-x-6' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </div>
        </div>

        {/* Daily goal */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 mb-3">Daily Goal</p>
          <div className="flex gap-2 flex-wrap">
            {[5, 10, 20, 30, 50].map((n) => (
              <button
                key={n}
                onClick={() => updateSettings({ dailyGoal: n })}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors',
                  settings.dailyGoal === n
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300',
                ].join(' ')}
              >
                {n} cards
              </button>
            ))}
          </div>
        </div>

        {/* Preferred difficulty */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 mb-3">Difficulty</p>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateSettings({ preferredDifficulty: value })}
                className={[
                  'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors',
                  settings.preferredDifficulty === value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900 mb-1">Focus Topics</p>
          <p className="text-xs text-slate-400 mb-3">Empty = all topics</p>
          <div className="flex flex-wrap gap-2">
            {ALL_TOPICS.map((topic) => {
              const meta = TOPIC_META[topic];
              const selected = settings.preferredTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={[
                    'px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors',
                    selected
                      ? `${meta.bgColor} ${meta.color} ${meta.borderColor}`
                      : 'border-slate-200 text-slate-500 hover:border-slate-300',
                  ].join(' ')}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <Button
          variant="outline"
          fullWidth
          onClick={() => {
            if (window.confirm('Reset all settings to defaults?')) {
              resetSettings();
            }
          }}
          className="text-slate-500"
        >
          Reset to defaults
        </Button>
      </div>
    </>
  );
}
