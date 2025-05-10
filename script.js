// Audio System
let audioContext;
try {
  // Use the standard AudioContext or the webkit prefixed version
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioContext = new AudioContextClass();
} catch (e) {
  console.log('Web Audio API not supported:', e);
}
// Audio sources
const audioSources = {
  hitSound: null,
  launchSound: null,
  collectSound: null,
};

// Audio nodes
let musicGainNode, effectsGainNode, masterGainNode;
let blackHoleSound, neutronSound, radioHumSound;

// Audio initialization flag - ADD THIS LINE
let audioInitialized = false;

function initAudio() {
  if (audioInitialized) return;

  // Check if AudioContext is available
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

// Generate synthetic sound effects
function generateSounds() {
  // Hit sound (negative ting)
  audioSources.hitSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      100,
      audioContext.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.connect(gainNode);
    gainNode.connect(effectsGainNode);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // Launch sound (positive ting)
  audioSources.launchSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      900,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.15
    );

    oscillator.connect(gainNode);
    gainNode.connect(effectsGainNode);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  // Collect time bonus sound
  audioSources.collectSound = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1200,
      audioContext.currentTime + 0.1
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      1600,
      audioContext.currentTime + 0.2
    );

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.connect(gainNode);
    gainNode.connect(effectsGainNode);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };
}

// Create radio hum background sound
function createRadioHum() {
  // Create noise for radio static
  const bufferSize = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 0.1 - 0.05;
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = audioContext.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, audioContext.currentTime);
  filter.Q.setValueAtTime(1, audioContext.currentTime);

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(effectsGainNode);

  noise.start();

  // Add low frequency hum
  const hum = audioContext.createOscillator();
  hum.type = 'sine';
  hum.frequency.setValueAtTime(60, audioContext.currentTime);

  const humGain = audioContext.createGain();
  humGain.gain.setValueAtTime(0.1, audioContext.currentTime);

  hum.connect(humGain);
  humGain.connect(effectsGainNode);
  hum.start();
}

// Create a simple lofi loop using oscillators
function createLofiLoop() {
  const chords = [
    [261.63, 329.63, 392.0], // C major
    [293.66, 369.99, 440.0], // D minor
    [329.63, 415.3, 493.88], // E minor
    [349.23, 440.0, 523.25], // F major
  ];

  let chordIndex = 0;

  function playChord() {
    const chord = chords[chordIndex];

    chord.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.detune.setValueAtTime(
        Math.random() * 10 - 5,
        audioContext.currentTime
      );

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.08,
        audioContext.currentTime + 0.1
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1.8
      );

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(musicGainNode);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    });

    chordIndex = (chordIndex + 1) % chords.length;
  }

  playChord();
  setInterval(playChord, 2000);
}

// Create ambient sounds for celestial objects
function createCelestialSounds() {
  // Black hole sound - deep ominous hum
  blackHoleSound = audioContext.createOscillator();
  const blackHoleGain = audioContext.createGain();
  const blackHoleFilter = audioContext.createBiquadFilter();

  blackHoleSound.type = 'sawtooth';
  blackHoleSound.frequency.setValueAtTime(30, audioContext.currentTime);

  blackHoleFilter.type = 'lowpass';
  blackHoleFilter.frequency.setValueAtTime(100, audioContext.currentTime);
  blackHoleFilter.Q.setValueAtTime(10, audioContext.currentTime);

  blackHoleGain.gain.setValueAtTime(0, audioContext.currentTime);

  blackHoleSound.connect(blackHoleFilter);
  blackHoleFilter.connect(blackHoleGain);
  blackHoleGain.connect(effectsGainNode);

  blackHoleSound.start();

  // Neutron star sound - pulsing high frequency
  neutronSound = audioContext.createOscillator();
  const neutronGain = audioContext.createGain();
  const neutronFilter = audioContext.createBiquadFilter();

  neutronSound.type = 'square';
  neutronSound.frequency.setValueAtTime(800, audioContext.currentTime);

  neutronFilter.type = 'bandpass';
  neutronFilter.frequency.setValueAtTime(1000, audioContext.currentTime);
  neutronFilter.Q.setValueAtTime(20, audioContext.currentTime);

  neutronGain.gain.setValueAtTime(0, audioContext.currentTime);

  neutronSound.connect(neutronFilter);
  neutronFilter.connect(neutronGain);
  neutronGain.connect(effectsGainNode);

  neutronSound.start();

  // Store references for volume control
  blackHoleSound.gainNode = blackHoleGain;
  neutronSound.gainNode = neutronGain;
}

// Update celestial sound volumes based on distance
function updateCelestialSounds() {
  if (!audioInitialized || !blackHoleSound || !neutronSound) return;

  let blackHoleVolume = 0;
  let neutronVolume = 0;

  for (const planet of planets) {
    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = planet.gravityRange * 2;

    if (distance < maxDistance) {
      const volume = Math.max(0, 1 - distance / maxDistance) * 0.3;

      if (planet.type === PLANET_TYPES.BLACK_HOLE) {
        blackHoleVolume = Math.max(blackHoleVolume, volume);
      } else if (planet.type === PLANET_TYPES.NEUTRON) {
        neutronVolume = Math.max(neutronVolume, volume);
      }
    }
  }

  // Smoothly transition volumes
  const currentTime = audioContext.currentTime;
  blackHoleSound.gainNode.gain.linearRampToValueAtTime(
    blackHoleVolume,
    currentTime + 0.1
  );
  neutronSound.gainNode.gain.linearRampToValueAtTime(
    neutronVolume,
    currentTime + 0.1
  );

  // Add pulsing effect to neutron star
  if (neutronVolume > 0) {
    const pulseFrequency = 2;
    const pulseAmount = 0.5;
    const pulsedVolume =
      neutronVolume *
      (1 + Math.sin(currentTime * pulseFrequency * Math.PI * 2) * pulseAmount);
    neutronSound.gainNode.gain.setValueAtTime(pulsedVolume, currentTime);
  }
}

