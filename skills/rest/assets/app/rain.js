// User-provided recording, served from this site and loaded only on request.
export class RainSound {
  constructor(audioFactory = () => new Audio()) {
    this.audioFactory = audioFactory;
    this.audio = null;
    this.playing = false;
  }
  async start() {
    if (this.playing) return;
    if (!this.audio) {
      this.audio = this.audioFactory();
      this.audio.preload = 'none';
      this.audio.loop = true;
      this.audio.src = new URL('./gentle-rain.mp3', import.meta.url).href;
    }
    try {
      await this.audio.play();
      this.playing = true;
    } catch (error) {
      this.audio.pause();
      this.playing = false;
      throw error;
    }
  }
  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.playing = false;
  }
}
