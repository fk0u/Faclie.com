class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  speak(text: string, lang: 'id' | 'en' | 'mixed', speed: number = 1.0, pitch: number = 1.0, onEnd?: () => void) {
    if (!this.synth) return;

    // Stop any ongoing speech
    this.cancel();

    // Clean text (remove emoji shortcodes or markdown hints like voice note brackets)
    const cleanedText = text
      .replace(/\(Freelancer voice note:.*?\)/i, '')
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '') // remove emojis
      .trim();

    if (!cleanedText) return;

    this.currentUtterance = new SpeechSynthesisUtterance(cleanedText);
    this.currentUtterance.rate = speed;
    this.currentUtterance.pitch = pitch;
    
    this.currentUtterance.onend = () => {
      if (onEnd) onEnd();
    };
    this.currentUtterance.onerror = () => {
      if (onEnd) onEnd();
    };

    // Pick appropriate voice
    const voices = this.synth.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    const targetLangCode = lang === 'id' ? 'id-ID' : 'en-US';

    // First look for exact language match
    selectedVoice = voices.find(v => v.lang.includes(targetLangCode)) || null;

    // Fallback: look for generic language code match
    if (!selectedVoice) {
      const genericLang = lang === 'id' ? 'id' : 'en';
      selectedVoice = voices.find(v => v.lang.startsWith(genericLang)) || null;
    }

    if (selectedVoice) {
      this.currentUtterance.voice = selectedVoice;
    } else {
      // General fallback to browser default lang
      this.currentUtterance.lang = targetLangCode;
    }

    this.synth.speak(this.currentUtterance);
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();
