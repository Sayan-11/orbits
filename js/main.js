import { GAME_STATES, PLANET_TYPES, CHALLENGE_TIME_LIMIT, TARGET_FPS, FRAME_DELAY } from './constants.js';
import { player, updatePlayerOrbitPosition, releaseFromOrbit, updateTrail, checkPlanetCapture, checkOutOfBounds } from './player.js';
import { planets, wormhole, hasBlackHole, generatePlanets, generateWormhole, updateBinaryOrbits } from './planets.js';
import { initAudio, initAudioOnInteraction, updateCelestialSounds, audioInitialized, audioSources } from './audio.js';
import { gameMessage, restartButton, showMessage, drawStartScreen, handleStartButtonClick } from './ui.js';
import { generateStarfield, generateSpaceDebris, updateSpaceDebris, updateWormhole, vibrate, calculateTimeDilation } from './utils.js';

// Game state variables
let gameState = GAME_STATES.START_SCREEN;
let challengeStartTime = 0;
let timeDilationFactor = 1.0;
let challengesCompleted = 0;
let lastFrameTime = 0;
let deltaTime = 0;

// Game objects
const starfield = [];
const spaceDebris = [];
let pixelRatio = window.devicePixelRatio || 1;

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Logo for start screen
const logoImage = new Image();
logoImage.src = 'https://ik.imagekit.io/ciuzeltsf/orbits.png?updatedAt=1746884585959';

// Setup canvas
function setupCanvas() {
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(pixelRatio, pixelRatio);
}

// Initialize game
function initGame() {
  gameState = GAME_STATES.PLAYING;
  challengesCompleted = 0;
  gameMessage.classList.remove("visible");
  restartButton.style.display = "none";
  startNewChallenge();
}

// Start new challenge
function startNewChallenge() {
  planets.length = 0;
  spaceDebris.length = 0;
  player.trail.length = 0;
  wormhole = null;
  hasBlackHole = false;
  challengeStartTime = Date.now();
  timeDilationFactor = 1.0;
  generateStarfield(canvas, starfield);
  generatePlanets(canvas);
  generateSpaceDebris(canvas, planets, Math.min(canvas.clientWidth, canvas.clientHeight) / 600);
  generateWormhole(canvas);
  attachToOrbit(planets[0]);
  showMessage("Reach the wormhole!", 2000);
}

// Attach player to orbit
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

// Check collisions
function checkCollisions() {
  if (player.currentOrbit) return;
  for (const planet of planets) {
    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < planet.radius + player.radius) {
      attachToOrbit(planet);
      break;
    }
  }
  if (wormhole) {
    const dx = player.x - wormhole.x;
    const dy = player.y - wormhole.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < wormhole.radius + player.radius) {
      challengeComplete();
    }
  }
}

// Check time limit
function checkTimeLimit() {
  const elapsedTime = (Date.now() - challengeStartTime) * timeDilationFactor;
  const remainingTime = CHALLENGE_TIME_LIMIT - elapsedTime;
  if (remainingTime <= 0) {
    endGame();
  }
  return remainingTime;
}

// Complete challenge
function challengeComplete() {
  challengesCompleted++;
  showMessage("Wormhole reached!", 1500);
  vibrate([50]);
  setTimeout(() => {
    gameMessage.classList.remove("visible");
    startNewChallenge();
  }, 1500);
}

// End game
function endGame() {
  gameState = GAME_STATES.GAME_OVER;
  showMessage("Game Over!", 2000);
  setTimeout(() => {
    restartButton.style.display = "block";
  }, 500);
  vibrate([200]);
}

// Update game state
function update(dt) {
  if (gameState !== GAME_STATES.PLAYING) return;
  timeDilationFactor = calculateTimeDilation(player, planets);
  const remainingTime = checkTimeLimit();
  if (remainingTime <= 0) return;
  if (player.currentOrbit) {
    player.angle += player.currentOrbit.orbitSpeed * dt;
    updatePlayerOrbitPosition();
  } else {
    player.x += player.velocity.x * dt;
    player.y += player.velocity.y * dt;
    if (!checkPlanetCapture(planets) && checkOutOfBounds(canvas, pixelRatio)) {
      endGame();
    }
  }
  updateTrail();
  updateSpaceDebris(spaceDebris, planets, dt);
  updateWormhole(wormhole, dt);
  updateBinaryOrbits(dt);
  checkCollisions();
  updateCelestialSounds(player, planets);
}

// Render function
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of starfield) {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const debris of spaceDebris) {
    ctx.fillStyle = debris.color;
    ctx.beginPath();
    ctx.arc(debris.x, debris.y, debris.size, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const planet of planets) {
    ctx.fillStyle = planet.type.color;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = planet.type.orbitColor;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.orbitRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (wormhole) {
    ctx.save();
    ctx.translate(wormhole.x, wormhole.y);
    ctx.rotate(wormhole.rotation);
    ctx.fillStyle = 'rgba(75, 0, 130, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, wormhole.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  for (const point of player.trail) {
    ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, player.radius / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();
}

// Game loop
function gameLoop(currentTime) {
  if (!lastFrameTime) lastFrameTime = currentTime;
  deltaTime = currentTime - lastFrameTime;
  if (deltaTime >= FRAME_DELAY) {
    update(deltaTime / 16.67);
    render();
    lastFrameTime = currentTime - (deltaTime % FRAME_DELAY);
  }
  requestAnimationFrame(gameLoop);
}

// Handle user interaction
function handleInteraction(event) {
  event.preventDefault();
  if (!audioInitialized) {
    initAudioOnInteraction();
  }
  if (gameState === GAME_STATES.START_SCREEN) {
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
    handleStartButtonClick(x, y, canvas, initGame);
  } else if (gameState === GAME_STATES.PLAYING) {
    releaseFromOrbit();
  }
}

document.addEventListener("click", handleInteraction);
document.addEventListener("touchstart", handleInteraction, { passive: false });

// Restart button handler
restartButton.addEventListener("click", function(e) {
  e.stopPropagation();
  e.preventDefault();
  gameMessage.classList.remove("visible");
  gameState = GAME_STATES.START_SCREEN;
  restartButton.style.display = "none";
  player.currentOrbit = null;
  player.velocity = { x: 0, y: 0 };
  player.trail = [];
  planets.length = 0;
  spaceDebris.length = 0;
  wormhole = null;
  generateStarfield(canvas, starfield);
  render();
});

// Handle resize
function handleResize() {
  setupCanvas();
  generateStarfield(canvas, starfield);
  render();
}

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", function() {
  setTimeout(handleResize, 100);
});

// Initialize and start the game
window.addEventListener("load", function() {
  generateStarfield(canvas, starfield);
  requestAnimationFrame(gameLoop);
});

// Start immediately for Codepen
if (document.readyState === "complete") {
  generateStarfield(canvas, starfield);
  requestAnimationFrame(gameLoop);
} 