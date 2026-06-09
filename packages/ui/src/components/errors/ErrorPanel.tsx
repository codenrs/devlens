import React, { useEffect, useState } from 'react';
import { errorStore } from '@codenrs/devlens-core';

export function ErrorPanel() {
  const [snapshot, setSnapshot] = useState(errorStore.getSnapshot());

  useEffect(() => {
    return errorStore.subscribe(setSnapshot);
  }, []);

  return (
    <div className="devlens-errors">
      <div className="devlens-errors-toolbar">
        <span>
          <strong>{snapshot.records.length}</strong> captured error
          {snapshot.records.length === 1 ? '' : 's'}
        </span>

        <button
          type="button"
          className="devlens-clear-button"
          onClick={() => errorStore.clear()}
          disabled={snapshot.records.length === 0}
        >
          Clear
        </button>
      </div>

      <div className="devlens-error-list">
        {snapshot.records.length === 0 ? (
          <div className="devlens-empty-state">No errors captured yet.</div>
        ) : (
          snapshot.records.map((record) => (
            <div key={record.id} className="devlens-error-item">
              <div className="devlens-error-top">
                <span className="devlens-error-name">{record.name ?? 'Error'}</span>
                <span className="devlens-error-badge">{record.source}</span>
              </div>

              <div className="devlens-error-message">{record.message}</div>

              <div className="devlens-error-meta">
                {new Date(record.timestamp).toLocaleTimeString()}
              </div>

              {record.componentStack && (
                <pre className="devlens-error-stack">{record.componentStack}</pre>
              )}

              {record.stack && <pre className="devlens-error-stack">{record.stack}</pre>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
