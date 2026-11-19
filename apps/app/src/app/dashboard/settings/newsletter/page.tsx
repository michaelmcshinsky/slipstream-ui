'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardTitle,
  CardDescription,
  Field,
  Toggle,
  Button,
  Separator,
  Badge,
} from '@/components/ui';

export default function NewsletterSettingsPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    dailyEnabled: false,
    weeklyEnabled: true,
    contentTypes: [] as string[],
    frequency: 'weekly' as 'daily' | 'weekly' | 'both',
    timezone: 'America/Denver',
  });

  const [contentTypes, setContentTypes] = useState<Array<{ type: string; label: string; description: string }>>([]);
  const [frequencies, setFrequencies] = useState<Array<{ value: string; label: string; description: string }>>([]);

  useEffect(() => {
    void loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPreferences() {
    try {
      const response = await fetch('/api/newsletter/preferences');
      if (!response.ok) throw new Error('Failed to load preferences');
      const data = await response.json();
      setPreferences(data.preferences);
      setContentTypes(data.contentTypes ?? []);
      setFrequencies(data.frequencies ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }

  async function savePreferences() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/newsletter/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      setMessage('Preferences saved successfully');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  function toggleContentType(type: string) {
    setPreferences((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter((t) => t !== type)
        : [...prev.contentTypes, type],
    }));
  }

  function toggleFrequency(freq: 'daily' | 'weekly' | 'both') {
    setPreferences((prev) => ({ ...prev, frequency: freq }));
    // Also update the individual toggles
    if (freq === 'daily') {
      setPreferences((prev) => ({ ...prev, dailyEnabled: true, weeklyEnabled: false }));
    } else if (freq === 'weekly') {
      setPreferences((prev) => ({ ...prev, dailyEnabled: false, weeklyEnabled: true }));
    } else {
      setPreferences((prev) => ({ ...prev, dailyEnabled: true, weeklyEnabled: true }));
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Newsletter Settings</h1>
        <div className="space-y-4" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="mt-4 h-4 bg-muted rounded w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Newsletter Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your email digest preferences. Choose what content you want and how often you receive it.
        </p>
      </div>

      {message && <p role="status" className="text-sm text-success">{message}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      {/* Frequency Selection */}
      <Card>
        <CardTitle>Delivery Frequency</CardTitle>
        <CardDescription className="mb-4">
          Choose how often you'd like to receive updates. Daily digests arrive each morning; weekly digests arrive Monday mornings.
        </CardDescription>
        <div className="space-y-3">
          {frequencies.map((freq) => (
            <label
              key={freq.value}
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <input
                type="radio"
                name="frequency"
                value={freq.value}
                checked={preferences.frequency === freq.value}
                onChange={() => toggleFrequency(freq.value as 'daily' | 'weekly' | 'both')}
                className="sr-only peer"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{freq.label}</div>
                <div className="text-sm text-muted-foreground">{freq.description}</div>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 border-border peer-checked:border-primary peer-checked:bg-primary peer-checked:after:content-[''] peer-checked:after:w-1.5 peer-checked:after:h-1.5 peer-checked:after:rounded-full peer-checked:after:bg-primary-foreground peer-checked:after:block peer-checked:after:mx-auto peer-checked:after:mt-1"
              />
            </label>
          ))}
        </div>
      </Card>

      {/* Individual Toggles */}
      <Card>
        <CardTitle>Newsletter Types</CardTitle>
        <CardDescription className="mb-4">
          Enable or disable each newsletter type. Your frequency selection above controls when they're sent.
        </CardDescription>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Digest</p>
              <p className="text-sm text-muted-foreground">Morning summary of the last 24 hours</p>
            </div>
            <Toggle
              checked={preferences.dailyEnabled}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, dailyEnabled: checked }))}
              disabled={preferences.frequency === 'weekly'}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Digest</p>
              <p className="text-sm text-muted-foreground">Monday summary of the last 7 days</p>
            </div>
            <Toggle
              checked={preferences.weeklyEnabled}
              onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, weeklyEnabled: checked }))}
              disabled={preferences.frequency === 'daily'}
            />
          </div>
        </div>
      </Card>

      {/* Content Types */}
      <Card>
        <CardTitle>Content Categories</CardTitle>
        <CardDescription className="mb-4">
          Select which types of updates you want to receive. At least one category must be enabled.
        </CardDescription>
        <div className="space-y-3">
          {contentTypes.map((ct) => (
            <label
              key={ct.type}
              className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={preferences.contentTypes.includes(ct.type)}
                onChange={() => toggleContentType(ct.type)}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">{ct.label}</div>
                <div className="text-sm text-muted-foreground">{ct.description}</div>
              </div>
            </label>
          ))}
        </div>
        {preferences.contentTypes.length === 0 && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            Please select at least one content category.
          </p>
        )}
      </Card>

      {/* Timezone */}
      <Card>
        <CardTitle>Timezone</CardTitle>
        <CardDescription className="mb-4">
          Newsletters will be sent in your local morning time.
        </CardDescription>
        <Field
          name="timezone"
          label="Timezone"
          value={preferences.timezone}
          onChange={(e) => setPreferences((prev) => ({ ...prev, timezone: e.target.value }))}
          options={[
            { value: 'America/Denver', label: 'Mountain Time (America/Denver)' },
            { value: 'America/New_York', label: 'Eastern Time (America/New_York)' },
            { value: 'America/Chicago', label: 'Central Time (America/Chicago)' },
            { value: 'America/Los_Angeles', label: 'Pacific Time (America/Los_Angeles)' },
            { value: 'Europe/London', label: 'GMT (Europe/London)' },
            { value: 'Europe/Berlin', label: 'CET (Europe/Berlin)' },
            { value: 'Asia/Tokyo', label: 'JST (Asia/Tokyo)' },
            { value: 'Australia/Sydney', label: 'AEST (Australia/Sydney)' },
          ]}
        />
      </Card>

      {/* Save Button */}
      <Button onClick={savePreferences} disabled={saving || preferences.contentTypes.length === 0} className="w-full">
        {saving ? 'Saving...' : 'Save Preferences'}
      </Button>

      {/* Current Subscriptions Status */}
      <Card>
        <CardTitle>Subscription Status</CardTitle>
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span>Daily Digest</span>
            <Badge variant={preferences.dailyEnabled ? 'success' : 'secondary'}>
              {preferences.dailyEnabled ? 'Subscribed' : 'Not subscribed'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Weekly Digest</span>
            <Badge variant={preferences.weeklyEnabled ? 'success' : 'secondary'}>
              {preferences.weeklyEnabled ? 'Subscribed' : 'Not subscribed'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}