import { BUILDING_TYPES, BUILDING_STATS } from './types';

export class PopulationSimulator {
  static calculateHousingCapacity(gameState) {
    return gameState.buildings
      .filter(b => b.type === BUILDING_TYPES.RESIDENTIAL)
      .reduce((sum, building) => sum + 50, 0); // Each residential building can house 50 people
  }

  static calculateJobAvailability(gameState) {
    let jobs = 0;

    // Commercial buildings provide jobs
    jobs += gameState.buildings.filter(b => b.type === BUILDING_TYPES.COMMERCIAL).length * 30;

    // Industrial buildings provide jobs
    jobs += gameState.buildings.filter(b => b.type === BUILDING_TYPES.INDUSTRIAL).length * 20;

    // Power plants need maintenance
    jobs += gameState.buildings.filter(b => b.type === BUILDING_TYPES.POWER_PLANT).length * 10;

    return jobs;
  }

  static calculateIncome(gameState) {
    let income = 0;

    // Commercial buildings generate revenue
    income += gameState.buildings.filter(b => b.type === BUILDING_TYPES.COMMERCIAL).length * 5;

    // Industrial buildings generate revenue
    income += gameState.buildings.filter(b => b.type === BUILDING_TYPES.INDUSTRIAL).length * 3;

    // Tax from population (simplified - 1 per 50 residents)
    income += Math.floor(gameState.population / 50);

    return Math.floor(income);
  }

  static calculateDeathRate(gameState) {
    // Base death rate 0.5% per tick
    let deathRate = 0.005;

    // Reduce death rate with better conditions
    if (gameState.happiness > 70) {
      deathRate *= 0.8;
    }

    // Increase death rate with poor conditions
    if (gameState.happiness < 40) {
      deathRate *= 1.3;
    }

    // Disease from overcrowding
    const housing = PopulationSimulator.calculateHousingCapacity(gameState);
    if (gameState.population > housing * 0.9) {
      deathRate *= 1.2;
    }

    return Math.max(0, Math.min(0.02, deathRate));
  }

  static simulatePopulationTick(gameState) {
    const housing = PopulationSimulator.calculateHousingCapacity(gameState);
    const jobs = PopulationSimulator.calculateJobAvailability(gameState);

    // Growth factors
    let growthRate = 0;

    // Happiness factor
    const happinessFactor = (gameState.happiness - 50) * 0.01;
    growthRate += happinessFactor;

    // Housing availability factor
    if (housing > gameState.population) {
      const housingFactor = (housing - gameState.population) / housing * 0.05;
      growthRate += housingFactor;
    } else {
      // Overcrowding
      growthRate -= 0.02;
    }

    // Job availability factor
    if (jobs > gameState.population * 0.3) {
      const jobFactor = Math.min(0.02, (jobs - gameState.population * 0.3) / gameState.population * 0.01);
      growthRate += jobFactor;
    } else {
      growthRate -= 0.01;
    }

    // Apply growth/decline
    const deathRate = PopulationSimulator.calculateDeathRate(gameState);
    const netGrowth = Math.max(-deathRate, growthRate);

    const newPopulation = Math.max(0, Math.round(gameState.population * (1 + netGrowth)));
    const populationChange = newPopulation - gameState.population;

    return {
      population: newPopulation,
      change: populationChange,
      housingCapacity: housing,
      jobAvailability: jobs,
      deathRate,
      growthRate,
    };
  }

  static distributePopulation(gameState) {
    const residential = gameState.buildings.filter(b => b.type === BUILDING_TYPES.RESIDENTIAL);
    if (residential.length === 0) return;

    // Sort by connection status and residents
    residential.sort((a, b) => {
      const aScore = (a.powerConnected && a.waterConnected ? 1 : 0) * 1000 + a.residents;
      const bScore = (b.powerConnected && b.waterConnected ? 1 : 0) * 1000 + b.residents;
      return bScore - aScore;
    });

    // Distribute population preferring connected buildings
    const perBuilding = Math.floor(gameState.population / residential.length);
    const remainder = gameState.population % residential.length;

    residential.forEach((building, index) => {
      if (building.powerConnected && building.waterConnected) {
        building.residents = perBuilding + (index < remainder ? 1 : 0);
      } else {
        building.residents = Math.max(0, Math.floor(perBuilding * 0.2)); // Disconnected buildings can't hold many
      }
    });
  }

  static recalculateResidents(gameState) {
    const residential = gameState.buildings.filter(b => b.type === BUILDING_TYPES.RESIDENTIAL);

    residential.forEach(building => {
      const baseGrowth = 1 + (gameState.happiness - 50) * 0.005;
      const multiplier = building.powerConnected && building.waterConnected ? 1 : 0.1;

      building.residents = Math.max(0, Math.floor(building.residents * baseGrowth * multiplier));
    });
  }

  static getMigrationRate(gameState) {
    const housing = PopulationSimulator.calculateHousingCapacity(gameState);
    const occupancy = housing > 0 ? gameState.population / housing : 0;

    if (occupancy > 1) {
      return -0.05; // People leaving if overcrowded
    } else if (occupancy < 0.3) {
      return -0.02; // Slow decline if too empty
    } else {
      return 0; // Neutral
    }
  }
}
