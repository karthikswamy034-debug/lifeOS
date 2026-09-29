// LifeOS Procedural Web Audio Sound Engine
// Zero external audio file dependencies - 100% reliable offline & instant

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.5;
    
    // Sound channels
    this.channels = {
      wind: { enabled: true, volume: 0.4, nodes: null },
      birds: { enabled: true, volume: 0.35, timer: null, nodes: null },
      rain: { enabled: false, volume: 0.3, nodes: null },
      ambient: { enabled: true, volume: 0.4, timer: null, nodes: null }
    };

    this.isPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMaster(forceState) {
    if (forceState !== undefined) {
      this.isPlaying = forceState;
    } else {
      this.isPlaying = !this.isPlaying;
    }

    if (this.isPlaying) {
      this.init();
      this.startAllEnabled();
    } else {
      this.stopAll();
    }
    return this.isPlaying;
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGainNode) {
      this.masterGainNode.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  setChannelVolume(channelName, vol) {
    if (this.channels[channelName]) {
      this.channels[channelName].volume = Math.max(0, Math.min(1, vol));
      if (this.channels[channelName].gainNode && this.ctx) {
        this.channels[channelName].gainNode.gain.setTargetAtTime(
          this.channels[channelName].volume * this.masterVolume,
          this.ctx.currentTime,
          0.05
        );
      }
    }
  }

  toggleChannel(channelName, state) {
    if (!this.channels[channelName]) return;
    const shouldEnable = state !== undefined ? state : !this.channels[channelName].enabled;
    this.channels[channelName].enabled = shouldEnable;

    if (this.isPlaying) {
      if (shouldEnable) {
        this.startChannel(channelName);
      } else {
        this.stopChannel(channelName);
      }
    }
    return shouldEnable;
  }

  startAllEnabled() {
    if (!this.ctx) return;

    if (!this.masterGainNode) {
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);
    }

    Object.keys(this.channels).forEach(name => {
      if (this.channels[name].enabled) {
        this.startChannel(name);
      }
    });
  }

  stopAll() {
    Object.keys(this.channels).forEach(name => {
      this.stopChannel(name);
    });
  }

  startChannel(name) {
    this.stopChannel(name);
    if (!this.ctx) return;

    switch (name) {
      case 'wind':
        this.startWind();
        break;
      case 'birds':
        this.startBirds();
        break;
      case 'rain':
        this.startRain();
        break;
      case 'ambient':
        this.startAmbient();
        break;
    }
  }

  stopChannel(name) {
    const ch = this.channels[name];
    if (!ch) return;

    if (ch.timer) {
      clearInterval(ch.timer);
      ch.timer = null;
    }

    if (ch.nodes) {
      try {
        ch.nodes.forEach(node => {
          if (node.stop) {
            try { node.stop(); } catch (e) {}
          }
          if (node.disconnect) {
            try { node.disconnect(); } catch (e) {}
          }
        });
      } catch (err) {}
      ch.nodes = null;
    }
  }

  // --- 1. PROCEDURAL WIND GENERATOR ---
  startWind() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink / Brown noise simulation for wind gusts
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // LFO for gentle wind gusts
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime); // slow wave

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.channels.wind.volume * this.masterVolume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    whiteNoise.start();
    lfo.start();

    this.channels.wind.gainNode = gainNode;
    this.channels.wind.nodes = [whiteNoise, filter, lfo, lfoGain, gainNode];
  }

  // --- 2. PROCEDURAL BIRD CHIRP GENERATOR ---
  startBirds() {
    const playChirp = () => {
      if (!this.isPlaying || !this.channels.birds.enabled || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 2200 + Math.random() * 900;
      osc.frequency.setValueAtTime(baseFreq, now);
      // Frequency glide for realistic bird tweet
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 800, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08 * this.channels.birds.volume * this.masterVolume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGainNode);

      osc.start(now);
      osc.stop(now + 0.25);

      // Random repeat chirp (double-tweet)
      if (Math.random() > 0.4) {
        setTimeout(() => {
          if (!this.isPlaying || !this.channels.birds.enabled || !this.ctx) return;
          const t2 = this.ctx.currentTime;
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(baseFreq + 200, t2);
          osc2.frequency.exponentialRampToValueAtTime(baseFreq + 1000, t2 + 0.07);
          gain2.gain.setValueAtTime(0.001, t2);
          gain2.gain.linearRampToValueAtTime(0.07 * this.channels.birds.volume * this.masterVolume, t2 + 0.03);
          gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.16);

          osc2.connect(gain2);
          gain2.connect(this.masterGainNode);
          osc2.start(t2);
          osc2.stop(t2 + 0.2);
        }, 140);
      }
    };

    // Chirp periodically every 3-7 seconds
    this.channels.birds.timer = setInterval(() => {
      playChirp();
    }, 4200);

    playChirp(); // initial chirp
  }

  // --- 3. PROCEDURAL RAIN GENERATOR ---
  startRain() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.channels.rain.volume * this.masterVolume, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    rainSource.start();
    this.channels.rain.gainNode = gainNode;
    this.channels.rain.nodes = [rainSource, filter, gainNode];
  }

  // --- 4. CALM AMBIENT CHORD SYNTHESIZER ---
  startAmbient() {
    // Beautiful relaxing pentatonic chord progression (Fmaj9, Cmaj7, Am9, Em7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // F, A, C, E
      [130.81, 196.00, 246.94, 329.63], // C, G, B, E
      [110.00, 164.81, 220.00, 261.63], // A, E, A, C
      [164.81, 196.00, 246.94, 293.66]  // E, G, B, D
    ];
    let chordIdx = 0;

    const playPad = () => {
      if (!this.isPlaying || !this.channels.ambient.enabled || !this.ctx) return;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      const duration = 7.0;
      const now = this.ctx.currentTime;

      notes.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(1000, now + duration * 0.5);
        filter.frequency.linearRampToValueAtTime(400, now + duration);

        const targetVol = (0.04 * this.channels.ambient.volume * this.masterVolume);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(targetVol, now + 2.0);
        gain.gain.linearRampToValueAtTime(targetVol * 0.7, now + 5.0);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGainNode);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    };

    playPad();
    this.channels.ambient.timer = setInterval(playPad, 6800);
  }

  // Play pleasant UI click/chime for task check or habit streak
  playChime(type = 'success') {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }
}

export const soundEngine = new SoundEngine();
