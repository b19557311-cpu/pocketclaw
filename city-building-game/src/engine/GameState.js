import { TERRAIN_TYPES, BUILDING_TYPES, BUILDING_STATS } from './types';

export class GameState {
  constructor(gridWidth = 50, gridHeight = 50) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.grid = this.initializeGrid();
    this.buildings = [];
    this.buildingId = 0;

    // Game resources
    this.money = 10000;
    this.population = 0;
    this.happiness = 50;
    this.time = 0;
    this.ticksPerSecond = 1;

    // Utilities
    this.powerProduction = 0;
    this.powerConsumption = 0;
    this.waterProduction = 0;
    this.waterConsumption = 0;

    // History tracking
    this.happinessHistory = [50];
    this.populationHistory = [0];
  }

  initializeGrid() {
    const grid = [];
    for (let y = 0; y < this.gridHeight; y++) {
      const row = [];
      for (let x = 0; x < this.gridWidth; x++) {
        row.push({
          x,
          y,
          terrain: TERRAIN_TYPES.GRASS,
          buildingId: null,
          utilities: { power: false, water: false, road: false },
        });
      }
      grid.push(row);
    }
    return grid;
  }

  getCell(x, y) {
    if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return null;
    return this.grid[y][x];
  }

  placeBuilding(x, y, buildingType) {
    const stats = BUILDING_STATS[buildingType];
    if (!stats) return { success: false, error: 'Invalid building type' };

    // Check cost
    if (this.money < stats.cost) {
      return { success: false, error: 'Insufficient funds' };
    }

    // Check space
    for (let dy = 0; dy < stats.height; dy++) {
      for (let dx = 0; dx < stats.width; dx++) {
        const cell = this.getCell(x + dx, y + dy);
        if (!cell || cell.buildingId !== null) {
          return { success: false, error: 'Space unavailable' };
        }
      }
    }

    // Place building
    const buildingId = this.buildingId++;
    const building = {
      id: buildingId,
      type: buildingType,
      x,
      y,
      width: stats.width,
      height: stats.height,
      powerConnected: false,
      waterConnected: false,
      residents: buildingType === BUILDING_TYPES.RESIDENTIAL ? Math.floor(Math.random() * 20) : 0,
    };

    for (let dy = 0; dy < stats.height; dy++) {
      for (let dx = 0; dx < stats.width; dx++) {
        const cell = this.getCell(x + dx, y + dy);
        if (cell) cell.buildingId = buildingId;
      }
    }

    this.buildings.push(building);
    this.money -= stats.cost;

    return { success: true, building };
  }

  removeBuilding(buildingId) {
    const building = this.buildings.find(b => b.id === buildingId);
    if (!building) return { success: false, error: 'Building not found' };

    // Refund partial cost (50%)
    const stats = BUILDING_STATS[building.type];
    this.money += Math.floor(stats.cost * 0.5);

    // Clear grid cells
    for (let dy = 0; dy < building.height; dy++) {
      for (let dx = 0; dx < building.width; dx++) {
        const cell = this.getCell(building.x + dx, building.y + dy);
        if (cell) cell.buildingId = null;
      }
    }

    this.buildings = this.buildings.filter(b => b.id !== buildingId);
    return { success: true };
  }

  update() {
    this.time += 1 / this.ticksPerSecond;

    // Recalculate utilities
    this.recalculateUtilities();

    // Update population and happiness
    this.updatePopulation();
    this.updateHappiness();

    // Track history
    this.happinessHistory.push(this.happiness);
    this.populationHistory.push(this.population);

    // Keep history size manageable
    if (this.happinessHistory.length > 1000) {
      this.happinessHistory.shift();
      this.populationHistory.shift();
    }
  }

  recalculateUtilities() {
    // Reset utilities
    this.powerProduction = 0;
    this.powerConsumption = 0;
    this.waterProduction = 0;
    this.waterConsumption = 0;

    // Reset all utilities on grid
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        this.grid[y][x].utilities = { power: false, water: false, road: false };
      }
    }

    // Calculate production
    this.buildings.forEach(building => {
      const stats = BUILDING_STATS[building.type];
      if (stats.power > 0) {
        this.powerProduction += stats.power;
      } else {
        this.powerConsumption += Math.abs(stats.power);
      }
    });

    // Connect utilities via breadth-first search
    this.distributeUtilities();
  }

  distributeUtilities() {
    // Find all utility sources
    const powerSources = this.buildings.filter(b => BUILDING_STATS[b.type].power > 0);
    const waterSources = this.buildings.filter(b => b.type === BUILDING_TYPES.WATER_PUMP);
    const roads = this.buildings.filter(b => b.type === BUILDING_TYPES.ROAD);

    // Mark roads on grid
    roads.forEach(road => {
      const cell = this.getCell(road.x, road.y);
      if (cell) cell.utilities.road = true;
    });

    // Distribute power
    const connected = new Set();
    powerSources.forEach(source => {
      this.bfsUtility(source, 'power', connected);
    });

    // Distribute water
    waterSources.forEach(source => {
      this.bfsUtility(source, 'water', new Set());
    });

    // Mark connected buildings
    this.buildings.forEach(building => {
      const cell = this.getCell(building.x, building.y);
      if (cell) {
        building.powerConnected = cell.utilities.power;
        building.waterConnected = cell.utilities.water;
      }
    });
  }

  bfsUtility(source, utilityType, visited) {
    const queue = [[source.x, source.y]];
    const localVisited = new Set();
    const maxDistance = 15;

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const key = `${x},${y}`;

      if (localVisited.has(key)) continue;
      localVisited.add(key);

      const cell = this.getCell(x, y);
      if (!cell) continue;

      cell.utilities[utilityType] = true;

      // Check adjacent cells
      const distance = Math.abs(x - source.x) + Math.abs(y - source.y);
      if (distance < maxDistance) {
        for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const nx = x + dx;
          const ny = y + dy;
          const nkey = `${nx},${ny}`;
          if (!localVisited.has(nkey)) {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  updatePopulation() {
    let totalPopulation = 0;
    this.buildings.forEach(building => {
      if (building.type === BUILDING_TYPES.RESIDENTIAL && building.powerConnected && building.waterConnected) {
        // Growth based on happiness
        const growthRate = 1 + (this.happiness - 50) * 0.01;
        building.residents = Math.max(0, Math.floor(building.residents * growthRate));
        totalPopulation += building.residents;
      }
    });
    this.population = totalPopulation;
  }

  updateHappiness() {
    if (this.population === 0) {
      this.happiness = 50;
      return;
    }

    let totalHappiness = 0;
    let happinessFactor = 0;

    // Base happiness from buildings
    this.buildings.forEach(building => {
      if (building.type === BUILDING_TYPES.RESIDENTIAL) {
        const stats = BUILDING_STATS[building.type];
        let buildingHappiness = stats.happiness;

        // Utilities affect happiness
        if (!building.powerConnected) buildingHappiness -= 15;
        if (!building.waterConnected) buildingHappiness -= 20;

        // Pollution from industry
        const nearbyIndustry = this.buildings.filter(b =>
          b.type === BUILDING_TYPES.INDUSTRIAL &&
          Math.abs(b.x - building.x) < 8 &&
          Math.abs(b.y - building.y) < 8
        ).length;
        buildingHappiness -= nearbyIndustry * 5;

        totalHappiness += buildingHappiness * building.residents;
        happinessFactor += building.residents;
      }
    });

    // Parks help happiness
    this.buildings.forEach(building => {
      if (building.type === BUILDING_TYPES.PARK) {
        const nearbyResidential = this.buildings.filter(b =>
          b.type === BUILDING_TYPES.RESIDENTIAL &&
          Math.abs(b.x - building.x) < 6 &&
          Math.abs(b.y - building.y) < 6
        );
        nearbyResidential.forEach(res => {
          totalHappiness += BUILDING_STATS.park.happiness * res.residents * 0.1;
        });
      }
    });

    if (happinessFactor > 0) {
      this.happiness = Math.max(0, Math.min(100, totalHappiness / happinessFactor));
    }
  }

  getBuildingAt(x, y) {
    const cell = this.getCell(x, y);
    if (!cell || cell.buildingId === null) return null;
    return this.buildings.find(b => b.id === cell.buildingId);
  }

  getStats() {
    return {
      money: this.money,
      population: this.population,
      happiness: Math.round(this.happiness),
      powerBalance: this.powerProduction - this.powerConsumption,
      time: this.time,
    };
  }
}
