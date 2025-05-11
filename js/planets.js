import { PLANET_TYPES } from './constants.js';

// Planet arrays and objects
export const planets = [];
export let wormhole = null;
export let hasBlackHole = false;

// Generate planets for the current challenge
export function generatePlanets(canvas) {
  const screenSize = Math.min(canvas.clientWidth, canvas.clientHeight);
  const scale = screenSize / 600;

  // Binary systems appear early and frequently
  const isBinarySystem = Math.random() > 0.4;
  const isMultipleNeutrons = challengesCompleted > 0 && Math.random() > 0.7;
  
  if (isBinarySystem) {
    createBinarySystem(scale, canvas);
  } else if (isMultipleNeutrons) {
    createMultiNeutronSystem(scale, canvas);
  } else {
    createRegularSystem(scale, canvas);
  }
}

// Create a binary star system
export function createBinarySystem(scale, canvas) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const binaryDistance = 100 * scale;
  
  // Create first star
  const star1 = {
    x: centerX - binaryDistance / 2,
    y: centerY,
    radius: 20 * scale,
    type: PLANET_TYPES.NORMAL,
    orbitRadius: 40 * scale,
    orbitSpeed: 0.02,
    gravityRange: 150 * scale
  };
  
  // Create second star
  const star2 = {
    x: centerX + binaryDistance / 2,
    y: centerY,
    radius: 20 * scale,
    type: PLANET_TYPES.NORMAL,
    orbitRadius: 40 * scale,
    orbitSpeed: 0.02,
    gravityRange: 150 * scale
  };
  
  planets.push(star1, star2);
  
  // Add orbiting planets
  for (let i = 0; i < 3; i++) {
    addRegularPlanet(scale, 200 * scale, canvas);
  }
}

// Create a system with multiple neutron stars
export function createMultiNeutronSystem(scale, canvas) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Create neutron stars in a triangle formation
  const neutron1 = {
    x: centerX,
    y: centerY - 100 * scale,
    radius: 15 * scale,
    type: PLANET_TYPES.NEUTRON,
    orbitRadius: 30 * scale,
    orbitSpeed: 0.03,
    gravityRange: 120 * scale
  };
  
  const neutron2 = {
    x: centerX - 100 * scale,
    y: centerY + 50 * scale,
    radius: 15 * scale,
    type: PLANET_TYPES.NEUTRON,
    orbitRadius: 30 * scale,
    orbitSpeed: 0.03,
    gravityRange: 120 * scale
  };
  
  const neutron3 = {
    x: centerX + 100 * scale,
    y: centerY + 50 * scale,
    radius: 15 * scale,
    type: PLANET_TYPES.NEUTRON,
    orbitRadius: 30 * scale,
    orbitSpeed: 0.03,
    gravityRange: 120 * scale
  };
  
  planets.push(neutron1, neutron2, neutron3);
  
  // Add regular planets
  for (let i = 0; i < 2; i++) {
    addRegularPlanet(scale, 200 * scale, canvas);
  }
}

// Create a regular planetary system
export function createRegularSystem(scale, canvas) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // Create central star
  const centralStar = {
    x: centerX,
    y: centerY,
    radius: 25 * scale,
    type: PLANET_TYPES.NORMAL,
    orbitRadius: 50 * scale,
    orbitSpeed: 0.01,
    gravityRange: 180 * scale
  };
  
  planets.push(centralStar);
  
  // Add orbiting planets
  for (let i = 0; i < 4; i++) {
    addRegularPlanet(scale, 150 * scale, canvas);
  }
}

// Add a regular planet to the system
export function addRegularPlanet(scale, minDistance, canvas) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  let x, y, distance;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  } while (distance < minDistance);
  
  const planet = {
    x,
    y,
    radius: (10 + Math.random() * 10) * scale,
    type: PLANET_TYPES.NORMAL,
    orbitRadius: (30 + Math.random() * 20) * scale,
    orbitSpeed: (0.01 + Math.random() * 0.02),
    gravityRange: (80 + Math.random() * 40) * scale
  };
  
  planets.push(planet);
}

// Generate wormhole
export function generateWormhole(canvas) {
  const screenSize = Math.min(canvas.clientWidth, canvas.clientHeight);
  const scale = screenSize / 600;
  
  // Place wormhole far from center
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.min(canvas.width, canvas.height) * 0.4;
  
  wormhole = {
    x: canvas.width / 2 + Math.cos(angle) * distance,
    y: canvas.height / 2 + Math.sin(angle) * distance,
    radius: 15 * scale,
    rotation: 0,
    pulsePhase: 0
  };
}

// Update binary orbits
export function updateBinaryOrbits(dt) {
  for (const planet of planets) {
    if (planet.binaryCenter) {
      planet.binaryOffset += 0.01 * dt;
      planet.x = planet.binaryCenter.x + Math.cos(planet.binaryOffset) * planet.binaryOrbitRadius;
      planet.y = planet.binaryCenter.y + Math.sin(planet.binaryOffset) * planet.binaryOrbitRadius;
    }
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