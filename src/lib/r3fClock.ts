import * as THREE from "three";
import { setConsoleFunction } from "three";
import type { RootState } from "@react-three/fiber";

const CLOCK_WARN =
  "Clock: This module has been deprecated. Please use THREE.Timer instead.";

let consoleFilterInstalled = false;

/** Suppress deprecated THREE.Clock warnings from @react-three/fiber's initial store setup. */
export function installThreeConsoleFilter() {
  if (consoleFilterInstalled || typeof window === "undefined") return;
  consoleFilterInstalled = true;

  const native = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  setConsoleFunction((type, message, ...params) => {
    if (type === "warn" && typeof message === "string" && message.includes(CLOCK_WARN)) {
      return;
    }
    native[type](message, ...params);
  });
}

installThreeConsoleFilter();

/**
 * Drop-in replacement for deprecated THREE.Clock, backed by THREE.Timer.
 */
export class R3FClock {
  autoStart = true;
  startTime = 0;
  oldTime = 0;
  elapsedTime = 0;
  running = false;

  private timer = new THREE.Timer();

  constructor(autoStart = true) {
    this.autoStart = autoStart;
    if (typeof document !== "undefined") {
      this.timer.connect(document);
    }
    if (autoStart) this.start();
  }

  start() {
    this.startTime = performance.now();
    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
    this.timer.reset();
    this.timer.update();
  }

  stop() {
    if (this.running) this.getDelta();
    this.running = false;
    this.autoStart = false;
  }

  getDelta(): number {
    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }

    if (!this.running) return 0;

    const newTime = performance.now();
    this.timer.update(newTime);

    const delta = this.timer.getDelta();
    this.elapsedTime = this.timer.getElapsed();
    this.oldTime = newTime - delta * 1000;

    return delta;
  }

  getElapsedTime(): number {
    this.getDelta();
    return this.elapsedTime;
  }

  dispose() {
    this.timer.dispose();
  }
}

/** Swap R3F's deprecated THREE.Clock instance for a Timer-backed one. */
export function r3fOnCreated(state: RootState) {
  state.clock.stop();
  state.set({ clock: new R3FClock(true) as unknown as THREE.Clock });
}
