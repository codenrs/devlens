import React, { useEffect, useMemo, useState } from 'react';
import {
  errorStore,
  renderStore,
  routeStore,
  type ConsoleRecord,
  type NetworkRequestRecord,
  type PerformanceSnapshot,
} from '@codenrs/devlens-core';
import { formatConsoleTime, formatDuration, formatFps } from '../../utils/format';
import { ConsoleMessage } from '../console/ConsoleMessage';
import { RequestFlags } from '../network/RequestFlags';
import { RequestStatusBadge } from '../network/RequestStatusBadge';
import { OverviewMetricCard } from '../shared/OverviewMetricCard';

export function OverviewPanel({
  requests,
  consoleRecords,
  performanceSnapshot,
}: {
  requests: NetworkRequestRecord[];
  consoleRecords: ConsoleRecord[];
  performanceSnapshot: PerformanceSnapshot;
}) {
  const [routeSnapshot, setRouteSnapshot] = useState(routeStore.getSnapshot());
  const [renderSnapshot, setRenderSnapshot] = useState(renderStore.getSnapshot());
  const [errorSnapshot, setErrorSnapshot] = useState(errorStore.getSnapshot());

  useEffect(() => {
    const unsubscribeRouteStore = routeStore.subscribe(setRouteSnapshot);
    const unsubscribeRenderStore = renderStore.subscribe(setRenderSnapshot);
    const unsubscribeErrorStore = errorStore.subscribe(setErrorSnapshot);

    return () => {
      unsubscribeRouteStore();
      unsubscribeRenderStore();
      unsubscribeErrorStore();
    };
  }, []);

  const completedRequests = requests.filter((request) => request.status !== 'pending');
  const errorCount = requests.filter((request) => request.status === 'error').length;
  const slowCount = requests.filter((request) => request.isSlow).length;
  const consoleErrorCount = consoleRecords.filter((record) => record.level === 'error').length;
  const consoleWarnCount = consoleRecords.filter((record) => record.level === 'warn').length;

  const totalDuration = completedRequests.reduce(
    (sum, request) => sum + (request.duration ?? 0),
    0,
  );

  const averageDuration =
    completedRequests.length > 0 ? Math.round(totalDuration / completedRequests.length) : undefined;

  const totalRenders = useMemo(
    () => renderSnapshot.records.reduce((sum, record) => sum + record.renderCount, 0),
    [renderSnapshot.records],
  );

  const latestRequest = requests[0];
  const latestConsoleRecord = consoleRecords[0];

  return (
    <div className="devlens-overview">
      <div className="devlens-overview-grid devlens-overview-grid-dense">
        <OverviewMetricCard
          label="API Requests"
          value={requests.length}
          hint="Captured fetch calls"
        />

        <OverviewMetricCard label="Slow Requests" value={slowCount} hint="Successful slow APIs" />

        <OverviewMetricCard label="API Errors" value={errorCount} hint="Failed API responses" />

        <OverviewMetricCard
          label="Avg Duration"
          value={formatDuration(averageDuration)}
          hint="Completed requests"
        />

        <OverviewMetricCard
          label="Console Logs"
          value={consoleRecords.length}
          hint="Captured console entries"
        />

        <OverviewMetricCard label="Warnings" value={consoleWarnCount} hint="console.warn entries" />

        <OverviewMetricCard
          label="Console Errors"
          value={consoleErrorCount}
          hint="console.error entries"
        />

        <OverviewMetricCard
          label="FPS"
          value={formatFps(performanceSnapshot.fps)}
          hint={`Avg ${formatFps(performanceSnapshot.averageFps)} FPS`}
          status={performanceSnapshot.status}
        />

        <OverviewMetricCard
          label="Routes"
          value={routeSnapshot.history.length}
          hint="Captured navigations"
        />

        <OverviewMetricCard
          label="Components"
          value={renderSnapshot.records.length}
          hint="Tracked renders"
        />

        <OverviewMetricCard label="Renders" value={totalRenders} hint="Total render events" />

        <OverviewMetricCard
          label="Errors"
          value={errorSnapshot.records.length}
          hint="Captured runtime errors"
        />
      </div>

      <div className="devlens-overview-split">
        <div className="devlens-overview-section">
          <div className="devlens-overview-section-title">Latest Request</div>

          {latestRequest ? (
            <div className="devlens-latest-request">
              <div className="devlens-latest-request-top">
                <span className="devlens-method-pill">{latestRequest.method}</span>
                <RequestStatusBadge request={latestRequest} />
                <RequestFlags request={latestRequest} />
              </div>

              <div className="devlens-details-url" title={latestRequest.url}>
                {latestRequest.url}
              </div>

              <div className="devlens-latest-request-meta">
                <span>Duration: {formatDuration(latestRequest.duration)}</span>
                <span>Status: {latestRequest.statusCode ?? latestRequest.status}</span>
              </div>
            </div>
          ) : (
            <div className="devlens-empty">No requests captured yet.</div>
          )}
        </div>

        <div className="devlens-overview-section">
          <div className="devlens-overview-section-title">Latest Console</div>

          {latestConsoleRecord ? (
            <div
              className={`devlens-overview-console devlens-console-row-${latestConsoleRecord.level}`}
            >
              <div className="devlens-console-meta">
                <span
                  className={`devlens-console-level devlens-console-level-${latestConsoleRecord.level}`}
                >
                  {latestConsoleRecord.level}
                </span>

                <span className="devlens-console-time">
                  {formatConsoleTime(latestConsoleRecord.timestamp)}
                </span>
              </div>

              <ConsoleMessage message={latestConsoleRecord.message} compact />
            </div>
          ) : (
            <div className="devlens-empty">No console logs captured yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
