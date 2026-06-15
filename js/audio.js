(function () {
  "use strict";

  const TRACKS = {
    menu: {
      bpm: 66,
      wave: "sine",
      padWave: "triangle",
      pad: [110, 164.81, 220],
      scale: [220, 246.94, 261.63, 329.63, 392, 440],
      pattern: [0, 2, 4, 2, 1, 3, 5, 3],
      padGain: 0.035,
      noteGain: 0.045,
      drum: false,
      noise: false
    },
    explore: {
      bpm: 72,
      wave: "sine",
      padWave: "sine",
      pad: [98, 146.83, 196],
      scale: [196, 220, 246.94, 293.66, 329.63, 369.99],
      pattern: [0, 2, 4, 2, 1, 3, 5, 3],
      padGain: 0.03,
      noteGain: 0.034,
      drum: false,
      noise: false
    },
    tension: {
      bpm: 76,
      wave: "triangle",
      padWave: "sine",
      pad: [110, 146.83, 196],
      scale: [196, 220, 246.94, 293.66, 329.63, 392],
      pattern: [0, 1, 3, 1, 4, 2, 1, 0],
      padGain: 0.028,
      noteGain: 0.03,
      drum: false,
      noise: false
    },
    madness: {
      bpm: 82,
      wave: "triangle",
      padWave: "sine",
      pad: [98, 130.81, 174.61],
      scale: [174.61, 196, 220, 261.63, 293.66, 349.23],
      pattern: [0, 2, 1, 3, 4, 2, 1, 0],
      padGain: 0.026,
      noteGain: 0.028,
      drum: false,
      noise: false
    },
    hidden: {
      bpm: 58,
      wave: "sine",
      padWave: "triangle",
      pad: [130.81, 196, 261.63],
      scale: [261.63, 293.66, 349.23, 392, 440, 523.25],
      pattern: [0, 3, 2, 5, 1, 4, 2, 0],
      padGain: 0.04,
      noteGain: 0.044,
      drum: false,
      noise: true
    },
    trueEnding: {
      bpm: 72,
      wave: "triangle",
      padWave: "sine",
      pad: [130.81, 164.81, 196, 261.63],
      scale: [261.63, 329.63, 392, 440, 493.88, 523.25],
      pattern: [0, 2, 4, 5, 4, 2, 1, 0],
      padGain: 0.045,
      noteGain: 0.055,
      drum: true,
      noise: false
    }
  };

  function AudioDirector() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.enabled = true;
    this.unlocked = false;
    this.currentMusic = "menu";
    this.playingMode = null;
    this.musicTimer = null;
    this.step = 0;
    this.padNodes = [];
  }

  AudioDirector.prototype.ensureContext = function () {
    if (this.ctx) {
      return true;
    }

    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) {
      return false;
    }

    this.ctx = new Context();
    this.master = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();

    this.master.gain.value = this.enabled ? 0.82 : 0;
    this.musicGain.gain.value = 0.72;
    this.sfxGain.gain.value = 0.88;

    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.master.connect(this.ctx.destination);
    return true;
  };

  AudioDirector.prototype.unlock = function () {
    if (!this.ensureContext()) {
      return;
    }

    this.ctx.resume();
    this.unlocked = true;
    if (this.enabled) {
      this.startMusic(this.currentMusic || "menu");
    }
  };

  AudioDirector.prototype.setEnabled = function (enabled) {
    this.enabled = enabled;
    if (!this.ensureContext()) {
      return;
    }

    const target = enabled ? 0.82 : 0;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.025);

    if (enabled) {
      this.unlock();
    } else {
      this.stopMusic();
    }
  };

  AudioDirector.prototype.startMusic = function (mode) {
    this.currentMusic = mode || "explore";
    if (!this.enabled || !this.unlocked || !this.ensureContext()) {
      return;
    }

    const track = TRACKS[this.currentMusic] || TRACKS.explore;
    if (this.playingMode === this.currentMusic) {
      return;
    }

    this.stopMusic();
    this.playingMode = this.currentMusic;
    this.step = 0;

    track.pad.forEach((frequency, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = track.padWave;
      osc.frequency.value = frequency;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start();
      gain.gain.linearRampToValueAtTime(track.padGain / (index + 1), this.ctx.currentTime + 1.2);
      this.padNodes.push({ osc, gain });
    });

    this.scheduleMusicStep(track);
    const interval = Math.max(170, 60000 / track.bpm / 2);
    this.musicTimer = window.setInterval(() => {
      this.scheduleMusicStep(track);
    }, interval);
  };

  AudioDirector.prototype.stopMusic = function () {
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }

    if (this.ctx) {
      this.padNodes.forEach((node) => {
        try {
          node.gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.06);
          node.osc.stop(this.ctx.currentTime + 0.22);
        } catch (error) {
          // Oscillators may already be stopped during rapid track changes.
        }
      });
    }

    this.padNodes = [];
    this.playingMode = null;
  };

  AudioDirector.prototype.scheduleMusicStep = function (track) {
    const noteIndex = track.pattern[this.step % track.pattern.length];
    const frequency = track.scale[noteIndex] || track.scale[0];
    const octave = this.step % 8 === 6 ? 2 : 1;
    this.playTone(frequency * octave, 0.14, track.wave, track.noteGain, this.musicGain);

    if (track.drum && this.step % 4 === 0) {
      this.playKick();
    }

    if (track.noise && this.step % 8 === 5) {
      this.playNoise(0.08, 0.025, 880);
    }

    this.step += 1;
  };

  AudioDirector.prototype.playTone = function (frequency, duration, type, gainValue, destination) {
    if (!this.unlocked || !this.ctx) {
      return;
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = type || "sine";
    osc.frequency.value = frequency;
    filter.type = "lowpass";
    filter.frequency.value = Math.max(420, frequency * 3.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue || 0.04), now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination || this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  };

  AudioDirector.prototype.playKick = function () {
    if (!this.unlocked || !this.ctx) {
      return;
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.18);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(now);
    osc.stop(now + 0.24);
  };

  AudioDirector.prototype.playNoise = function (duration, gainValue, filterFrequency) {
    if (!this.unlocked || !this.ctx) {
      return;
    }

    const bufferSize = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < bufferSize; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFrequency || 720;
    gain.gain.setValueAtTime(gainValue || 0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    source.start();
  };

  AudioDirector.prototype.playChord = function (frequencies, duration, type, gain) {
    frequencies.forEach((frequency, index) => {
      window.setTimeout(() => {
        this.playTone(frequency, duration, type, gain, this.sfxGain);
      }, index * 45);
    });
  };

  AudioDirector.prototype.playSfx = function (name) {
    if (!this.enabled) {
      return;
    }
    this.unlock();

    switch (name) {
      case "button":
        this.playTone(520, 0.06, "square", 0.055, this.sfxGain);
        this.playTone(780, 0.05, "sine", 0.035, this.sfxGain);
        break;
      case "door":
        this.playNoise(0.14, 0.06, 280);
        this.playTone(140, 0.2, "sawtooth", 0.04, this.sfxGain);
        break;
      case "footstep":
        this.playNoise(0.05, 0.04, 180);
        this.playTone(95, 0.08, "sine", 0.03, this.sfxGain);
        break;
      case "narrator":
        this.playTone(360, 0.045, "triangle", 0.036, this.sfxGain);
        window.setTimeout(() => this.playTone(330, 0.05, "triangle", 0.032, this.sfxGain), 55);
        break;
      case "wrong":
        this.playTone(220, 0.14, "sawtooth", 0.07, this.sfxGain);
        window.setTimeout(() => this.playTone(155, 0.18, "sawtooth", 0.06, this.sfxGain), 90);
        break;
      case "correct":
        this.playChord([392, 493.88, 587.33], 0.16, "triangle", 0.045);
        break;
      case "ending":
        this.playChord([196, 261.63, 329.63, 392], 0.42, "sine", 0.06);
        break;
      case "glitch":
        this.playNoise(0.18, 0.09, 1200);
        this.playTone(77, 0.16, "square", 0.045, this.sfxGain);
        break;
      case "achievement":
        this.playChord([523.25, 659.25, 783.99], 0.12, "sine", 0.035);
        break;
      default:
        this.playTone(440, 0.05, "sine", 0.035, this.sfxGain);
        break;
    }
  };

  window.AudioDirector = new AudioDirector();
})();
