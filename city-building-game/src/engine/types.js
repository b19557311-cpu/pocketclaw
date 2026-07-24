// Core game type definitions

export const TERRAIN_TYPES = {
  GRASS: 'grass',
  WATER: 'water',
  STONE: 'stone',
};

export const BUILDING_TYPES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  INDUSTRIAL: 'industrial',
  POWER_PLANT: 'power_plant',
  WATER_PUMP: 'water_pump',
  ROAD: 'road',
  PARK: 'park',
};

export const BUILDING_STATS = {
  residential: { width: 2, height: 2, cost: 100, power: 10, happiness: 20 },
  commercial: { width: 2, height: 2, cost: 150, power: 15, happiness: 15 },
  industrial: { width: 3, height: 3, cost: 200, power: 30, happiness: -10 },
  power_plant: { width: 2, height: 2, cost: 300, power: -50, happiness: -5 },
  water_pump: { width: 1, height: 1, cost: 100, power: 5, happiness: 0 },
  road: { width: 1, height: 1, cost: 25, power: 0, happiness: 5 },
  park: { width: 2, height: 2, cost: 50, power: 0, happiness: 25 },
};

export const UTILITY_TYPES = {
  POWER: 'power',
  WATER: 'water',
  ROAD: 'road',
};
