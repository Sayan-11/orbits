import { PLANET_TYPES } from './constants.js';

// Generate starfield
export function generateStarfield(canvas, starfield) {
  starfield.length = 0;
  const starCount = window.innerWidth < 768 ? 50 : 100;
  for (let i = 0; i < starCount; i++) {
    starfield.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      brightness: Math.random() * 0.8 + 0.2
    });
  }
}

// Generate space debris
export function generateSpaceDebris(canvas, planets, scale) {
  const debrisCount = 20;
  for (let i = 0; i < debrisCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = (Math.random() * 3 + 1) * scale;
    const speed = Math.random() * 0.5 + 0.1;
    const angle = Math.random() * Math.PI * 2;
    spaceDebris.push({
      x,
      y,
      size,
      speed,
      angle,
      color: 'rgba(255, 255, 255, 0.5)'
    });
  }
}

// Update space debris
export function updateSpaceDebris(spaceDebris, planets, dt) {
  for (const debris of spaceDebris) {
    debris.x += Math.cos(debris.angle) * debris.speed * dt;
    debris.y += Math.sin(debris.angle) * debris.speed * dt;
    // Wrap around screen
    if (debris.x < 0) debris.x = canvas.width;
    if (debris.x > canvas.width) debris.x = 0;
    if (debris.y < 0) debris.y = canvas.height;
    if (debris.y > canvas.height) debris.y = 0;
  }
}

// Update wormhole
export function updateWormhole(wormhole, dt) {
  if (wormhole) {
    wormhole.rotation += 0.02 * dt;
    wormhole.pulsePhase += 0.05 * dt;
  }
}

// Vibrate device
export function vibrate(pattern) {
  if (navigator && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Vibration not supported or failed
    }
  }
}

// Calculate time dilation
export function calculateTimeDilation(player, planets) {
  let timeDilationFactor = 1.0;
  for (const planet of planets) {
    if (planet.type === PLANET_TYPES.BLACK_HOLE) {
      const dx = player.x - planet.x;
      const dy = player.y - planet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < planet.gravityRange * 1.5) {
        timeDilationFactor = planet.type.timeDilation;
        break;
      }
    }
  }
  return timeDilationFactor;
} 