'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createBillingController } from './billing-controller';

export function useBilling(teamId: string | null) {
  const [controller] = useState(() => createBillingController({
    fetch: (input, init) => fetch(input, init),
    navigate: (url) => window.location.assign(url),
    reload: () => window.location.reload(),
  }));
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);

  useEffect(() => {
    void controller.start(teamId);
    return controller.dispose;
  }, [controller, teamId]);

  return {
    ...state,
    selectTeam: controller.selectTeam,
    checkout: controller.checkout,
    cancel: controller.cancel,
    retry: () => controller.start(state.activeTeamId ?? teamId),
  };
}
