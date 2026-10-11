// Asset-loading state, written by the scene (drei useProgress) and read by
// the intro. A plain module store so the eager shell never imports three.

export type Loading = { active: boolean; total: number; progress: number };

let state: Loading = { active: false, total: 0, progress: 0 };

export const getLoading = (): Loading => state;
export const setLoading = (next: Loading): void => {
  state = next;
};
