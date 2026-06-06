import React from 'react';
import type { PerformanceSnapshot } from '@codenrs/devlens-core';
import { getFpsStatusLabel } from '../../utils/format';

export function OverviewMetricCard({
  label,
  value,
  hint,
  status,
}: {
  label: string;
  value: string | number;
  hint: string;
  status?: PerformanceSnapshot['status'];
}) {
  return (
    <div className="devlens-overview-card">
      <div className="devlens-overview-card-head">
        <span className="devlens-overview-label">{label}</span>

        {status && (
          <span className={`devlens-status-pill devlens-status-pill-${status}`}>
            {getFpsStatusLabel(status)}
          </span>
        )}
      </div>

      <strong className="devlens-overview-value">{value}</strong>
      <span className="devlens-overview-hint">{hint}</span>
    </div>
  );
}
