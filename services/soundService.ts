// This service uses the Web Audio API for robust sound playback that respects browser autoplay policies.

// Store context and buffers globally within the module
let audioContext: AudioContext | null = null;
let successChimeBuffer: AudioBuffer | null = null;
let completionFanfareBuffer: AudioBuffer | null = null;
let isInitializing = false; // Prevent race conditions during initialization

// Base64 encoded success chime (WAV format) - A short, clean "ding"
const successChimeB64 = 'data:audio/wav;base64,UklGRmAAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAAAAP//AAAAAAAAAAAAAP//AP8A/wD/APEA9gD6APkA6QDdAMMAqgCWAGgARgAxABwADgABAAAAAAD//wD/AP8A/wD6APsA/gD/AAAAAQACAAMABQAFAAYABwAIAAkACgALAAwADQANAA4ADwAQABEAEgATABQAFAAVABYAFwAYABkAGgAbABwAHQAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEAYgBjAGQAZQBmAGcAZABjAGEAYQBfAF0AWwBZAFcAVgBUAFIAUABOAEwASgBIAEYARABCAEAAOwA5ADcAQABFAEoATgBSAFIARQAzAPEA/gADAAkADgATABgAHQAhACYAJwAmACIAHwAcABkAFQASAA8ADAAGAAAAAP7//gD8//oA9f/uAOz/4gDc/8oAxf+yAKz/owCe/5YAlP+FAIH/bQBw/1gAVv9MAEz/RABF/zwAOv8zACz/JgAi/x0AGf8UABE/CgAD/wD//vf/4v/T/8L/pv9+/1n/Rv83/in/HP8R/wYAAAD8//YA6//P/6z/eP9E/yX/AAAA/v/p/7//PP8A/v/t//n/9//8//7//wD/AP4A/QD0AOUAwwCkAG8ARQAmAAD8/8f/S/8A';

// Base64 encoded fanfare sound (WAV format) - A short, pleasant "level up" arpeggio
const completionFanfareB64 = 'data:audio/wav;base64,UklGRqYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaIAAACAgP/AAP/+/P/6//L/5f/d/9T/zv/C/7b/q/+Z/4r/df9p/2n/d/9+/4v/l/+j/7T/wP/O/9n/5v/w//v/AQADAAQAAwACAP//+v/s/+T/3P/W/8//yP/C/7//u/+y/6v/pv+f/5j/lP+S/4//jP+O/5H/lf+b/6H/pv+q/7L/uP+8/7//wP/C/8b/yv/N/8//0f/S/9L/0v/R/8//zf/K/8b/wv/A/7//u/+y/6v/pv+f/5j/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP+O/5H/lf+a/6D/pf+q/7L/uP+7/77/wP/C/8b/yv/N/8//0P/Q/9D/z//N/8r/xv/C/7//uv+x/6r/pf+g/5n/lf+T/4//jP==';

// Helper to decode base64 data URI into an ArrayBuffer.
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64.split(',')[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Initializes the Web Audio API.
 * This must be called in response to a user gesture (e.g., a click)
 * to comply with browser autoplay policies. It's safe to call multiple times.
 */
export const initAudio = async (): Promise<void> => {
  if (audioContext || isInitializing) {
    return;
  }
  isInitializing = true;
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const successChimeData = base64ToArrayBuffer(successChimeB64);
    const completionFanfareData = base64ToArrayBuffer(completionFanfareB64);

    // Decode audio data in parallel
    // We use .slice(0) to create a copy of the ArrayBuffer, as some browser versions
    // of decodeAudioData can be destructive/detaching.
    [successChimeBuffer, completionFanfareBuffer] = await Promise.all([
      audioContext.decodeAudioData(successChimeData.slice(0)),
      audioContext.decodeAudioData(completionFanfareData.slice(0))
    ]);
  } catch (error) {
    console.error("Failed to initialize or decode audio:", error);
    // Reset on failure to allow retrying
    audioContext = null;
  } finally {
    isInitializing = false;
  }
};

/**
 * Plays a sound from a buffer.
 * @param buffer The AudioBuffer to play.
 */
const playSound = (buffer: AudioBuffer | null) => {
  if (!audioContext || !buffer) {
    // It's possible initAudio hasn't been called or failed.
    // We don't want to spam the console if it's just not ready.
    if (!isInitializing) {
      console.warn('Audio context not initialized or buffer not loaded.');
    }
    return;
  }

  // Ensure context is running (it can be suspended by the browser)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};

/**
 * Plays the success chime sound.
 */
export const playSuccessChime = () => {
  playSound(successChimeBuffer);
};

/**
 * Plays the completion fanfare sound.
 */
export const playCompletionFanfare = () => {
  playSound(completionFanfareBuffer);
};