import { audioSources, audioInitialized } from './audio.js';

// Player object
export const player = {
  x: 0,
  y: 0,
  radius: 4,
  velocity: { x: 0, y: 0 },
  currentOrbit: null,
  angle: 0,
  color: "#fff",
  trail: []
};

// Update player position in orbit
export function updatePlayerOrbitPosition() {
  if (player.currentOrbit) {
    player.x = player.currentOrbit.x + Math.cos(player.angle) * player.currentOrbit.orbitRadius;
    player.y = player.currentOrbit.y + Math.sin(player.angle) * player.currentOrbit.orbitRadius;
  }
}

// Release player from current orbit
export function releaseFromOrbit() {
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
    
    // Play launch sound
    if (audioInitialized && audioSources.launchSound) {
      audioSources.launchSound();
    }
  }
}

// Update player trail
export function updateTrail() {
  // Reduce trail frequency on mobile
  const trailThreshold = window.innerWidth < 768 ? 10 : 5;
  
  if (player.trail.length === 0 || 
      Math.abs(player.x - player.trail[player.trail.length-1].x) > trailThreshold ||
      Math.abs(player.y - player.trail[player.trail.length-1].y) > trailThreshold) {
    player.trail.push({x: player.x, y: player.y, alpha: 1.0});
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

// Check if player is captured by a planet
export function checkPlanetCapture(planets) {
  for (const planet of planets) {
    if (planet === player.currentOrbit) continue;

    const dx = player.x - planet.x;
    const dy = player.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < planet.radius + player.radius) {
      return true; // Collision detected
    }

    if (distance < planet.gravityRange && distance > planet.orbitRadius * 0.8) {
      const dotProduct = dx * player.velocity.x + dy * player.velocity.y;

      if (dotProduct < 0) {
        return true; // Capture detected
      }
    }
  }
  return false;
}

// Check if player is out of bounds
export function checkOutOfBounds(canvas, pixelRatio) {
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