// Initialize audio on first user interaction
function initAudioOnInteraction() {
  if (!audioInitialized) {
    // Create a buffer of silence to unlock audio on iOS
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    // Play the silent buffer
    if (source.start) {
      source.start(0);
    } else if (source.noteOn) {
      source.noteOn(0);
    }

    // Resume the audio context
    audioContext
      .resume()
      .then(() => {
        initAudio();
        console.log('Audio initialized successfully');
      })
      .catch(err => {
        console.log('Failed to initialize audio:', err);
      });
  }
}

// Performance optimization variables
let lastFrameTime = 0;
const targetFPS = 60;
const frameDelay = 1000 / targetFPS;
let deltaTime = 0;

// Canvas setup with pixel ratio handling
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Handle high DPI displays - optimized for mobile
let pixelRatio = window.devicePixelRatio || 1;
function setupCanvas() {
  // Limit pixel ratio on mobile for better performance
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = canvas.clientWidth * pixelRatio;
  canvas.height = canvas.clientHeight * pixelRatio;
  ctx.scale(pixelRatio, pixelRatio);

  // Enable image smoothing for better performance
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'low';
}
setupCanvas();

// UI elements
const gameMessage = document.getElementById('gameMessage');
const restartButton = document.getElementById('restartButton');

// Remove unused UI elements
if (document.getElementById('scoreValue')) {
  document.getElementById('scoreValue').parentElement.style.display = 'none';
}
if (document.getElementById('levelValue')) {
  document.getElementById('levelValue').parentElement.style.display = 'none';
}
if (document.getElementById('debrisValue')) {
  document.getElementById('debrisValue').parentElement.style.display = 'none';
}

// Game states
const GAME_STATES = {
  START_SCREEN: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameover',
};

// Game state
let gameState = GAME_STATES.START_SCREEN;
let challengeStartTime = 0;
let challengeTimeLimit = 90000; // 90 seconds
let timeDilationFactor = 1.0;
let challengesCompleted = 0;
let hasBlackHole = false;

// Constants
const PLANET_TYPES = {
  NORMAL: {
    color: '#3498db',
    orbitColor: 'rgba(52, 152, 219, 0.3)',
    mass: 1.0,
    orbitSpeedMultiplier: 1.0,
    gravitationalConstant: 500,
  },
  NEUTRON: {
    color: '#f5f5f5',
    orbitColor: 'rgba(255, 255, 255, 0.5)',
    mass: 3.0,
    orbitSpeedMultiplier: 2.5,
    gravitationalConstant: 800,
  },
  BLACK_HOLE: {
    color: '#111',
    orbitColor: 'rgba(75, 0, 130, 0.3)',
    mass: 5.0,
    orbitSpeedMultiplier: 1.8,
    gravitationalConstant: 1200,
    timeDilation: 1.5,
  },
};

// Game objects
const player = {
  x: 0,
  y: 0,
  radius: 4,
  velocity: { x: 0, y: 0 },
  currentOrbit: null,
  angle: 0,
  color: '#fff',
  trail: [],
};

const planets = [];
const starfield = [];
const spaceDebris = [];
let wormhole = null;

// Vibration function
function vibrate(pattern) {
  if (navigator && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Vibration not supported or failed
    }
  }
}

// Initialize game
function initGame() {
  // Reset state
  gameState = GAME_STATES.PLAYING;
  challengesCompleted = 0;
  gameMessage.classList.remove('visible');
  restartButton.style.display = 'none';

  // Start first challenge
  startNewChallenge();
}

function startNewChallenge() {
  // Ensure message is hidden
  gameMessage.classList.remove('visible');

  // Clear existing objects
  planets.length = 0;
  spaceDebris.length = 0;
  player.trail.length = 0;
  wormhole = null;
  hasBlackHole = false;

  // Reset challenge timer
  challengeStartTime = Date.now();
  timeDilationFactor = 1.0;

  // Generate new challenge
  generateStarfield();
  generatePlanets();
  generateSpaceDebris();
  generateWormhole();

  // Position player at the first planet
  attachToOrbit(planets[0]);

  // Show brief message for new challenge
  showMessage('Reach the wormhole!', 1000); // Show for only 1 second
}

// Optimized starfield generation - fewer stars on mobile
function generateStarfield() {
  starfield.length = 0;
  // Reduce stars on mobile for better performance
  const starCount = window.innerWidth < 768 ? 50 : 100;

  for (let i = 0; i < starCount; i++) {
    starfield.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.8 + 0.2,
    });
  }
}

function generatePlanets() {
  const screenSize = Math.min(canvas.clientWidth, canvas.clientHeight);
  const scale = screenSize / 600;

  // Binary systems appear early and frequently
  const isBinarySystem = Math.random() > 0.4;
  const isMultipleNeutrons = challengesCompleted > 0 && Math.random() > 0.7;

  if (isBinarySystem) {
    // Create binary system
    createBinarySystem(scale);
  } else if (isMultipleNeutrons) {
    // Create system with multiple neutron stars
    createMultiNeutronSystem(scale);
  } else {
    // Regular planetary system
    createRegularSystem(scale);
  }

  player.radius = 4 * scale;
}

