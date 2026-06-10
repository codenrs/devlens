import React, { useState } from 'react';
import type { NetworkRequestRecord } from '@codenrs/devlens-core';
import { formatDuration } from '../../utils/format';
import { RequestFlags } from './RequestFlags';
import { RequestStatusBadge } from './RequestStatusBadge';

function formatTimestamp(value?: number) {
  if (!value) return '--';

  return `${Math.round(value)}ms`;
}

function getRequestOrigin(url: string) {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.origin;
  } catch {
    return 'Relative URL';
  }
}

function getRequestPath(url: string) {
  try {
    const parsedUrl = new URL(url);

    return `${parsedUrl.pathname}${parsedUrl.search}`;
  } catch {
    return url;
  }
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="devlens-detail-item">
      <span className="devlens-detail-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

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

        <div className="devlens-details-origin">{getRequestOrigin(request.url)}</div>

        <div className="devlens-details-url" title={request.url}>
          {getRequestPath(request.url)}
        </div>
      </div>

      <div className="devlens-details-grid">
        <DetailItem label="Status" value={request.status} />
        <DetailItem label="Status Code" value={request.statusCode ?? '--'} />
        <DetailItem label="Duration" value={formatDuration(request.duration)} />
        <DetailItem label="Slow" value={request.isSlow ? 'Yes' : 'No'} />
        <DetailItem label="Started" value={formatTimestamp(request.startTime)} />
        <DetailItem label="Ended" value={formatTimestamp(request.endTime)} />
      </div>

      <div className="devlens-details-card">
        <div className="devlens-details-section-title">Request URL</div>

        <div className="devlens-details-url devlens-details-url-full" title={request.url}>
          {request.url}
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
