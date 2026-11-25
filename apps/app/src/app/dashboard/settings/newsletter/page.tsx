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
import { apiFetch } from '@/lib/api/envelope';

type PreferencesState = {
  dailyEnabled: boolean;
  weeklyEnabled: boolean;
  contentTypes: string[];
  frequency: 'daily' | 'weekly' | 'both';
  timezone: string;
};

type SubscriptionRow = {
  type: string;
  status: string;
};

type PreferencesPayload = {
  preferences?: PreferencesState;
  subscriptions?: SubscriptionRow[];
  contentTypes?: Array<{ type: string; label: string; description: string }>;
  frequencies?: Array<{ value: string; label: string; description: string }>;
};

const DEFAULT_PREFERENCES: PreferencesState = {
  dailyEnabled: false,
  weeklyEnabled: true,
  contentTypes: [],
  frequency: 'weekly',
  timezone: 'America/Denver',
};

export default function NewsletterSettingsPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [preferences, setPreferences] = useState<PreferencesState>(DEFAULT_PREFERENCES);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);

  const [contentTypes, setContentTypes] = useState<Array<{ type: string; label: string; description: string }>>([]);
  const [frequencies, setFrequencies] = useState<Array<{ value: string; label: string; description: string }>>([]);

  useEffect(() => {
    void loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPreferences() {
    try {
      const payload = await apiFetch<PreferencesPayload>('/api/newsletter/preferences');
      setPreferences(payload?.preferences ?? DEFAULT_PREFERENCES);
      setSubscriptions(payload?.subscriptions ?? []);
      setContentTypes(payload?.contentTypes ?? []);
      setFrequencies(payload?.frequencies ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  }

  async function callSubscription(type: 'daily' | 'weekly', subscribe: boolean) {
    await apiFetch(`/api/newsletter/${subscribe ? 'subscribe' : 'unsubscribe'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
  }

  async function updateSubscription(type: 'daily' | 'weekly', subscribe: boolean) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await callSubscription(type, subscribe);
      setMessage(subscribe ? 'Subscribed.' : 'Unsubscribed.');
      await loadPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription.');
    } finally {
      setSaving(false);
    }
  }

  async function savePreferences() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await apiFetch('/api/newsletter/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      // Preferences alone do not create NewsletterSubscription rows, which is
      // what the cron actually sends to. Reconcile subscriptions with the
      // enabled digest flags so the toggles control real delivery.
      for (const target of [
        { type: 'daily' as const, enabled: preferences.dailyEnabled },
        { type: 'weekly' as const, enabled: preferences.weeklyEnabled },
      ]) {
        const currentlySubscribed = subscriptions.some(
          (sub) => sub.type === target.type && sub.status === 'active',
        );
        if (target.enabled !== currentlySubscribed) {
          await callSubscription(target.type, target.enabled);
        }
      }
      await loadPreferences();

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

  // Frequency is derived from the two digest toggles so the radio and the
  // switches can never disagree about what is enabled.
  function deriveFrequency(dailyEnabled: boolean, weeklyEnabled: boolean): PreferencesState['frequency'] {
    if (dailyEnabled && weeklyEnabled) return 'both';
    return dailyEnabled ? 'daily' : 'weekly';
  }

  function applyDigestToggles(dailyEnabled: boolean, weeklyEnabled: boolean) {
    setPreferences((prev) => ({
      ...prev,
      dailyEnabled,
      weeklyEnabled,
      frequency: deriveFrequency(dailyEnabled, weeklyEnabled),
    }));
  }

  function toggleFrequency(freq: 'daily' | 'weekly' | 'both') {
    if (freq === 'daily') applyDigestToggles(true, false);
    else if (freq === 'weekly') applyDigestToggles(false, true);
    else applyDigestToggles(true, true);
  }

  function isSubscribed(type: 'daily' | 'weekly') {
    return subscriptions.some((sub) => sub.type === type && sub.status === 'active');
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
              onCheckedChange={(checked) => applyDigestToggles(checked, preferences.weeklyEnabled)}
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
              onCheckedChange={(checked) => applyDigestToggles(preferences.dailyEnabled, checked)}
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
        <CardDescription className="mb-4">
          These controls change your actual email subscriptions, independent of content preferences.
        </CardDescription>
        <div className="space-y-3">
          {(['daily', 'weekly'] as const).map((type) => {
            const subscribed = isSubscribed(type);
            return (
              <div key={type} className="flex items-center justify-between gap-3">
                <span>{type === 'daily' ? 'Daily Digest' : 'Weekly Digest'}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={subscribed ? 'success' : 'secondary'}>
                    {subscribed ? 'Subscribed' : 'Not subscribed'}
                  </Badge>
                  <Button
                    onClick={() => void updateSubscription(type, !subscribed)}
                    disabled={saving}
                    className="w-auto px-3 py-1.5 text-xs"
                  >
                    {subscribed ? 'Unsubscribe' : 'Subscribe'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}