import { BUILDING_TYPES } from './types';

export class UtilitySystem {
  static calculatePowerConsumption(gameState) {
    let consumption = 0;

    gameState.buildings.forEach(building => {
      switch (building.type) {
        case BUILDING_TYPES.RESIDENTIAL:
          consumption += 5 * (building.residents / 10 + 1);
          break;
        case BUILDING_TYPES.COMMERCIAL:
          consumption += 15;
          break;
        case BUILDING_TYPES.INDUSTRIAL:
          consumption += 30;
          break;
        case BUILDING_TYPES.WATER_PUMP:
          consumption += 5;
          break;
        default:
          break;
      }
    });

    return Math.round(consumption);
  }

  static calculatePowerProduction(gameState) {
    let production = 0;

    gameState.buildings.forEach(building => {
      if (building.type === BUILDING_TYPES.POWER_PLANT) {
        production += 50;
      }
    });

    return production;
  }

  static calculateWaterConsumption(gameState) {
    let consumption = 0;

    gameState.buildings.forEach(building => {
      if (building.type === BUILDING_TYPES.RESIDENTIAL) {
        consumption += 3 * (building.residents / 10 + 1);
      } else if (building.type === BUILDING_TYPES.COMMERCIAL) {
        consumption += 5;
      } else if (building.type === BUILDING_TYPES.INDUSTRIAL) {
        consumption += 10;
      }
    });

    return Math.round(consumption);
  }

  static calculateWaterProduction(gameState) {
    let production = 0;

    gameState.buildings.forEach(building => {
      if (building.type === BUILDING_TYPES.WATER_PUMP) {
        production += 20;
      }
    });

    return production;
  }

  static getPowerBalance(gameState) {
    const production = UtilitySystem.calculatePowerProduction(gameState);
    const consumption = UtilitySystem.calculatePowerConsumption(gameState);
    return production - consumption;
  }

  static getWaterBalance(gameState) {
    const production = UtilitySystem.calculateWaterProduction(gameState);
    const consumption = UtilitySystem.calculateWaterConsumption(gameState);
    return production - consumption;
  }

  static checkUtilityDeficiency(gameState) {
    const powerDeficit = UtilitySystem.getPowerBalance(gameState) < 0;
    const waterDeficit = UtilitySystem.getWaterBalance(gameState) < 0;

    return {
      powerDeficit,
      waterDeficit,
      powerBalance: UtilitySystem.getPowerBalance(gameState),
      waterBalance: UtilitySystem.getWaterBalance(gameState),
    };
  }

  static getUtilityDistributionRange(utilityType, infrastructure = 1) {
    const baseRange = {
      power: 15,
      water: 15,
      road: 0, // Roads don't distribute, just exist
    };

    return baseRange[utilityType] * infrastructure;
  }

  static calculateCoveragePercentage(gameState) {
    if (gameState.gridWidth === 0 || gameState.gridHeight === 0) return 0;

    let powerCells = 0;
    let waterCells = 0;
    let totalCells = 0;

    for (let y = 0; y < gameState.gridHeight; y++) {
      for (let x = 0; x < gameState.gridWidth; x++) {
        const cell = gameState.grid[y][x];
        totalCells++;

        if (cell.utilities.power) powerCells++;
        if (cell.utilities.water) waterCells++;
      }
    }

    return {
      powerCoverage: Math.round((powerCells / totalCells) * 100),
      waterCoverage: Math.round((waterCells / totalCells) * 100),
      totalCells,
    };
  }

  static getUtilityReport(gameState) {
    const powerBalance = UtilitySystem.getPowerBalance(gameState);
    const waterBalance = UtilitySystem.getWaterBalance(gameState);
    const coverage = UtilitySystem.calculateCoveragePercentage(gameState);

    return {
      power: {
        production: UtilitySystem.calculatePowerProduction(gameState),
        consumption: UtilitySystem.calculatePowerConsumption(gameState),
        balance: powerBalance,
        status: powerBalance > 0 ? 'surplus' : 'deficit',
        coverage: coverage.powerCoverage,
      },
      water: {
        production: UtilitySystem.calculateWaterProduction(gameState),
        consumption: UtilitySystem.calculateWaterConsumption(gameState),
        balance: waterBalance,
        status: waterBalance > 0 ? 'surplus' : 'deficit',
        coverage: coverage.waterCoverage,
      },
    };
  }

  static getMaintenance(gameState) {
    let maintenance = 0;

    // Maintenance costs per tick
    gameState.buildings.forEach(building => {
      switch (building.type) {
        case BUILDING_TYPES.POWER_PLANT:
          maintenance += 10;
          break;
        case BUILDING_TYPES.WATER_PUMP:
          maintenance += 2;
          break;
        case BUILDING_TYPES.ROAD:
          maintenance += 0.5;
          break;
        default:
          maintenance += 1;
          break;
      }
    });

    return Math.round(maintenance * 100) / 100;
  }
}
