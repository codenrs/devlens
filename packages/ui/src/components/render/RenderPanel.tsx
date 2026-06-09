import React, { useEffect, useMemo, useState } from 'react';
import { renderStore } from '@codenrs/devlens-core';

export function RenderPanel() {
  const [snapshot, setSnapshot] = useState(renderStore.getSnapshot());

  useEffect(() => {
    return renderStore.subscribe(setSnapshot);
  }, []);

  const totalRenders = useMemo(
    () => snapshot.records.reduce((sum, record) => sum + record.renderCount, 0),
    [snapshot.records],
  );

  const slowestRender = snapshot.records.reduce(
    (slowest, record) => (record.duration > slowest.duration ? record : slowest),
    snapshot.records[0],
  );

  return (
    <div className="devlens-render">
      <div className="devlens-render-summary">
        <div className="devlens-render-card">
          <span>Tracked Components</span>
          <strong>{snapshot.records.length}</strong>
        </div>

        <div className="devlens-render-card">
          <span>Total Renders</span>
          <strong>{totalRenders}</strong>
        </div>

        <div className="devlens-render-card">
          <span>Slowest Render</span>
          <strong>{slowestRender ? `${slowestRender.duration.toFixed(2)}ms` : '—'}</strong>
        </div>
      </div>

      <div className="devlens-render-list">
        {snapshot.records.length === 0 ? (
          <div className="devlens-empty-state">No tracked component renders yet.</div>
        ) : (
          snapshot.records.map((record) => (
            <div key={record.id} className="devlens-render-item">
              <div className="devlens-render-top">
                <span className="devlens-render-name">{record.componentName}</span>
                <span className="devlens-render-badge">{record.renderCount} renders</span>
              </div>

              <div className="devlens-render-meta">
                <span>{record.duration.toFixed(2)}ms</span>
                <span>{new Date(record.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
