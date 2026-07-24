// Game configuration and constants
// Adjust these values to change game difficulty and balance

export const GAME_CONFIG = {
  // Grid settings
  GRID: {
    DEFAULT_WIDTH: 50,
    DEFAULT_HEIGHT: 50,
    MIN_SIZE: 20,
    MAX_SIZE: 100,
  },

  // Game loop settings
  SIMULATION: {
    DEFAULT_TPS: 1, // Ticks per second
    MIN_TPS: 0.5,
    MAX_TPS: 5,
  },

  // Starting resources
  ECONOMY: {
    STARTING_MONEY: 10000,
    DEMOLISH_REFUND_PERCENT: 50,
  },

  // Utility settings
  UTILITIES: {
    POWER: {
      PLANT_PRODUCTION: 50,
      DISTRIBUTION_RANGE: 15,
      RESIDENTIAL_CONSUMPTION: 5,
      COMMERCIAL_CONSUMPTION: 15,
      INDUSTRIAL_CONSUMPTION: 30,
      PUMP_CONSUMPTION: 5,
    },
    WATER: {
      PUMP_PRODUCTION: 20,
      DISTRIBUTION_RANGE: 15,
      RESIDENTIAL_CONSUMPTION: 3,
      COMMERCIAL_CONSUMPTION: 5,
      INDUSTRIAL_CONSUMPTION: 10,
    },
  },

  // Population settings
  POPULATION: {
    MAX_PER_RESIDENTIAL: 50,
    BASE_GROWTH_RATE: 0.01,
    HAPPINESS_GROWTH_FACTOR: 0.01,
    BASE_DEATH_RATE: 0.005,
    MAX_DEATH_RATE: 0.02,
  },

  // Happiness settings
  HAPPINESS: {
    INITIAL: 50,
    MIN: 0,
    MAX: 100,
    RESIDENTIAL_BASE: 20,
    PARK_BONUS: 25,
    ROAD_BONUS: 5,
    NO_POWER_PENALTY: -15,
    NO_WATER_PENALTY: -20,
    INDUSTRIAL_POLLUTION: -5, // Per industrial building nearby
    INDUSTRIAL_POLLUTION_RANGE: 8,
  },

  // Difficulty modifiers
  DIFFICULTY: {
    EASY: {
      startingMoney: 15000,
      buildCostMultiplier: 0.7,
      happinessDecayRate: 0.5,
    },
    NORMAL: {
      startingMoney: 10000,
      buildCostMultiplier: 1.0,
      happinessDecayRate: 1.0,
    },
    HARD: {
      startingMoney: 5000,
      buildCostMultiplier: 1.5,
      happinessDecayRate: 1.5,
    },
  },

  // Building limits (optional)
  BUILDING_LIMITS: {
    POWER_PLANT_MAX: 10,
    WATER_PUMP_MAX: 15,
    INDUSTRIAL_MAX: 20,
  },

  // UI settings
  UI: {
    TILE_SIZE: 32,
    GRID_COLOR: '#4b5563',
    SHOW_GRID: true,
    SHOW_UTILITIES: true,
  },

  // Performance settings
  PERFORMANCE: {
    MAX_BUILDINGS: 1000,
    BATCH_SIZE: 50,
    USE_CANVAS_CACHE: true,
  },

  // Feature flags
  FEATURES: {
    TERRAIN_GENERATION: false, // Not fully integrated yet
    ZONES: false, // Zone system planned
    TRADING: false, // Trading between cities planned
    DISASTERS: false, // Natural disasters planned
    ACHIEVEMENTS: false, // Achievement system planned
    TUTORIALS: true,
    ADVANCED_STATS: true,
  },
};

export function getDifficultyConfig(difficulty = 'NORMAL') {
  return GAME_CONFIG.DIFFICULTY[difficulty] || GAME_CONFIG.DIFFICULTY.NORMAL;
}

export function validateConfig(config) {
  const errors = [];

  if (config.GRID.DEFAULT_WIDTH < config.GRID.MIN_SIZE) {
    errors.push('Grid width must be at least MIN_SIZE');
  }
  if (config.GRID.DEFAULT_HEIGHT < config.GRID.MIN_SIZE) {
    errors.push('Grid height must be at least MIN_SIZE');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Export convenience functions
export const Config = {
  getGridSize: () => ({
    width: GAME_CONFIG.GRID.DEFAULT_WIDTH,
    height: GAME_CONFIG.GRID.DEFAULT_HEIGHT,
  }),

  getStartingMoney: (difficulty = 'NORMAL') =>
    getDifficultyConfig(difficulty).startingMoney,

  getPowerPlantProduction: () => GAME_CONFIG.UTILITIES.POWER.PLANT_PRODUCTION,

  getResidentialCapacity: () => GAME_CONFIG.POPULATION.MAX_PER_RESIDENTIAL,

  getHappinessModifier: (factor) => GAME_CONFIG.HAPPINESS[factor] || 0,
};
