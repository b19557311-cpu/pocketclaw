# City Builder Game - Developer Documentation

## Architecture Overview

The game follows a modular architecture with clear separation of concerns:

```
src/
├── engine/              # Core game logic
│   ├── GameState.js     # Main game state and simulation
│   ├── types.js         # Constants and type definitions
│   ├── GameConfig.js    # Configuration and balance settings
│   ├── Achievements.js  # Achievement tracking system
│   ├── TerrainGenerator.js  # Terrain and zone generation
│   ├── PopulationSimulation.js  # Population dynamics
│   └── UtilitySystem.js # Power, water, and infrastructure
├── components/          # React UI components
│   ├── GameCanvas.jsx   # Canvas rendering engine
│   ├── UI.jsx           # Stats, building menu, controls
│   ├── InfoPanel.jsx    # City information display
│   └── *.css            # Component styling
├── hooks/               # Custom React hooks
│   └── useGame.js       # Game state management
├── App.jsx              # Main application component
└── index.css            # Global styles
```

## Core Systems

### 1. GameState Engine

**Location:** `src/engine/GameState.js`

The heart of the game. Manages:
- Grid and cell data (50×50 default)
- Building placement and removal
- Utility distribution (power, water, roads)
- Population management
- Happiness calculation
- Economy (money, costs, refunds)

**Key Methods:**
```javascript
placeBuilding(x, y, buildingType)  // Place with validation
removeBuilding(buildingId)          // Demolish and refund
update()                            // Game tick
recalculateUtilities()              // Distribute power/water
updatePopulation()                  // Apply growth
updateHappiness()                   // Recalculate mood
```

**State Structure:**
```javascript
{
  gridWidth: number,
  gridHeight: number,
  grid: Cell[][], // Terrain and utilities
  buildings: Building[],
  money: number,
  population: number,
  happiness: number,
  time: number,
  powerProduction: number,
  powerConsumption: number,
  happinessHistory: number[],
  populationHistory: number[]
}
```

### 2. Building System

**Location:** `src/engine/types.js`

Seven building types defined with stats:
- Residential (2×2, $100)
- Commercial (2×2, $150)
- Industrial (3×3, $200)
- Power Plant (2×2, $300)
- Water Pump (1×1, $100)
- Road (1×1, $25)
- Park (2×2, $50)

**Building Object:**
```javascript
{
  id: number,
  type: string,
  x: number,
  y: number,
  width: number,
  height: number,
  powerConnected: boolean,
  waterConnected: boolean,
  residents: number // For residential
}
```

### 3. Utility Distribution

**Algorithm:** Breadth-First Search (BFS)

1. Find all utility sources (power plants, water pumps)
2. Start BFS from each source
3. Mark cells as covered within 15-tile range
4. Connect buildings if their base cell is covered

**Optimization:**
- Single BFS per utility per update
- Early termination at max distance
- Grid cell caching for reuse

### 4. Population System

**Files:**
- `src/engine/GameState.js` - Basic population management
- `src/engine/PopulationSimulation.js` - Advanced simulation (planned)

**Growth Formula:**
```
newResidents = residents × (1 + growthRate)

growthRate = happinessBonus
           + housingFactor
           + jobFactor
           - deathRate
```

**Happiness Calculation:**
```javascript
For each residential building:
  happiness = base(20)
    + (powerConnected ? 0 : -15)
    + (waterConnected ? 0 : -20)
    + (nearbyParks × 25 × 0.1)
    + (nearbyIndustry × -5)
    + (nearbyRoads × 5)
```

### 5. Configuration System

**Location:** `src/engine/GameConfig.js`

Centralized configuration with three difficulty modes:

```javascript
GAME_CONFIG = {
  GRID: { DEFAULT_WIDTH: 50, ... },
  ECONOMY: { STARTING_MONEY: 10000, ... },
  UTILITIES: { POWER: { ... }, WATER: { ... } },
  POPULATION: { MAX_PER_RESIDENTIAL: 50, ... },
  HAPPINESS: { RESIDENTIAL_BASE: 20, ... },
  DIFFICULTY: { EASY, NORMAL, HARD },
  FEATURES: { // Feature flags
    TERRAIN_GENERATION: false,
    ZONES: false,
    TRADING: false,
    DISASTERS: false,
    ACHIEVEMENTS: false
  }
}
```

## Component Architecture

### GameCanvas Component

**Location:** `src/components/GameCanvas.jsx`

Canvas-based renderer with:
- Grid rendering (50×50 tiles)
- Building visualization
- Utility overlay (power in yellow, water in blue)
- Placement preview
- Building highlights

**Performance:**
- 32×32 pixel tiles
- Single canvas element
- Efficient rect drawing
- No DOM elements for tiles

**Event Handling:**
- Left-click: Place building
- Right-click: Remove building
- Mouse move: Preview placement

### UI Components

**Location:** `src/components/UI.jsx`

**StatsPanel:**
- Money, population, happiness
- Power balance
- Simulation time

**BuildingPanel:**
- 7 building type buttons
- Cost display
- Affordability checking
- Building info on selection

**ControlPanel:**
- Pause/resume button
- Clear all button
- Color legend
- Feature flags

**HappinessGraph:**
- SVG line chart
- Last 100 ticks
- Real-time updates

**InfoPanel:**

**Location:** `src/components/InfoPanel.jsx`

Tabbed interface showing:
- Building counts by type
- Power production/consumption
- Water statistics

## Game Loop

