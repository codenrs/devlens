import { isBrowser } from '@nrshagor/devlens-shared';
import { performanceStore } from '../stores/performanceStore';

let installed = false;
let installCount = 0;
let frameCount = 0;
let lastTime = 0;
let rafId: number | null = null;

function tick(currentTime: number) {
  frameCount += 1;

  if (lastTime === 0) {
    lastTime = currentTime;
  }

  const elapsed = currentTime - lastTime;

  if (elapsed >= 1000) {
    const fps = Math.round((frameCount * 1000) / elapsed);

    performanceStore.setFps(fps);

    frameCount = 0;
    lastTime = currentTime;
  }

  rafId = window.requestAnimationFrame(tick);
}

export function installFpsMonitor() {
  if (!isBrowser()) {
    return;
  }

  installCount += 1;

  if (installed) {
    return;
  }

  installed = true;
  frameCount = 0;
  lastTime = 0;
  rafId = window.requestAnimationFrame(tick);
}

export function uninstallFpsMonitor() {
  if (!installed) {
    return;
  }

  installCount = Math.max(0, installCount - 1);

  if (installCount > 0) {
    return;
  }

  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
  }

  installed = false;
  frameCount = 0;
  lastTime = 0;
  rafId = null;

  performanceStore.reset();
}
