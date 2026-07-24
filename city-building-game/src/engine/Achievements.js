export const ACHIEVEMENTS = {
  FIRST_BUILDING: {
    id: 'first_building',
    name: 'First Steps',
    description: 'Place your first building',
    check: (gameState) => gameState.buildings.length >= 1,
  },
  GROWING_CITY: {
    id: 'growing_city',
    name: 'Growing City',
    description: 'Reach 100 residents',
    check: (gameState) => gameState.population >= 100,
  },
  METROPOLIS: {
    id: 'metropolis',
    name: 'Metropolis',
    description: 'Reach 500 residents',
    check: (gameState) => gameState.population >= 500,
  },
  POWER_PROVIDER: {
    id: 'power_provider',
    name: 'Power Provider',
    description: 'Build a power plant',
    check: (gameState) => gameState.buildings.some(b => b.type === 'power_plant'),
  },
  GREEN_CITY: {
    id: 'green_city',
    name: 'Green City',
    description: 'Build 5 parks',
    check: (gameState) => gameState.buildings.filter(b => b.type === 'park').length >= 5,
  },
  HAPPY_CITIZENS: {
    id: 'happy_citizens',
    name: 'Happy Citizens',
    description: 'Maintain 80% happiness for 30 seconds',
    check: (gameState) => gameState.happiness >= 80,
  },
  WEALTHY_MAYOR: {
    id: 'wealthy_mayor',
    name: 'Wealthy Mayor',
    description: 'Accumulate 5000 in the treasury',
    check: (gameState) => gameState.money >= 5000,
  },
  BALANCED_ECONOMY: {
    id: 'balanced_economy',
    name: 'Balanced Economy',
    description: 'Have positive power balance and full population',
    check: (gameState) => {
      const powerBalance = gameState.powerProduction - gameState.powerConsumption;
      return powerBalance > 0 && gameState.population > 0;
    },
  },
};

export class AchievementTracker {
  constructor() {
    this.unlockedAchievements = new Set();
    this.achievementProgress = new Map();
    this.lastHappinessAboveThreshold = 0;
  }

  update(gameState) {
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!this.unlockedAchievements.has(achievement.id)) {
        if (achievement.id === 'happy_citizens') {
          // Track time at high happiness
          if (achievement.check(gameState)) {
            this.lastHappinessAboveThreshold += 1;
            if (this.lastHappinessAboveThreshold >= 30) {
              this.unlock(achievement.id);
            }
          } else {
            this.lastHappinessAboveThreshold = 0;
          }
        } else if (achievement.check(gameState)) {
          this.unlock(achievement.id);
        }
      }
    });
  }

  unlock(achievementId) {
    this.unlockedAchievements.add(achievementId);
  }

  getUnlocked() {
    return Array.from(this.unlockedAchievements).map(id =>
      ACHIEVEMENTS[Object.keys(ACHIEVEMENTS).find(key =>
        ACHIEVEMENTS[key].id === id
      )]
    );
  }

  isUnlocked(achievementId) {
    return this.unlockedAchievements.has(achievementId);
  }
}
