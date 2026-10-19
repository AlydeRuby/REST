// Light drizzle: a quiet noise bed with sparse, softly enveloped droplets.
// No audio files, network requests, microphone, autoplay, or persistent state.
export function makeRainSamples(length, seed = 7381, sampleRate = 48000) {
  const samples = new Float32Array(length);
  let value = seed | 0;
  const random = () => {
    value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
    return (value >>> 0) / 4294967295;
  };
  for (let i = 0; i < length; i++) samples[i] = (random() * 2 - 1) * 0.16;
  // Spread small drops across the loop. Wrap tails so the loop has no hard cut.
  const drops = Math.ceil(length / sampleRate * 14);
  for (let drop = 0; drop < drops; drop++) {
    const start = Math.floor(random() * length);
    const duration = Math.max(2, Math.floor(sampleRate * (0.025 + random() * 0.045)));
    const amplitude = 0.16 + random() * 0.2;
    for (let i = 0; i < duration; i++) {
      const envelope = Math.sin(Math.PI * i / (duration - 1)) ** 2;
      samples[(start + i) % length] += (random() * 2 - 1) * envelope * amplitude;
    }
  }
  return samples;
}
export class RainSound {
  constructor(contextFactory = () => new (window.AudioContext || window.webkitAudioContext)()) {
    this.contextFactory = contextFactory;
    this.context = null; this.source = null; this.gain = null; this.playing = false;
  }
  async start() {
    if (this.playing) return;
    if (!this.context || this.context.state === 'closed') this.context = this.contextFactory();
    const context = this.context;
    await context.resume();
    if (context.state !== 'running') throw new Error('Audio context did not start');
    const buffer = context.createBuffer(2, context.sampleRate * 12, context.sampleRate);
    for (let channel = 0; channel < 2; channel++) buffer.copyToChannel(makeRainSamples(buffer.length, 7381 + channel * 997, context.sampleRate), channel);
    const source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
    const lowpass = context.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 2600; lowpass.Q.value = 0.5;
    const highpass = context.createBiquadFilter(); highpass.type = 'highpass'; highpass.frequency.value = 350; highpass.Q.value = 0.5;
    const gain = context.createGain(); gain.gain.setValueAtTime(0, context.currentTime); gain.gain.linearRampToValueAtTime(0.14, context.currentTime + 0.9);
    source.connect(lowpass).connect(highpass).connect(gain).connect(context.destination);
    source.onended = () => { source.disconnect(); lowpass.disconnect(); highpass.disconnect(); gain.disconnect(); };
    source.start(); this.source = source; this.gain = gain; this.playing = true;
  }
  stop() {
    if (!this.source || !this.playing) return;
    const now = this.context.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(0, now + 0.25);
    this.source.stop(now + 0.3);
    this.playing = false; this.source = null; this.gain = null;
  }
}
