// speech.js — narrator built on the browser's Web Speech API (speechSynthesis).
// Speaks one short segment at a time (long utterances are unreliable in Chrome).
// When the voice is off or unavailable, it waits for a reading-time estimate instead,
// so the lesson keeps the same rhythm.

import { prefs } from './prefs.js';
const store = { get: (k) => prefs.get(k), set: (k, v) => prefs.set(k, v) };

export class Narrator {
  constructor({ lang = 'en' } = {}) {
    this.lang = lang;
    this.synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.enabled = store.get('icb.voice') !== 'off' && !!this.synth;
    this.rate = Number(store.get('icb.rate')) || 1;
    this.voiceName = store.get('icb.voiceName');
    this.voices = [];
    this.onVoicesChanged = () => {};
    this.timer = null;
    if (this.synth) {
      this.loadVoices();
      this.synth.addEventListener?.('voiceschanged', () => this.loadVoices());
      // Some browsers populate voices late and never fire the event.
      setTimeout(() => this.loadVoices(), 600);
    }
  }

  get available() { return !!this.synth; }

  loadVoices() {
    const all = this.synth.getVoices();
    const mine = all.filter((v) => v.lang?.toLowerCase().startsWith(this.lang));
    this.voices = (mine.length ? mine : all).slice().sort((a, b) => score(b) - score(a));
    this.onVoicesChanged(this.voices);
  }

  get voice() {
    return this.voices.find((v) => v.name === this.voiceName) || this.voices[0] || null;
  }

  setVoice(name) { this.voiceName = name; store.set('icb.voiceName', name); }
  setRate(r) { this.rate = r; store.set('icb.rate', String(r)); }
  setEnabled(on) {
    this.enabled = on && !!this.synth;
    store.set('icb.voice', on ? 'on' : 'off');
    if (!on) this.cancel();
  }

  /** Time the segment would take to say aloud (voice on) or to read silently (voice off). */
  estimateMs(text, { silent = false } = {}) {
    const words = text.trim().split(/\s+/).length;
    if (silent) return Math.max(600, (words / 5) * 1000 / this.rate + 100);
    return (words / 2.6) * 1000 / this.rate + 350;
  }

  /** Resolves when the segment has been spoken (or would have been read). */
  speak(text) {
    this.cancel();
    if (!this.enabled) {
      return new Promise((resolve) => { this.timer = setTimeout(resolve, this.estimateMs(text, { silent: true })); });
    }
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      const v = this.voice;
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-GB'; }
      u.rate = this.rate;
      let done = false;
      const finish = () => { if (!done) { done = true; clearTimeout(this.timer); resolve(); } };
      u.onend = finish;
      u.onerror = finish;
      // Safety net: never hang if the engine drops the "end" event.
      this.timer = setTimeout(finish, this.estimateMs(text) * 2.5 + 2000);
      this.synth.speak(u);
    });
  }

  /** Speak a silent utterance inside a user gesture (required by iOS Safari). */
  unlock() {
    if (!this.synth || this.unlocked) return;
    this.unlocked = true;
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    this.synth.speak(u);
  }

  cancel() {
    clearTimeout(this.timer);
    if (this.synth) this.synth.cancel();
  }
}

// Prefer natural-sounding voices: Google (Chrome), then Microsoft "Natural", then local ones.
function score(v) {
  let s = 0;
  if (/google/i.test(v.name)) s += 30;
  if (/natural|neural|online/i.test(v.name)) s += 20;
  if (/en-GB/i.test(v.lang)) s += 3;
  if (/en-US/i.test(v.lang)) s += 2;
  if (v.default) s += 1;
  return s;
}
