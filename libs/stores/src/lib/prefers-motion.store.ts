import { writable } from 'svelte-local-storage-store';

export const prefersReducedMotion = writable(
  'macos:is-reduced-motion',
  window.matchMedia('(prefers-reduced-motion)').matches
);
