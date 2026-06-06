import type { DevLensUiState } from '../types';

const DEVLENS_STORAGE_KEY = 'devlens:ui-state';

export function readDevLensUiState(): DevLensUiState {
  if (typeof window === 'undefined') return {};

  try {
    const value = window.localStorage.getItem(DEVLENS_STORAGE_KEY);
    return value ? (JSON.parse(value) as DevLensUiState) : {};
  } catch {
    return {};
  }
}

export function writeDevLensUiState(patch: DevLensUiState) {
  if (typeof window === 'undefined') return;

  try {
    const current = readDevLensUiState();

    window.localStorage.setItem(
      DEVLENS_STORAGE_KEY,
      JSON.stringify({
        ...current,
        ...patch,
      }),
    );
  } catch {
    // Ignore storage errors.
  }
}
