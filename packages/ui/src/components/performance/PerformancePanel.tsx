import React from 'react';
import { performanceStore, type PerformanceSnapshot } from '@codenrs/devlens-core';
import {
  formatDuration,
  formatFps,
  formatPerformanceTime,
  getPerformanceStatusClass,
} from '../../utils/format';
import { OverviewMetricCard } from '../shared/OverviewMetricCard';

export function PerformancePanel({
  performanceSnapshot,
}: {
  performanceSnapshot: PerformanceSnapshot;
}) {
  const samples = performanceSnapshot.samples.slice(-24);
  const latestLongTask = performanceSnapshot.longTasks[0];

  return (
    <div className="devlens-performance">
      <div className="devlens-overview-grid">
        <OverviewMetricCard
          label="Current FPS"
          value={formatFps(performanceSnapshot.fps)}
          hint="requestAnimationFrame based"
          status={performanceSnapshot.status}
        />

        <OverviewMetricCard
          label="Average FPS"
          value={formatFps(performanceSnapshot.averageFps)}
          hint="Last 60 samples"
        />

        <OverviewMetricCard
          label="Long Tasks"
          value={performanceSnapshot.longTasks.length}
          hint="Main thread blocking"
        />

        <OverviewMetricCard
          label="Latest Block"
          value={latestLongTask ? formatDuration(latestLongTask.duration) : '--'}
          hint="Most recent long task"
        />
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">FPS Timeline</div>

        {samples.length === 0 ? (
          <div className="devlens-empty">FPS samples will appear here shortly.</div>
        ) : (
          <div className="devlens-fps-bars">
            {samples.map((sample) => (
              <div
                key={sample.timestamp}
                className="devlens-fps-bar-wrap"
                title={`${sample.fps} FPS`}
              >
                <div
                  className={`devlens-fps-bar devlens-fps-bar-${getPerformanceStatusClass(sample.fps)}`}
                  style={{ height: `${Math.max(8, Math.min(100, (sample.fps / 60) * 100))}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-section-toolbar">
          <div className="devlens-overview-section-title">Long Tasks</div>

          <button
            type="button"
            className="devlens-clear-button"
            onClick={() => performanceStore.clearLongTasks()}
            disabled={performanceSnapshot.longTasks.length === 0}
          >
            Clear
          </button>
        </div>

        {performanceSnapshot.longTasks.length === 0 ? (
          <div className="devlens-empty">No long tasks detected yet.</div>
        ) : (
          <div className="devlens-long-task-list">
            {performanceSnapshot.longTasks.map((task) => (
              <div key={task.id} className="devlens-long-task-row">
                <div className="devlens-long-task-main">
                  <span className="devlens-badge devlens-badge-slow">
                    {formatDuration(task.duration)}
                  </span>

                  <span className="devlens-long-task-name">{task.name}</span>
                </div>

                <span className="devlens-console-time">
                  {formatPerformanceTime(task.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