function createBinarySystem(scale) {
  const centerX = canvas.clientWidth * 0.5;
  const centerY = canvas.clientHeight * 0.5;
  const orbitRadius = 100 * scale;

  // Binary stars orbiting a common center
  const star1 = {
    x: centerX - orbitRadius / 2,
    y: centerY,
    radius: 20 * scale,
    orbitRadius: 80 * scale,
    orbitSpeed: 0.015,
    type: PLANET_TYPES.NORMAL,
    gravityRange: 200 * scale,
    binaryOffset: 0,
    binaryOrbitRadius: orbitRadius / 2,
    binaryCenter: { x: centerX, y: centerY },
  };

  const star2 = {
    x: centerX + orbitRadius / 2,
    y: centerY,
    radius: 15 * scale,
    orbitRadius: 60 * scale,
    orbitSpeed: 0.02,
    type: Math.random() > 0.5 ? PLANET_TYPES.BLACK_HOLE : PLANET_TYPES.NORMAL,
    gravityRange: 250 * scale,
    binaryOffset: Math.PI,
    binaryOrbitRadius: orbitRadius / 2,
    binaryCenter: { x: centerX, y: centerY },
  };

  planets.push(star1, star2);

  if (star2.type === PLANET_TYPES.BLACK_HOLE) {
    hasBlackHole = true;
  }

  // Add some regular planets
  for (let i = 0; i < 2; i++) {
    addRegularPlanet(scale, 180);
  }
}

function createMultiNeutronSystem(scale) {
  const centerX = canvas.clientWidth * 0.5;
  const centerY = canvas.clientHeight * 0.5;

  // Multiple neutron stars in a complex orbital pattern
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const distance = 150 * scale;

    planets.push({
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      radius: 8 * scale,
      orbitRadius: 40 * scale,
      orbitSpeed: 0.05 + i * 0.01,
      type: PLANET_TYPES.NEUTRON,
      gravityRange: 130 * scale,
    });
  }

  // Add a black hole at center
  planets.push({
    x: centerX,
    y: centerY,
    radius: 15 * scale,
    orbitRadius: 70 * scale,
    orbitSpeed: 0.03,
    type: PLANET_TYPES.BLACK_HOLE,
    gravityRange: 200 * scale,
  });

  hasBlackHole = true;
}

function createRegularSystem(scale) {
  // Add a "home" planet
  planets.push({
    x: canvas.clientWidth * 0.5,
    y: canvas.clientHeight * 0.5,
    radius: 15 * scale,
    orbitRadius: 60 * scale,
    orbitSpeed: 0.02,
    type: PLANET_TYPES.NORMAL,
    gravityRange: 150 * scale,
  });

  // Add other planets
  const numPlanets = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < numPlanets; i++) {
    addRegularPlanet(scale, 180);
  }
}

function addRegularPlanet(scale, minDistance) {
  let validPosition = false;
  let attempts = 0;

  while (!validPosition && attempts < 50) {
    attempts++;
    const buffer = 50 * scale;
    const x = buffer + Math.random() * (canvas.clientWidth - 2 * buffer);
    const y = buffer + Math.random() * (canvas.clientHeight - 2 * buffer);

    validPosition = true;
    for (const planet of planets) {
      const dx = x - planet.x;
      const dy = y - planet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance * scale) {
        validPosition = false;
        break;
      }
    }

    if (validPosition) {
      const planetType =
        Math.random() < 0.3
          ? PLANET_TYPES.BLACK_HOLE
          : Math.random() < 0.5
          ? PLANET_TYPES.NEUTRON
          : PLANET_TYPES.NORMAL;

      if (planetType === PLANET_TYPES.BLACK_HOLE) {
        hasBlackHole = true;
      }

      const planetSize =
        planetType === PLANET_TYPES.NEUTRON
          ? 8 * scale
          : planetType === PLANET_TYPES.BLACK_HOLE
          ? 12 * scale
          : (Math.random() * 10 + 10) * scale;

      const orbitSpeed =
        planetType.orbitSpeedMultiplier * 0.02 * (1 / Math.sqrt(planetSize));

      planets.push({
        x: x,
        y: y,
        radius: planetSize,
        orbitRadius:
          planetType === PLANET_TYPES.NEUTRON
            ? 40 * scale
            : planetType === PLANET_TYPES.BLACK_HOLE
            ? 70 * scale
            : planetSize * 3 + 20,
        orbitSpeed: orbitSpeed,
        type: planetType,
        gravityRange:
          planetType === PLANET_TYPES.BLACK_HOLE ? 200 * scale : 150 * scale,
      });
    }
  }
}

