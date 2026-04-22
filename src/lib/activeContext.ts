'use client';

import { createContext, useContext } from 'react';

/**
 * Active-spread context. Each spread is rendered inside a provider that
 * declares whether it is currently in view. Reveal/lazy-animation children
 * read this to avoid firing when a spread is pre-rendered but off-stage.
 */
export const ActiveSpreadContext = createContext<boolean>(false);

export function useIsActive() {
  return useContext(ActiveSpreadContext);
}
