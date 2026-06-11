import React from 'react';
import { consoleStore, type ConsoleRecord } from '@nrshagor/devlens-core';
import { formatConsoleTime } from '../../utils/format';
import { ConsoleMessage } from './ConsoleMessage';

export function ConsolePanel({ records }: { records: ConsoleRecord[] }) {
  const warnCount = records.filter((record) => record.level === 'warn').length;
  const errorCount = records.filter((record) => record.level === 'error').length;

  return (
    <div className="devlens-console">
      <div className="devlens-console-toolbar">
        <div className="devlens-console-summary">
          <strong>{records.length}</strong>
          <span>logs</span>
          <span>•</span>
          <span>{warnCount} warnings</span>
          <span>•</span>
          <span>{errorCount} errors</span>
        </div>

        <button
          type="button"
          className="devlens-clear-button"
          onClick={() => consoleStore.clear()}
          disabled={records.length === 0}
        >
          Clear
        </button>
      </div>

      {records.length === 0 ? (
        <div className="devlens-empty">No console logs captured yet.</div>
      ) : (
        <div className="devlens-console-panel">
          {records.map((record) => (
            <div
              key={record.id}
              className={`devlens-console-row devlens-console-row-${record.level}`}
            >
              <div className="devlens-console-meta">
                <span className={`devlens-console-level devlens-console-level-${record.level}`}>
                  {record.level}
                </span>

                <span className="devlens-console-time">{formatConsoleTime(record.timestamp)}</span>
              </div>

              <ConsoleMessage message={record.message} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