function generateSpaceDebris() {
  const screenSize = Math.min(canvas.clientWidth, canvas.clientHeight);
  const scale = screenSize / 600;
  const debrisCount = Math.floor(20 + Math.random() * 10); // More debris

  for (let i = 0; i < debrisCount; i++) {
    let validPosition = false;
    let debris;

    while (!validPosition) {
      const x = Math.random() * canvas.clientWidth;
      const y = Math.random() * canvas.clientHeight;

      validPosition = true;
      for (const planet of planets) {
        const dx = x - planet.x;
        const dy = y - planet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < planet.orbitRadius * 1.5) {
          validPosition = false;
          break;
        }
      }

      if (validPosition) {
        // Some debris starts in orbit, some doesn't
        const isOrbiting = Math.random() > 0.6;
        let orbitingPlanet = null;

        if (isOrbiting && planets.length > 0) {
          orbitingPlanet = planets[Math.floor(Math.random() * planets.length)];
          // Position debris in orbit
          const angle = Math.random() * Math.PI * 2;
          const orbitDistance =
            orbitingPlanet.orbitRadius * (1.2 + Math.random() * 0.8);

          debris = {
            x: orbitingPlanet.x + Math.cos(angle) * orbitDistance,
            y: orbitingPlanet.y + Math.sin(angle) * orbitDistance,
            radius: (1.5 + Math.random() * 3) * scale,
            vx: 0,
            vy: 0,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            dangerous: true,
            timeBonus: Math.random() < 0.05, // 5% chance for time bonus
            orbitingPlanet: orbitingPlanet,
            orbitAngle: angle,
            orbitDistance: orbitDistance,
            orbitSpeed:
              (Math.random() > 0.5 ? 1 : -1) * (0.01 + Math.random() * 0.02),
          };
        } else {
          debris = {
            x: x,
            y: y,
            radius: (1.5 + Math.random() * 3) * scale,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            dangerous: true,
            timeBonus: Math.random() < 0.05, // 5% chance for time bonus
            orbitingPlanet: null,
          };
        }
      }
    }

    spaceDebris.push(debris);
  }
}

function generateWormhole() {
  const screenSize = Math.min(canvas.clientWidth, canvas.clientHeight);
  const scale = screenSize / 600;

  let validPosition = false;

  while (!validPosition) {
    const x = Math.random() * (canvas.clientWidth - 100) + 50;
    const y = Math.random() * (canvas.clientHeight - 100) + 50;

    validPosition = true;
    for (const planet of planets) {
      const dx = x - planet.x;
      const dy = y - planet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < planet.gravityRange + 100) {
        validPosition = false;
        break;
      }
    }

    if (validPosition) {
      wormhole = {
        x: x,
        y: y,
        radius: 25 * scale,
        rotation: 0,
        pulsePhase: 0,
      };
    }
  }
}

function showMessage(text, duration = 2000) {
  // Clear any existing timeout
  if (gameMessage.timeoutId) {
    clearTimeout(gameMessage.timeoutId);
    gameMessage.timeoutId = null;
  }

  gameMessage.textContent = text;
  gameMessage.classList.add('visible');

  // Auto-hide after duration
  gameMessage.timeoutId = setTimeout(() => {
    gameMessage.classList.remove('visible');
    gameMessage.timeoutId = null;
  }, duration);
}

function attachToOrbit(planet) {
  player.currentOrbit = planet;
  player.angle = Math.random() * Math.PI * 2;

  updatePlayerOrbitPosition();

  if (planet.type === PLANET_TYPES.BLACK_HOLE) {
    timeDilationFactor = planet.type.timeDilation || 1.0;
  } else {
    timeDilationFactor = 1.0;
  }

  vibrate([20]);
}

function updatePlayerOrbitPosition() {
  if (player.currentOrbit) {
    player.x =
      player.currentOrbit.x +
      Math.cos(player.angle) * player.currentOrbit.orbitRadius;
    player.y =
      player.currentOrbit.y +
      Math.sin(player.angle) * player.currentOrbit.orbitRadius;
  }
}

function releaseFromOrbit() {
  if (player.currentOrbit) {
    const planet = player.currentOrbit;

    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const nx = dx / distance;
    const ny = dy / distance;

    const tx = -ny;
    const ty = nx;

    const speed = 2.5;
    player.velocity.x = tx * speed;
    player.velocity.y = ty * speed;

    player.currentOrbit = null;
    timeDilationFactor = 1.0; // Reset time dilation when leaving orbit

    // Play launch sound
    if (audioInitialized && audioSources.launchSound) {
      audioSources.launchSound();
    }
  }
}

function checkPlanetCapture() {
  for (const planet of planets) {
    if (planet === player.currentOrbit) continue;

    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < planet.radius + player.radius) {
      endGame();
      return true;
    }

    if (distance < planet.gravityRange && distance > planet.orbitRadius * 0.8) {
      const dotProduct = dx * player.velocity.x + dy * player.velocity.y;

      if (dotProduct < 0) {
        attachToOrbit(planet);
        return true;
      }
    }
  }
  return false;
}

// Optimized trail rendering
function updateTrail() {
  // Reduce trail frequency on mobile
  const trailThreshold = window.innerWidth < 768 ? 10 : 5;

  if (
    player.trail.length === 0 ||
    Math.abs(player.x - player.trail[player.trail.length - 1].x) >
      trailThreshold ||
    Math.abs(player.y - player.trail[player.trail.length - 1].y) >
      trailThreshold
  ) {
    player.trail.push({ x: player.x, y: player.y, alpha: 1.0 });
  }

  // Shorter trail on mobile
  const maxTrailLength = window.innerWidth < 768 ? 10 : 15;
  if (player.trail.length > maxTrailLength) {
    player.trail.shift();
  }

  for (let i = 0; i < player.trail.length; i++) {
    player.trail[i].alpha -= 0.08; // Faster fade on mobile
    if (player.trail[i].alpha < 0) player.trail[i].alpha = 0;
  }
}

function checkOutOfBounds() {
  const buffer = 50;
  const gameWidth = canvas.width / pixelRatio;
  const gameHeight = canvas.height / pixelRatio;

  return (
    player.x < -buffer ||
    player.x > gameWidth + buffer ||
    player.y < -buffer ||
    player.y > gameHeight + buffer
  );
}

