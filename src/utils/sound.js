// Ultra-cute sound effects synthesizer using Web Audio API

let audioCtx = null;
let masterGain = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      
      // Master gain & warmth filter to ensure sounds are cozy, soft and plush
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, audioCtx.currentTime); // Soften harsh edges
      filter.Q.setValueAtTime(1, audioCtx.currentTime);

      masterGain.connect(filter);
      filter.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMasterNode() {
  return masterGain || (audioCtx ? audioCtx.destination : null);
}

/**
 * Creates a soft, rounded bell/sine tone
 */
function playTone({ freq, duration = 0.2, type = 'sine', startTime = 0, gainLevel = 0.15, endFreq = null }) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime + startTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
  }

  // Soft attack and smooth exponential decay (no clicking!)
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(gainLevel, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(getMasterNode());

  osc.start(now);
  osc.stop(now + duration + 0.05);
}

/**
 * Shimmering magical fairy heart sparkles
 */
export function playSparkleHearts(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [1318.5, 1567.98, 2093.0]; // E6, G6, C7
  notes.forEach((freq, i) => {
    playTone({
      freq,
      duration: 0.28,
      type: 'sine',
      startTime: 0.04 + i * 0.035,
      gainLevel: 0.04,
    });
  });
}

/**
 * Pippo: Ultra-cute baby double chirp ("Pip-pii! 💕")
 */
function playPippoChirp() {
  // First tiny peep
  playTone({ freq: 880, endFreq: 1100, duration: 0.07, type: 'sine', startTime: 0, gainLevel: 0.14 });
  // Second joyful upward chirp
  playTone({ freq: 1150, endFreq: 1750, duration: 0.15, type: 'sine', startTime: 0.075, gainLevel: 0.16 });
  // Soft bass cushion for plump cuddliness
  playTone({ freq: 440, duration: 0.12, type: 'triangle', startTime: 0.02, gainLevel: 0.05 });
}

/**
 * Luna: Dreamy celestial music-box twinkle ("Ding-ting-twinkle! ✨")
 */
function playLunaTwinkle() {
  const notes = [987.77, 1318.51, 1567.98, 1975.53]; // B5, E6, G6, B6
  notes.forEach((freq, idx) => {
    playTone({
      freq,
      duration: 0.35,
      type: 'sine',
      startTime: idx * 0.045,
      gainLevel: 0.1 - idx * 0.015,
    });
  });
}

/**
 * Sir Barnaby: Dapper warm water-drop / bubble bloop ("Bloop-ting! 🎩")
 */
function playBarnabyBloop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Warm bubble sweep
  playTone({ freq: 360, endFreq: 950, duration: 0.11, type: 'sine', startTime: 0, gainLevel: 0.18 });
  // Polite high bell ding
  playTone({ freq: 1480, duration: 0.22, type: 'sine', startTime: 0.09, gainLevel: 0.08 });
}

/**
 * Cookie: Playful springy purr & squeak ("Boing-purr! 🥰")
 */
function playCookieSqueak() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Modulated cute purr / wobble
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const mod = ctx.createOscillator();
  const modGain = ctx.createGain();

  // Vibrato / purr
  mod.frequency.setValueAtTime(28, now); // 28Hz purr wobble
  modGain.gain.setValueAtTime(45, now);
  mod.connect(osc.frequency);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(680, now);
  osc.frequency.exponentialRampToValueAtTime(1250, now + 0.14);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(getMasterNode());

  mod.start(now);
  osc.start(now);
  mod.stop(now + 0.24);
  osc.stop(now + 0.24);

  // Tiny happy follow-up chime
  playTone({ freq: 1660, duration: 0.15, type: 'sine', startTime: 0.12, gainLevel: 0.09 });
}

/**
 * Universal cute pet sound dispatcher based on penguin character
 */
export function playCutePetSound(penguinId = 'pippo', enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    switch (penguinId) {
      case 'pippo':
        playPippoChirp();
        break;
      case 'luna':
        playLunaTwinkle();
        break;
      case 'barnaby':
        playBarnabyBloop();
        break;
      case 'cookie':
        playCookieSqueak();
        break;
      default:
        playPippoChirp();
        break;
    }

    // Always layer a sprinkle of sparkling floating fairy hearts!
    playSparkleHearts(enabled);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Grand celebration chime (All penguins cuddled / Milestone achieved)
 */
export function playCelebration(enabled = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Joyful major pentatonic arpeggio + sparkling bell cascade (C5, E5, G5, B5, C6, E6, G6)
    const melody = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
    melody.forEach((freq, idx) => {
      playTone({
        freq,
        duration: 0.38,
        type: 'sine',
        startTime: idx * 0.065,
        gainLevel: 0.12,
      });
    });

    // Warm bass chord underneath
    playTone({ freq: 261.63, duration: 0.65, type: 'triangle', startTime: 0, gainLevel: 0.08 });
    playTone({ freq: 392.00, duration: 0.65, type: 'triangle', startTime: 0.1, gainLevel: 0.06 });
  } catch (err) {
    console.warn('Celebration audio error:', err);
  }
}
