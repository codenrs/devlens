export type DevLensTheme = 'dark' | 'light' | 'system';

export type DevLensBarProps = {
  position?: 'bottom-left' | 'bottom-right';
  defaultTheme?: DevLensTheme;
};

export type DevLensTabId =
  | 'overview'
  | 'network'
  | 'console'
  | 'performance'
  | 'routes'
  | 'settings';

export type DevLensTab = {
  id: DevLensTabId;
  label: string;
  badge?: number;
};

export type DevLensUiState = {
  drawerOpen?: boolean;
  activeTab?: DevLensTabId;
  theme?: DevLensTheme;
};