// Update space debris movement with deltaTime and gravity
function updateSpaceDebris(dt) {
  for (const debris of spaceDebris) {
    if (debris.orbitingPlanet) {
      // Update orbital motion
      debris.orbitAngle += debris.orbitSpeed * dt;
      debris.x =
        debris.orbitingPlanet.x +
        Math.cos(debris.orbitAngle) * debris.orbitDistance;
      debris.y =
        debris.orbitingPlanet.y +
        Math.sin(debris.orbitAngle) * debris.orbitDistance;
    } else {
      // Apply gravity from all planets
      for (const planet of planets) {
        const dx = planet.x - debris.x;
        const dy = planet.y - debris.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);

        if (distance < planet.gravityRange && distance > planet.radius) {
          // Calculate gravitational force
          const force =
            (planet.type.gravitationalConstant * planet.type.mass) /
            distanceSquared;
          const ax = (dx / distance) * force * dt * 0.01; // Reduced gravity effect
          const ay = (dy / distance) * force * dt * 0.01;

          debris.vx += ax;
          debris.vy += ay;

          // Check if debris should enter orbit
          if (distance < planet.orbitRadius * 2 && !debris.orbitingPlanet) {
            // Calculate orbital velocity
            const relativeVelocity = Math.sqrt(
              debris.vx * debris.vx + debris.vy * debris.vy
            );
            const orbitalVelocity =
              Math.sqrt(
                (planet.type.gravitationalConstant * planet.type.mass) /
                  distance
              ) * 0.05;

            if (relativeVelocity < orbitalVelocity * 2) {
              // Enter orbit
              debris.orbitingPlanet = planet;
              debris.orbitAngle = Math.atan2(
                debris.y - planet.y,
                debris.x - planet.x
              );
              debris.orbitDistance = distance;
              debris.orbitSpeed =
                ((Math.random() > 0.5 ? 1 : -1) * orbitalVelocity) / distance;
              debris.vx = 0;
              debris.vy = 0;
            }
          }
        }
      }

      // Update position
      debris.x += debris.vx * dt;
      debris.y += debris.vy * dt;
    }

    debris.rotation += debris.rotationSpeed * dt;

    // Wrap around screen edges
    if (debris.x < 0) debris.x = canvas.clientWidth;
    if (debris.x > canvas.clientWidth) debris.x = 0;
    if (debris.y < 0) debris.y = canvas.clientHeight;
    if (debris.y > canvas.clientHeight) debris.y = 0;

    // Check collision with planets
    for (const planet of planets) {
      const dx = planet.x - debris.x;
      const dy = planet.y - debris.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < planet.radius) {
        // Mark debris for removal
        debris.destroyed = true;
      }
    }
  }

  // Remove destroyed debris
  for (let i = spaceDebris.length - 1; i >= 0; i--) {
    if (spaceDebris[i].destroyed) {
      spaceDebris.splice(i, 1);
    }
  }
}

// Update wormhole animation with deltaTime
function updateWormhole(dt) {
  if (wormhole) {
    wormhole.rotation += 0.02 * dt;
    wormhole.pulsePhase += 0.05 * dt;
  }
}

function updateBinaryOrbits(dt) {
  for (const planet of planets) {
    if (planet.binaryCenter) {
      planet.binaryOffset += 0.01 * dt;
      planet.x =
        planet.binaryCenter.x +
        Math.cos(planet.binaryOffset) * planet.binaryOrbitRadius;
      planet.y =
        planet.binaryCenter.y +
        Math.sin(planet.binaryOffset) * planet.binaryOrbitRadius;
    }
  }
}

function checkCollisions() {
  for (let i = spaceDebris.length - 1; i >= 0; i--) {
    const debris = spaceDebris[i];
    const dx = player.x - debris.x;
    const dy = player.y - debris.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + debris.radius) {
      if (debris.timeBonus) {
        // Time bonus debris
        challengeStartTime += 10000; // Add 10 seconds
        spaceDebris.splice(i, 1);
        showMessage('+10 seconds!', 1000);
        vibrate([20, 20, 20]);
        if (audioInitialized && audioSources.collectSound) {
          audioSources.collectSound();
        }
      } else {
        // Dangerous debris
        endGame();
        vibrate([100, 30, 100, 30, 100]);
        if (audioInitialized && audioSources.hitSound) {
          audioSources.hitSound();
        }
        return;
      }
    }
  }

  if (wormhole) {
    const dx = player.x - wormhole.x;
    const dy = player.y - wormhole.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.radius + wormhole.radius) {
      challengeComplete();
    }
  }
}

function checkTimeLimit() {
  const elapsedTime = (Date.now() - challengeStartTime) * timeDilationFactor;
  const remainingTime = challengeTimeLimit - elapsedTime;

  if (remainingTime <= 0) {
    endGame();
  }

  return remainingTime;
}

function challengeComplete() {
  challengesCompleted++;

  // Show success message briefly
  showMessage('Wormhole reached!', 1500); // Shortened to 1.5 seconds

  // Single short vibration for success
  vibrate([50]); // Single 50ms vibration instead of pattern

  // Immediately clear the game message after delay
  setTimeout(() => {
    gameMessage.classList.remove('visible');
    // Start new challenge without additional delay
    startNewChallenge();
  }, 1500);
}

