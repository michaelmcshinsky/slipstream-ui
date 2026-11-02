'use client';

import { useState } from 'react';
import { Button, ToastProvider, useToast } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

function ToastPlayground() {
  const { toast } = useToast();
  const [counter, setCounter] = useState(0);
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => {
          setCounter((value) => value + 1);
          toast({ title: 'Saved', description: `Change #${counter + 1} is live.` });
        }}
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: 'License revoked',
            description: 'The key no longer validates.',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored' }) },
            duration: 0,
          })
        }
      >
        Toast with Undo
      </Button>
    </div>
  );
}

export default function ToastPage() {
  return (
    <ComponentPage
      id="toast"
      title="Toast"
      description="Accessible app-level notifications announced through a polite live region, with auto-dismiss, stacking and optional actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Short heading announced with the toast' },
        { name: 'description', type: 'string', defaultValue: '—', description: 'Optional supporting detail' },
        { name: 'action', type: '{ label, onClick }', defaultValue: '—', description: 'Inline action; invoking dismisses the toast' },
        { name: 'duration', type: 'number', defaultValue: '5000', description: 'Auto-dismiss delay in ms; 0 keeps it until dismissed' },
      ]}
      accessibility={[
        'Toasts render inside role=status (implicit polite live region)',
        'Container is a labelled list for screen-reader navigation',
        'Actions and dismiss controls are regular keyboard-reachable buttons',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <ToastProvider>
            <ToastPlayground />
          </ToastProvider>
        }
        code={`'use client';

import { ToastProvider, useToast } from '@slipstream-ui/core';

function SaveButton() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Saved', description: 'Your changes are live.' })}>
      Save
    </button>
  );
}

export function Demo() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}`}
      />
    </ComponentPage>
  );
}
