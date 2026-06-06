import React from 'react';
import type { DevLensTheme } from '../../types';

export function SettingsPanel({
  theme,
  onThemeChange,
}: {
  theme: DevLensTheme;
  onThemeChange: (theme: DevLensTheme) => void;
}) {
  return (
    <div className="devlens-settings">
      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">Appearance</div>

        <div className="devlens-setting-row">
          <div>
            <div className="devlens-setting-title">Theme</div>
            <div className="devlens-setting-description">
              Use system theme or manually switch DevLens between dark and light mode.
            </div>
          </div>

          <div className="devlens-theme-switch">
            <button
              type="button"
              className={`devlens-theme-option ${theme === 'dark' ? 'devlens-theme-option-active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              Dark
            </button>

            <button
              type="button"
              className={`devlens-theme-option ${theme === 'light' ? 'devlens-theme-option-active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              Light
            </button>

            <button
              type="button"
              className={`devlens-theme-option ${theme === 'system' ? 'devlens-theme-option-active' : ''}`}
              onClick={() => onThemeChange('system')}
            >
              System
            </button>
          </div>
        </div>
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">Developer UX</div>
        <p className="devlens-settings-text">
          More preferences like slow request threshold, default tab, and panel size will be added in
          later steps.
        </p>
      </div>
    </div>
  );
}