// Update endGame function to be cleaner
function endGame() {
  gameState = GAME_STATES.GAME_OVER;

  // Show game over message
  showMessage('Game Over!', 2000); // Show for 2 seconds

  // Show restart button after a short delay
  setTimeout(() => {
    restartButton.style.display = 'block';
  }, 500);

  // Single vibration pattern
  vibrate([200]); // Single 200ms vibration
}
// Update function with deltaTime for consistent speed
function update(dt) {
  if (gameState !== GAME_STATES.PLAYING) return;

  // Update time dilation based on proximity to black holes
  let nearBlackHole = false;
  for (const planet of planets) {
    if (planet.type === PLANET_TYPES.BLACK_HOLE) {
      const dx = player.x - planet.x;
      const dy = player.y - planet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < planet.gravityRange * 1.5) {
        nearBlackHole = true;
        timeDilationFactor = planet.type.timeDilation;
        break;
      }
    }
  }

  if (!nearBlackHole) {
    timeDilationFactor = 1.0;
  }

  // Check time limit
  const remainingTime = checkTimeLimit();
  if (remainingTime <= 0) return;

  if (player.currentOrbit) {
    // Adjust rotation speed based on deltaTime
    player.angle += player.currentOrbit.orbitSpeed * dt;
    updatePlayerOrbitPosition();
  } else {
    // Adjust movement based on deltaTime
    player.x += player.velocity.x * dt;
    player.y += player.velocity.y * dt;

    const captured = checkPlanetCapture();

    if (!captured && checkOutOfBounds()) {
      endGame();
    }
  }

  updateTrail();
  updateSpaceDebris(dt);
  updateWormhole(dt);
  updateBinaryOrbits(dt);
  checkCollisions();
  updateCelestialSounds();
}

// Draw start screen
// Replace the font loading in drawStartScreen function with proper fallbacks:
const logoImage = new Image();
logoImage.src =
  'https://ik.imagekit.io/ciuzeltsf/orbits.png?updatedAt=1746884585959';

function drawStartScreen() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw starfield
  for (const star of starfield) {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Set up proper scaling for text
  const scale = Math.min(canvas.clientWidth, canvas.clientHeight) / 600;

  // Draw logo if loaded - smaller and positioned higher
  if (logoImage.complete) {
    const logoScale = scale * 0.12; // Smaller logo
    const logoWidth = logoImage.width * logoScale;
    const logoHeight = logoImage.height * logoScale;
    const logoX = canvas.clientWidth / 2 - logoWidth / 2;
    const logoY = canvas.clientHeight * 0.25 - logoHeight / 2; // Higher position

    ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
  }

  // Title - orbits (positioned right below logo)
  ctx.fillStyle = '#fff';
  ctx.font = `${42 * scale}px Arial, sans-serif`; // Simpler font and size
  ctx.textAlign = 'center';
  ctx.fillText('orbits', canvas.clientWidth / 2, canvas.clientHeight * 0.35);

  // Instructions - formatted like wireframe
  ctx.font = `${18 * scale}px Arial, sans-serif`;
  ctx.fillStyle = '#fff';

  const lines = [
    'Navigate your way through orbits',
    'to reach the wormhole in 90 seconds.',
     'Avoid debris.'
  ];

  lines.forEach((text, index) => {
    ctx.fillText(
      text,
      canvas.clientWidth / 2,
      canvas.clientHeight * 0.5 + index * 30 * scale
    );
  });

  // Second line of instructions
  
  ctx.fillText(
    'Tip: Orbiting near blackhole will make time run faster outside.',
    canvas.clientWidth / 2,
    canvas.clientHeight * 0.65
  );

  // Start button 
  const buttonWidth = 200 * scale;
  const buttonHeight = 50 * scale;
  const buttonX = canvas.clientWidth / 2 - buttonWidth / 2;
  const buttonY = canvas.clientHeight * 0.8;
  const borderRadius = 15 * scale; // Add border radius
  
  // Draw simple rectangle button
  // Draw rounded rectangle button
  ctx.fillStyle = "#0066cc";
  ctx.beginPath();
  ctx.moveTo(buttonX + borderRadius, buttonY);
  ctx.lineTo(buttonX + buttonWidth - borderRadius, buttonY);
  ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY, buttonX + buttonWidth, buttonY + borderRadius);
  ctx.lineTo(buttonX + buttonWidth, buttonY + buttonHeight - borderRadius);
  ctx.quadraticCurveTo(buttonX + buttonWidth, buttonY + buttonHeight, buttonX + buttonWidth - borderRadius, buttonY + buttonHeight);
  ctx.lineTo(buttonX + borderRadius, buttonY + buttonHeight);
  ctx.quadraticCurveTo(buttonX, buttonY + buttonHeight, buttonX, buttonY + buttonHeight - borderRadius);
  ctx.lineTo(buttonX, buttonY + borderRadius);
  ctx.quadraticCurveTo(buttonX, buttonY, buttonX + borderRadius, buttonY);
  ctx.closePath();
  ctx.fill();
  // Button text
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${18 * scale}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(
    'START GAME',
    canvas.clientWidth / 2,
    buttonY + buttonHeight / 2 + 6
  );
}

