let sharedCtx;

/** Short pleasant ding when entering an attraction's immediate radius (requires user gesture on some browsers). */
export function playProximityDing() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      return;
    }
    if (!sharedCtx) {
      sharedCtx = new Ctx();
    }
    if (sharedCtx.state === "suspended") {
      void sharedCtx.resume();
    }
    const t0 = sharedCtx.currentTime;
    const osc = sharedCtx.createOscillator();
    const gain = sharedCtx.createGain();
    osc.connect(gain);
    gain.connect(sharedCtx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(784, t0);
    osc.frequency.exponentialRampToValueAtTime(1046, t0 + 0.06);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    osc.start(t0);
    osc.stop(t0 + 0.24);
  } catch {
    /* ignore */
  }
}
