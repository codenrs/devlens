export type RouteNavigationType = 'push' | 'replace' | 'popstate' | 'hash';

export type RouteRecord = {
  id: string;
  pathname: string;
  fullPath: string;
  navigationType: RouteNavigationType;
  startedAt: number;
  completedAt: number;
  duration: number;
};

export type RouteSnapshot = {
  currentPath: string;
  previousPath: string | null;
  history: RouteRecord[];
  lastUpdatedAt: number;
};