// Update the render function to include font fallbacks:
function render() {
  if (gameState === GAME_STATES.START_SCREEN) {
    drawStartScreen();
    return;
  }

  // ... existing render code ...

  // Draw timer (update this section)
  if (gameState === GAME_STATES.PLAYING) {
    const remainingTime = checkTimeLimit();
    const seconds = Math.max(0, Math.floor(remainingTime / 1000));

    // Timer background with rounded corners
    const timerWidth = 140;
    const timerHeight = 50;
    const timerX = canvas.clientWidth / 2 - timerWidth / 2;
    const timerY = 20;
    const borderRadius = 25;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.moveTo(timerX + borderRadius, timerY);
    ctx.lineTo(timerX + timerWidth - borderRadius, timerY);
    ctx.quadraticCurveTo(
      timerX + timerWidth,
      timerY,
      timerX + timerWidth,
      timerY + borderRadius
    );
    ctx.lineTo(timerX + timerWidth, timerY + timerHeight - borderRadius);
    ctx.quadraticCurveTo(
      timerX + timerWidth,
      timerY + timerHeight,
      timerX + timerWidth - borderRadius,
      timerY + timerHeight
    );
    ctx.lineTo(timerX + borderRadius, timerY + timerHeight);
    ctx.quadraticCurveTo(
      timerX,
      timerY + timerHeight,
      timerX,
      timerY + timerHeight - borderRadius
    );
    ctx.lineTo(timerX, timerY + borderRadius);
    ctx.quadraticCurveTo(timerX, timerY, timerX + borderRadius, timerY);
    ctx.closePath();
    ctx.fill();

    // Timer border
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Timer text with fallback fonts
    ctx.fillStyle = seconds < 10 ? '#ff0000' : '#fff';
    ctx.font = `bold ${28}px Orbitron, 'Courier New', monospace`;
    ctx.textAlign = 'center';
    ctx.shadowColor = seconds < 10 ? '#ff0000' : '#0ff';
    ctx.shadowBlur = 10;
    ctx.fillText(`${seconds}s`, canvas.clientWidth / 2, timerY + 35);
    ctx.shadowBlur = 0;

    // Time dilation indicator
    if (timeDilationFactor > 1.0) {
      ctx.fillStyle = '#ff00ff';
      ctx.font = `bold ${14}px Orbitron, 'Courier New', monospace`;
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 8;
      ctx.fillText(
        `TIME x${timeDilationFactor}`,
        canvas.clientWidth / 2,
        timerY + 80
      );
      ctx.shadowBlur = 0;
    }

    // Challenge counter
    // ctx.fillStyle = "#fff";
    // ctx.font = `bold ${20}px Orbitron, 'Courier New', monospace`;
    // ctx.textAlign = "left";
    // ctx.shadowColor = '#0ff';
    // ctx.shadowBlur = 8;
    // ctx.fillText(`Challenge: ${challengesCompleted + 1}`, 20, 45);
    // ctx.shadowBlur = 0;
  }
}

