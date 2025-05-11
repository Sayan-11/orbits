// Audio context and initialization flag
let audioContext;
let audioInitialized = false;

// Audio nodes
let musicGainNode, effectsGainNode, masterGainNode;
let blackHoleSound, neutronSound;

// Audio sources
const audioSources = {
  hitSound: null,
  launchSound: null,
  collectSound: null
};

// Initialize audio context
try {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContextClass();
} catch (e) {
  console.log('Web Audio API not supported:', e);
}

// Initialize audio system
export function initAudio() {
  if (audioInitialized) return;
  
  if (!window.AudioContext && !window.webkitAudioContext) {
    console.log('Web Audio API not supported');
    return;
  }
  
  try {
    // Create gain nodes for volume control
    masterGainNode = audioContext.createGain();
    musicGainNode = audioContext.createGain();
    effectsGainNode = audioContext.createGain();
    
    // Set initial volumes
    masterGainNode.gain.value = 0.7;
    musicGainNode.gain.value = 0.3;
    effectsGainNode.gain.value = 0.6;
    
    // Connect nodes
    musicGainNode.connect(masterGainNode);
    effectsGainNode.connect(masterGainNode);
    masterGainNode.connect(audioContext.destination);
    
    // Generate synthetic sounds
    generateSounds();
    
    // Start lofi music
    createLofiLoop();
    
    // Create celestial sounds
    createCelestialSounds();
    
    // Create radio hum
    createRadioHum();
    
    audioInitialized = true;
    console.log('Audio system initialized');
  } catch (err) {
    console.log('Error initializing audio:', err);
  }
}

// Initialize audio on user interaction
export function initAudioOnInteraction() {
  if (!audioInitialized) {
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    
    if (source.start) {
      source.start(0);
    } else if (source.noteOn) {
      source.noteOn(0);
    }
    
    audioContext.resume().then(() => {
      initAudio();
      console.log('Audio initialized successfully');
    }).catch(err => {
      console.log('Failed to initialize audio:', err);
    });
  }
}

// Generate synthetic sounds
function generateSounds() {
  // Hit sound
  const hitOsc = audioContext.createOscillator();
  const hitGain = audioContext.createGain();
  hitOsc.type = 'sine';
  hitOsc.frequency.setValueAtTime(440, audioContext.currentTime);
  hitGain.gain.setValueAtTime(0.5, audioContext.currentTime);
  hitGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  hitOsc.connect(hitGain);
  hitGain.connect(effectsGainNode);
  hitOsc.start();
  hitOsc.stop(audioContext.currentTime + 0.1);
  audioSources.hitSound = hitOsc;

  // Launch sound
  const launchOsc = audioContext.createOscillator();
  const launchGain = audioContext.createGain();
  launchOsc.type = 'sine';
  launchOsc.frequency.setValueAtTime(880, audioContext.currentTime);
  launchGain.gain.setValueAtTime(0.5, audioContext.currentTime);
  launchGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  launchOsc.connect(launchGain);
  launchGain.connect(effectsGainNode);
  launchOsc.start();
  launchOsc.stop(audioContext.currentTime + 0.2);
  audioSources.launchSound = launchOsc;

  // Collect sound
  const collectOsc = audioContext.createOscillator();
  const collectGain = audioContext.createGain();
  collectOsc.type = 'sine';
  collectOsc.frequency.setValueAtTime(660, audioContext.currentTime);
  collectGain.gain.setValueAtTime(0.5, audioContext.currentTime);
  collectGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  collectOsc.connect(collectGain);
  collectGain.connect(effectsGainNode);
  collectOsc.start();
  collectOsc.stop(audioContext.currentTime + 0.15);
  audioSources.collectSound = collectOsc;
}

// Create lofi music loop
function createLofiLoop() {
  const lofiOsc = audioContext.createOscillator();
  const lofiGain = audioContext.createGain();
  lofiOsc.type = 'sine';
  lofiOsc.frequency.setValueAtTime(220, audioContext.currentTime);
  lofiGain.gain.setValueAtTime(0.1, audioContext.currentTime);
  lofiOsc.connect(lofiGain);
  lofiGain.connect(musicGainNode);
  lofiOsc.start();
}

// Create celestial sounds
export function createCelestialSounds() {
  // Black hole sound
  const blackHoleOsc = audioContext.createOscillator();
  const blackHoleGain = audioContext.createGain();
  blackHoleOsc.type = 'sine';
  blackHoleOsc.frequency.setValueAtTime(110, audioContext.currentTime);
  blackHoleGain.gain.setValueAtTime(0, audioContext.currentTime);
  blackHoleOsc.connect(blackHoleGain);
  blackHoleGain.connect(effectsGainNode);
  blackHoleOsc.start();
  blackHoleSound = { osc: blackHoleOsc, gainNode: blackHoleGain };

  // Neutron sound
  const neutronOsc = audioContext.createOscillator();
  const neutronGain = audioContext.createGain();
  neutronOsc.type = 'sine';
  neutronOsc.frequency.setValueAtTime(330, audioContext.currentTime);
  neutronGain.gain.setValueAtTime(0, audioContext.currentTime);
  neutronOsc.connect(neutronGain);
  neutronGain.connect(effectsGainNode);
  neutronOsc.start();
  neutronSound = { osc: neutronOsc, gainNode: neutronGain };
}

// Create radio hum
function createRadioHum() {
  const radioOsc = audioContext.createOscillator();
  const radioGain = audioContext.createGain();
  radioOsc.type = 'sine';
  radioOsc.frequency.setValueAtTime(440, audioContext.currentTime);
  radioGain.gain.setValueAtTime(0.05, audioContext.currentTime);
  radioOsc.connect(radioGain);
  radioGain.connect(effectsGainNode);
  radioOsc.start();
}

// Update celestial sounds based on player position
export function updateCelestialSounds(player, planets) {
  if (!audioInitialized || !blackHoleSound || !neutronSound) return;
  
  let blackHoleVolume = 0;
  let neutronVolume = 0;
  
  for (const planet of planets) {
    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = planet.gravityRange * 2;
    
    if (distance < maxDistance) {
      const volume = Math.max(0, 1 - (distance / maxDistance)) * 0.3;
      
      if (planet.type === 'BLACK_HOLE') {
        blackHoleVolume = Math.max(blackHoleVolume, volume);
      } else if (planet.type === 'NEUTRON') {
        neutronVolume = Math.max(neutronVolume, volume);
      }
    }
  }
  
  // Smoothly transition volumes
  const currentTime = audioContext.currentTime;
  blackHoleSound.gainNode.gain.linearRampToValueAtTime(blackHoleVolume, currentTime + 0.1);
  neutronSound.gainNode.gain.linearRampToValueAtTime(neutronVolume, currentTime + 0.1);
  
  // Add pulsing effect to neutron star
  if (neutronVolume > 0) {
    const pulseFrequency = 2;
    const pulseAmount = 0.5;
    const pulsedVolume = neutronVolume * (1 + Math.sin(currentTime * pulseFrequency * Math.PI * 2) * pulseAmount);
    neutronSound.gainNode.gain.setValueAtTime(pulsedVolume, currentTime);
  }
}

// Export audio sources and initialization flag
export { audioSources, audioInitialized }; 