**Location:** `src/hooks/useGame.js`

React hook managing game state and update loop:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    setGameState(prev => {
      const newState = copy(prev);
      newState.update(); // Run game logic
      return newState;
    });
  }, 1000 / ticksPerSecond);

  return () => clearInterval(interval);
}, [isPaused, ticksPerSecond]);
```

**Update Sequence:**
1. Recalculate utilities (BFS distribution)
2. Update population (growth/decline)
3. Update happiness (recalculate factors)
4. Record history (for graphs)

## Development Guide

### Adding a New Building Type

1. **Add to types.js:**
```javascript
BUILDING_TYPES.MY_BUILDING = 'my_building';

BUILDING_STATS.my_building = {
  width: 2,
  height: 2,
  cost: 150,
  power: 10,
  happiness: 5
};
```

2. **Add color in GameCanvas.jsx:**
```javascript
BUILDING_COLORS.my_building = '#abc123';
```

3. **Update logic in GameState.js** (if needed):
- Add special behavior in `update()` or `recalculateUtilities()`

4. **Update happiness calculation** (if needed):
- Add factors in `updateHappiness()`

### Modifying Game Balance

1. **Edit GameConfig.js:**
```javascript
GAME_CONFIG.UTILITIES.POWER.PLANT_PRODUCTION = 60; // Increase
```

2. **Update BUILDING_STATS:**
```javascript
BUILDING_STATS.power_plant.cost = 250; // Change cost
```

3. **Test with different difficulty modes:**
```javascript
getDifficultyConfig('HARD')
```

### Adding a New UI Component

1. Create component in `src/components/`:
```jsx
export function MyComponent({ gameState, onAction }) {
  return <div>...</div>;
}
```

2. Import in App.jsx
3. Add to appropriate sidebar
4. Style with CSS module

### Extending GameState

1. Add property to constructor:
```javascript
constructor(...) {
  this.myNewStat = 0;
}
```

2. Update in `update()` method:
```javascript
update() {
  // ...existing code...
  this.myNewStat = calculateNewStat();
}
```

3. Use in components:
```jsx
<span>{gameState.myNewStat}</span>
```

## Performance Considerations

### Optimization Techniques

1. **Canvas Rendering:**
   - Single canvas element
   - Pixel-perfect alignment
   - No subpixel rendering

2. **State Management:**
   - Immutable updates in React
   - Grid cell caching
   - Building index by ID

3. **Algorithm Efficiency:**
   - BFS for utility distribution (O(n²) worst case)
   - Early termination at max distance
   - Lazy calculation for statistics

### Profiling

```javascript
// Measure update time
const start = performance.now();
gameState.update();
const duration = performance.now() - start;
console.log(`Update took ${duration}ms`);
```

### Bottlenecks

- BFS utility distribution (when many sources)
- Happiness calculation (when many buildings)
- Grid rendering (at 100×100+ size)

**Solutions:**
- Batch BFS updates
- Cache happiness factors
- Use WebGL for rendering at scale

## Testing

### Manual Testing Checklist

- [ ] Building placement validation
- [ ] Money deduction and refund
- [ ] Utility distribution visualization
- [ ] Population growth at different happiness levels
- [ ] Demolition refunds
- [ ] UI responsiveness
- [ ] Game pause/resume
- [ ] Graph updates

### Edge Cases

- Placing buildings with insufficient funds
- Overcrowding (population > housing)
- Utility deficiency (no power/water)
- Max grid size (100×100)
- Rapid building/demolishing

## Future Systems

### Planned Features (Feature Flags)

1. **Terrain Generation** (`FEATURES.TERRAIN_GENERATION`)
   - Uses TerrainGenerator.js
   - Perlin-like noise
   - Water obstacles

2. **Zone System** (`FEATURES.ZONES`)
   - ZoneManager in TerrainGenerator.js
   - Zoned city planning
   - Zone-based statistics

3. **Achievements** (`FEATURES.ACHIEVEMENTS`)
   - Achievements.js system
   - 8 major milestones
   - Unlock tracking

4. **Trading System** (`FEATURES.TRADING`)
   - Inter-city commerce
   - Resource trading
   - Economic simulation

5. **Disasters** (`FEATURES.DISASTERS`)
   - Random events
   - Damage system
   - Recovery mechanics

## Deployment

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory with:
- Bundled JavaScript
- Optimized HTML
- Asset hashing

### Performance Stats

- Bundle size: ~150KB (gzipped)
- Initial load: <2s
- 60 FPS gameplay at 50×50 grid
- 30 FPS at 100×100 grid

## Common Issues & Solutions

**Q: Game runs slow**
A: Check building count. Limit to 500 buildings or increase grid tile size.

**Q: Utilities not spreading**
A: Verify sources are within distribution range. Check if power plant is powered.

**Q: Population not growing**
A: Check happiness (must be > 50%). Verify power/water connected to residential.

**Q: Performance drops with large map**
A: Reduce UPDATE_TPS in GameConfig. Increase TILE_SIZE for less rendering.

## Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Vite Documentation](https://vitejs.dev/)

## Code Style

- Use camelCase for variables/functions
- Use UPPER_CASE for constants
- JSDoc comments for public methods
- Functional components preferred
- Immutable state updates

## Contribution Workflow

1. Create feature branch from `main`
2. Make changes with clear commits
3. Test thoroughly
4. Submit PR with description
5. Code review and merge

---

**Last Updated:** 2026-07-24
**Game Version:** 1.0.0
