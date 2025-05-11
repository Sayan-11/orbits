// Game states
export const GAME_STATES = {
  START_SCREEN: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameover'
};

// Planet types
export const PLANET_TYPES = {
  NORMAL: {
    color: "#3498db",
    orbitColor: "rgba(52, 152, 219, 0.3)",
    mass: 1.0,
    orbitSpeedMultiplier: 1.0,
    gravitationalConstant: 500
  },
  NEUTRON: {
    color: "#f5f5f5",
    orbitColor: "rgba(255, 255, 255, 0.5)",
    mass: 3.0,
    orbitSpeedMultiplier: 2.5,
    gravitationalConstant: 800
  },
  BLACK_HOLE: {
    color: "#111",
    orbitColor: "rgba(75, 0, 130, 0.3)",
    mass: 5.0,
    orbitSpeedMultiplier: 1.8,
    gravitationalConstant: 1200,
    timeDilation: 1.5
  }
};

// Game configuration values
export const CHALLENGE_TIME_LIMIT = 90000; // 90 seconds
export const TARGET_FPS = 60;
export const FRAME_DELAY = 1000 / TARGET_FPS; 