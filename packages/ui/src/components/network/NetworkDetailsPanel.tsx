import React, { useState } from 'react';
import type { NetworkRequestRecord } from '@codenrs/devlens-core';
import { formatDuration } from '../../utils/format';
import { RequestFlags } from './RequestFlags';
import { RequestStatusBadge } from './RequestStatusBadge';

export function NetworkDetailsPanel({
  request,
  onBack,
}: {
  request: NetworkRequestRecord;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(request.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="devlens-details">
      <div className="devlens-details-toolbar">
        <button type="button" className="devlens-back-button" onClick={onBack}>
          ← Back
        </button>

        <button type="button" className="devlens-copy-button" onClick={handleCopyUrl}>
          {copied ? 'Copied' : 'Copy URL'}
        </button>
      </div>

      <div className="devlens-details-card">
        <div className="devlens-details-title-row">
          <span className="devlens-method-pill">{request.method}</span>
          <RequestStatusBadge request={request} />
          <RequestFlags request={request} />
        </div>

        <div className="devlens-details-url" title={request.url}>
          {request.url}
        </div>
      </div>

      <div className="devlens-details-grid">
        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Status</span>
          <strong>{request.status}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Status Code</span>
          <strong>{request.statusCode ?? '--'}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Duration</span>
          <strong>{formatDuration(request.duration)}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Slow</span>
          <strong>{request.isSlow ? 'Yes' : 'No'}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Start Time</span>
          <strong>{Math.round(request.startTime)}ms</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">End Time</span>
          <strong>{request.endTime ? `${Math.round(request.endTime)}ms` : '--'}</strong>
        </div>
      </div>

      {request.errorMessage && (
        <div className="devlens-error-box">
          <div className="devlens-error-title">Error Message</div>
          <pre>{request.errorMessage}</pre>
        </div>
      )}
    </div>
  );
}
