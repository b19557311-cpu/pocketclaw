import { TERRAIN_TYPES } from './types';

export class TerrainGenerator {
  static generatePerlin2D(width, height, scale = 1, seed = 0) {
    const noise = Array(height)
      .fill(0)
      .map(() => Array(width).fill(0));

    // Simple noise generation using sine/cosine
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / scale;
        const ny = y / scale;
        const value =
          Math.sin(nx + seed) * Math.cos(ny + seed) +
          Math.sin(nx * 0.5 + seed) * Math.cos(ny * 0.5 + seed) * 0.5;
        noise[y][x] = (value + 2) / 4; // Normalize to 0-1
      }
    }
    return noise;
  }

  static generateTerrain(grid, gridWidth, gridHeight, waterLevel = 0.4) {
    const noise = this.generatePerlin2D(gridWidth, gridHeight, 20);

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const value = noise[y][x];

        if (value < waterLevel) {
          grid[y][x].terrain = TERRAIN_TYPES.WATER;
        } else if (value < waterLevel + 0.1) {
          grid[y][x].terrain = TERRAIN_TYPES.STONE;
        } else {
          grid[y][x].terrain = TERRAIN_TYPES.GRASS;
        }
      }
    }
  }

  static clearTerrain(grid, gridWidth, gridHeight) {
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        grid[y][x].terrain = TERRAIN_TYPES.GRASS;
      }
    }
  }
}

export class ZoneManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.zones = [];
    this.nextZoneId = 0;
  }

  createZone(x, y, width, height, type) {
    const zone = {
      id: this.nextZoneId++,
      x,
      y,
      width,
      height,
      type,
      buildings: [],
    };
    this.zones.push(zone);
    return zone;
  }

  getZoneAt(x, y) {
    return this.zones.find(
      zone =>
        x >= zone.x &&
        x < zone.x + zone.width &&
        y >= zone.y &&
        y < zone.y + zone.height
    );
  }

  addBuildingToZone(buildingId, zoneId) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone && !zone.buildings.includes(buildingId)) {
      zone.buildings.push(buildingId);
    }
  }

  getZoneStats(zoneId) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (!zone) return null;

    const buildings = zone.buildings.map(id =>
      this.gameState.buildings.find(b => b.id === id)
    );

    return {
      zoneId: zone.id,
      type: zone.type,
      buildingCount: buildings.length,
      population: buildings.reduce((sum, b) => sum + (b?.residents || 0), 0),
      area: zone.width * zone.height,
    };
  }

  removeZone(zoneId) {
    this.zones = this.zones.filter(z => z.id !== zoneId);
  }
}
