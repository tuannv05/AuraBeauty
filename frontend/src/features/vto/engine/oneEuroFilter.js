// frontend/src/features/vto/engine/oneEuroFilter.js
/**
 * One-Euro Filter (1€ Filter) for Real-Time 3D Landmark Jitter Reduction
 * Reference: Casiez, Roussel & Vogel (CHI 2012)
 * "1€ Filter: A Simple Speed-based Low-pass Filter for Noisy Input in Interactive Systems"
 */

class LowPassFilter {
  constructor(alpha = 0.5, initVal = 0) {
    this.alpha = alpha;
    this.s = initVal;
    this.initialized = false;
  }

  filter(value, alpha = this.alpha) {
    if (!this.initialized) {
      this.s = value;
      this.initialized = true;
      return value;
    }
    this.s = alpha * value + (1 - alpha) * this.s;
    return this.s;
  }

  hasLastRawValue() {
    return this.initialized;
  }

  lastRawValue() {
    return this.s;
  }

  reset() {
    this.initialized = false;
  }
}

export class OneEuroFilter {
  constructor(freq = 60, minCutoff = 1.0, beta = 0.007, dCutoff = 1.0) {
    this.freq = freq;
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
    this.x = new LowPassFilter(this.alpha(minCutoff));
    this.dx = new LowPassFilter(this.alpha(dCutoff));
    this.lastTime = null;
  }

  alpha(cutoff) {
    const te = 1.0 / this.freq;
    const tau = 1.0 / (2 * Math.PI * cutoff);
    return 1.0 / (1.0 + tau / te);
  }

  filter(val, timestamp = null) {
    if (this.lastTime !== null && timestamp !== null) {
      const dt = Math.max(1, timestamp - this.lastTime);
      this.freq = 1000.0 / dt;
    }
    this.lastTime = timestamp;

    const dval = this.x.hasLastRawValue() ? (val - this.x.lastRawValue()) * this.freq : 0;
    const edval = this.dx.filter(dval, this.alpha(this.dCutoff));
    const cutoff = this.minCutoff + this.beta * Math.abs(edval);
    return this.x.filter(val, this.alpha(cutoff));
  }

  reset() {
    this.x.reset();
    this.dx.reset();
    this.lastTime = null;
  }
}

/**
 * Filters a 3D coordinate point (x, y, z)
 */
export class Point3DFilter {
  constructor(freq = 60, minCutoff = 1.0, beta = 0.007) {
    this.filterX = new OneEuroFilter(freq, minCutoff, beta);
    this.filterY = new OneEuroFilter(freq, minCutoff, beta);
    this.filterZ = new OneEuroFilter(freq, minCutoff, beta);
  }

  filter(pt, timestamp = null) {
    if (!pt) return null;
    return {
      x: this.filterX.filter(pt.x, timestamp),
      y: this.filterY.filter(pt.y, timestamp),
      z: pt.z !== undefined ? this.filterZ.filter(pt.z, timestamp) : 0
    };
  }

  reset() {
    this.filterX.reset();
    this.filterY.reset();
    this.filterZ.reset();
  }
}

/**
 * Manager that maintains 1€ filters for all 478 landmarks
 */
export class FaceMeshJitterFilter {
  constructor(landmarkCount = 478, minCutoff = 1.0, beta = 0.007) {
    this.filters = [];
    for (let i = 0; i < landmarkCount; i++) {
      this.filters.push(new Point3DFilter(60, minCutoff, beta));
    }
  }

  filterLandmarks(landmarks, timestamp = performance.now()) {
    if (!landmarks || !landmarks.length) return landmarks;
    return landmarks.map((pt, i) => {
      if (!this.filters[i]) {
        this.filters[i] = new Point3DFilter(60);
      }
      return this.filters[i].filter(pt, timestamp);
    });
  }

  reset() {
    this.filters.forEach(f => f.reset());
  }
}