// Optimized render function
function render() {
  if (gameState === GAME_STATES.START_SCREEN) {
    drawStartScreen();
    return;
  }

  // Use clearRect instead of fillRect for better performance
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Only draw visible stars
  for (const star of starfield) {
    if (
      star.x >= 0 &&
      star.x <= canvas.width &&
      star.y >= 0 &&
      star.y <= canvas.height
    ) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw wormhole portal
  if (wormhole) {
    const gradient = ctx.createRadialGradient(
      wormhole.x,
      wormhole.y,
      0,
      wormhole.x,
      wormhole.y,
      wormhole.radius * 1.5
    );

    const hue = (Date.now() / 20) % 360;
    gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.8)`);
    gradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 100%, 60%, 0.6)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      wormhole.x,
      wormhole.y,
      wormhole.radius * (1 + Math.sin(wormhole.pulsePhase) * 0.1),
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.save();
    ctx.translate(wormhole.x, wormhole.y);
    ctx.rotate(wormhole.rotation);

    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(wormhole.radius * 1.2, 0);
      ctx.strokeStyle = `hsla(${(hue + i * 45) % 360}, 100%, 70%, 0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }
    ctx.restore();
  }

  // Draw planets and orbits
  for (const planet of planets) {
    if (planet.type !== PLANET_TYPES.BLACK_HOLE) {
      ctx.strokeStyle = planet.type.orbitColor;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.gravityRange, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = planet.type.color;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();

    if (planet.type === PLANET_TYPES.NEUTRON) {
      const pulseScale = 1 + Math.sin(Date.now() * 0.01) * 0.1;
      const gradient = ctx.createRadialGradient(
        planet.x,
        planet.y,
        planet.radius * 0.5,
        planet.x,
        planet.y,
        planet.radius * 2 * pulseScale
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        planet.x,
        planet.y,
        planet.radius * 2 * pulseScale,
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else if (planet.type === PLANET_TYPES.BLACK_HOLE) {
      const gradient = ctx.createRadialGradient(
        planet.x,
        planet.y,
        planet.radius * 0.5,
        planet.x,
        planet.y,
        planet.radius * 1.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.7, 'rgba(75, 0, 130, 0.7)');
      gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw space debris
  for (const debris of spaceDebris) {
    ctx.save();
    ctx.translate(debris.x, debris.y);
    ctx.rotate(debris.rotation);

    if (debris.timeBonus) {
      // Time bonus debris - blue and glowing
      ctx.fillStyle = '#0080ff';
      ctx.strokeStyle = '#00c0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, debris.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glow effect
      const glowGradient = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        debris.radius * 2
      );
      glowGradient.addColorStop(0, 'rgba(0, 128, 255, 0.5)');
      glowGradient.addColorStop(1, 'rgba(0, 128, 255, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, debris.radius * 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Dangerous debris - red and jagged
      ctx.fillStyle = '#ff3030';
      ctx.strokeStyle = '#ff6060';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = debris.radius * (0.8 + Math.random() * 0.4);
        if (i === 0) {
          ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        } else {
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw player trail
  for (let i = 0; i < player.trail.length; i++) {
    const point = player.trail[i];
    ctx.fillStyle = `rgba(0, 255, 255, ${point.alpha * 0.7})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, player.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw player
  ctx.fillStyle = player.color;
  ctx.shadowColor = '#0ff';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw trajectory projection if orbiting
  if (player.currentOrbit && gameState === GAME_STATES.PLAYING) {
    const planet = player.currentOrbit;
    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const nx = dx / distance;
    const ny = dy / distance;

    const tx = -ny;
    const ty = nx;

    const speed = 2.5;
    const projVelocityX = tx * speed;
    const projVelocityY = ty * speed;

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);

    let projX = player.x;
    let projY = player.y;
    for (let i = 0; i < 10; i++) {
      projX += projVelocityX * 2;
      projY += projVelocityY * 2;
      ctx.lineTo(projX, projY);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw timer
  if (gameState === GAME_STATES.PLAYING) {
    const remainingTime = checkTimeLimit();
    const seconds = Math.max(0, Math.floor(remainingTime / 1000));

    // Timer background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(canvas.clientWidth / 2 - 60, 20, 120, 40);

    // Timer text
    ctx.fillStyle = seconds < 10 ? '#ff0000' : '#fff';
    ctx.font = `bold ${24}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(`${seconds}s`, canvas.clientWidth / 2, 45);

    // Time dilation indicator
    if (timeDilationFactor > 1.0) {
      ctx.fillStyle = '#ff00ff';
      ctx.font = `bold ${14}px Arial`;
      ctx.fillText(`TIME x${timeDilationFactor}`, canvas.clientWidth / 2, 75);
    }

    // Challenge counter
    // ctx.fillStyle = "#fff";
    // ctx.font = `bold ${18}px Arial`;
    // ctx.textAlign = "left";
    // ctx.fillText(`Challenge: ${challengesCompleted + 1}`, 20, 40);
  }
}

// Optimized game loop with deltaTime
function gameLoop(currentTime) {
  if (!lastFrameTime) lastFrameTime = currentTime;

  deltaTime = currentTime - lastFrameTime;

  // Only update if enough time has passed (throttle to 60 FPS)
  if (deltaTime >= frameDelay) {
    update(deltaTime / 16.67); // Normalize deltaTime
    render();
    lastFrameTime = currentTime - (deltaTime % frameDelay);
  }

  requestAnimationFrame(gameLoop);
}

// Touch and click handlers
function handleInteraction(event) {
  event.preventDefault();

  // Always try to initialize audio on any interaction
  if (!audioInitialized) {
    initAudioOnInteraction();
  }

  if (gameState === GAME_STATES.START_SCREEN) {
    // Check if clicked on start button
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (event.type === 'touchstart' && event.touches) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const scale = Math.min(canvas.clientWidth, canvas.clientHeight) / 600;
    const buttonWidth = 200 * scale;
    const buttonHeight = 50 * scale;
    const buttonX = canvas.clientWidth / 2 - buttonWidth / 2;
    const buttonY = canvas.clientHeight * 0.8; // Updated button position

    if (
      x > buttonX &&
      x < buttonX + buttonWidth &&
      y > buttonY &&
      y < buttonY + buttonHeight
    ) {
      initGame();
    }
  } else if (gameState === GAME_STATES.PLAYING) {
    releaseFromOrbit();
  }
}

// Event listeners
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', handleInteraction, { passive: false });

// Restart button handler
// Replace the restart button handler with touch support:
// Update restart button handlers to immediately hide the game message
restartButton.addEventListener('click', function (e) {
  e.stopPropagation();
  e.preventDefault();

  // Immediately hide the game message
  gameMessage.classList.remove('visible');
  if (gameMessage.timeoutId) {
    clearTimeout(gameMessage.timeoutId);
    gameMessage.timeoutId = null;
  }

  // Reset game state
  gameState = GAME_STATES.START_SCREEN;
  restartButton.style.display = 'none';

  // Reset player state
  player.currentOrbit = null;
  player.velocity = { x: 0, y: 0 };
  player.trail = [];

  // Clear game objects
  planets.length = 0;
  spaceDebris.length = 0;
  wormhole = null;

  // Regenerate starfield for start screen
  generateStarfield();

  // Force a render of the start screen
  render();
});

// Add touch event for mobile
restartButton.addEventListener(
  'touchstart',
  function (e) {
    e.stopPropagation();
    e.preventDefault();

    // Immediately hide the game message
    gameMessage.classList.remove('visible');
    if (gameMessage.timeoutId) {
      clearTimeout(gameMessage.timeoutId);
      gameMessage.timeoutId = null;
    }

    // Reset game state
    gameState = GAME_STATES.START_SCREEN;
    restartButton.style.display = 'none';

    // Reset player state
    player.currentOrbit = null;
    player.velocity = { x: 0, y: 0 };
    player.trail = [];

    // Clear game objects
    planets.length = 0;
    spaceDebris.length = 0;
    wormhole = null;

    // Regenerate starfield for start screen
    generateStarfield();

    // Force a render of the start screen
    render();
  },
  { passive: false }
);

// Handle device orientation change and window resize
function handleResize() {
  const oldWidth = canvas.clientWidth;
  const oldHeight = canvas.clientHeight;

  setupCanvas();

  if (gameState === GAME_STATES.PLAYING) {
    const widthRatio = canvas.clientWidth / oldWidth;
    const heightRatio = canvas.clientHeight / oldHeight;

    for (const planet of planets) {
      planet.x *= widthRatio;
      planet.y *= heightRatio;
    }
  }
}

window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', function () {
  setTimeout(handleResize, 100);
});

// Initialize and start the game
window.addEventListener('load', function () {
  generateStarfield();
  requestAnimationFrame(gameLoop);
});

// Start immediately for Codepen
if (document.readyState === 'complete') {
  generateStarfield();
  requestAnimationFrame(gameLoop);
}
