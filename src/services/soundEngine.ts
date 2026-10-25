// Procedural Web Audio API sound generator - 100% offline, zero network requests
class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private nodes: {
    rain?: { gain: GainNode; source: AudioNode };
    brownNoise?: { gain: GainNode; source: AudioNode };
    forest?: { gain: GainNode; source: AudioNode; lfoGain?: GainNode };
    thunder?: { gain: GainNode; timer?: number };
  } = {};

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate White Noise Buffer
  private createNoiseBuffer(durationSeconds = 5): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Generate Brown Noise Buffer
  private createBrownNoiseBuffer(durationSeconds = 6): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  public setVolume(track: 'rain' | 'thunder' | 'forest' | 'brown-noise', volume: number) {
    this.initContext();
    if (!this.ctx) return;

    if (volume <= 0) {
      this.stopTrack(track);
      return;
    }

    if (track === 'brown-noise') {
      if (!this.nodes.brownNoise) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createBrownNoiseBuffer();
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.4;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.nodes.brownNoise = { gain, source: noise };
      } else {
        this.nodes.brownNoise.gain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.1);
      }
    } else if (track === 'rain') {
      if (!this.nodes.rain) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.8;

        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.35;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.nodes.rain = { gain, source: noise };
      } else {
        this.nodes.rain.gain.gain.setTargetAtTime(volume * 0.35, this.ctx.currentTime, 0.1);
      }
    } else if (track === 'forest') {
      if (!this.nodes.forest) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;

        // Gentle breeze modulation LFO
        const lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.18; // Very slow wind cycle
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 350;
        lfo.connect(filter.frequency);
        lfo.start();

        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.3;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();

        this.nodes.forest = { gain, source: noise, lfoGain };
      } else {
        this.nodes.forest.gain.gain.setTargetAtTime(volume * 0.3, this.ctx.currentTime, 0.1);
      }
    } else if (track === 'thunder') {
      if (!this.nodes.thunder) {
        const gain = this.ctx.createGain();
        gain.gain.value = volume * 0.5;
        gain.connect(this.ctx.destination);

        const scheduleThunder = () => {
          if (!this.ctx || !this.nodes.thunder) return;
          this.playThunderRumble(gain);
          const nextIn = 8000 + Math.random() * 14000;
          this.nodes.thunder.timer = window.setTimeout(scheduleThunder, nextIn);
        };

        this.nodes.thunder = { gain };
        scheduleThunder();
      } else {
        this.nodes.thunder.gain.gain.setTargetAtTime(volume * 0.5, this.ctx.currentTime, 0.1);
      }
    }
  }

  private playThunderRumble(masterGain: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 3.5);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    rumbleGain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 0.6);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4.0);

    osc.connect(rumbleGain);
    rumbleGain.connect(masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 4.2);
  }

  public stopTrack(track: 'rain' | 'thunder' | 'forest' | 'brown-noise') {
    if (track === 'rain' && this.nodes.rain) {
      try { (this.nodes.rain.source as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.nodes.rain.gain.disconnect();
      delete this.nodes.rain;
    } else if (track === 'brown-noise' && this.nodes.brownNoise) {
      try { (this.nodes.brownNoise.source as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.nodes.brownNoise.gain.disconnect();
      delete this.nodes.brownNoise;
    } else if (track === 'forest' && this.nodes.forest) {
      try { (this.nodes.forest.source as AudioScheduledSourceNode).stop(); } catch { /* ignore */ }
      this.nodes.forest.gain.disconnect();
      delete this.nodes.forest;
    } else if (track === 'thunder' && this.nodes.thunder) {
      if (this.nodes.thunder.timer) clearTimeout(this.nodes.thunder.timer);
      this.nodes.thunder.gain.disconnect();
      delete this.nodes.thunder;
    }
  }

  public stopAll() {
    this.stopTrack('rain');
    this.stopTrack('thunder');
    this.stopTrack('forest');
    this.stopTrack('brown-noise');
  }

  public playGentleChime() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // 528Hz Solfeggio "Transformation & Miracles" tone
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 2.0);
  }
}

export const soundEngine = new ProceduralSoundEngine();
