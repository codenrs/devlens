import React, { useEffect, useState } from 'react';
import { routeStore } from '@nrshagor/devlens-core';

export function RoutesPanel() {
  const [snapshot, setSnapshot] = useState(routeStore.getSnapshot());

  useEffect(() => {
    return routeStore.subscribe(setSnapshot);
  }, []);

  return (
    <div className="devlens-routes">
      <div className="devlens-route-card">
        <div className="devlens-section-header">Current Route</div>

        <div className="devlens-route-current">{snapshot.currentPath}</div>

        <div className="devlens-route-previous">Previous: {snapshot.previousPath ?? '—'}</div>
      </div>

      <div className="devlens-route-card">
        <div className="devlens-section-header">Route History</div>

        <div className="devlens-route-list">
          {snapshot.history.length === 0 ? (
            <div className="devlens-empty-state">No route navigation detected.</div>
          ) : (
            snapshot.history.map((route) => (
              <div key={route.id} className="devlens-route-item">
                <div className="devlens-route-top">
                  <span className="devlens-route-path">{route.pathname}</span>

                  <span
                    className={`devlens-route-badge devlens-route-badge-${route.navigationType}`}
                  >
                    {route.navigationType}
                  </span>
                </div>

                <div className="devlens-route-meta">
                  <span>{route.duration.toFixed(2)}ms</span>
                  <span>{new Date(route.completedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
