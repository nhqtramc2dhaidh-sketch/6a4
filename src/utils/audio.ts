/**
 * Web Audio API synthesizer for clean in-app sound effects.
 * Avoids broken external MP3 audio file loading issues.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Cheerful chime when student earns points
   */
  playPlusPoint() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * Gentle reminder chime when student loses points (informative, not harsh)
   */
  playMinusPoint() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.18); // F4

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Triumphant fanfare for badges and milestones
   */
  playBadgeUnlocked() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0 },    // C5
      { f: 659.25, t: 0.12 }, // E5
      { f: 783.99, t: 0.24 }, // G5
      { f: 1046.50, t: 0.38 },// C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.18, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + 0.35);
    });
  }
}

export const sound = new SoundEffects();
