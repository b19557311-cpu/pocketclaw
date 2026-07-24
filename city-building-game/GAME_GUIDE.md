# City Builder Game - Complete Guide

## Overview

City Builder is a real-time city simulation game built with React and Canvas. Build residential zones, manage utilities, and keep your population happy while managing your budget.

## Game Features

### Core Gameplay Systems

#### 1. **Grid-Based City System**
- 50x50 tile map for city development
- Terrain types: Grass (default), Water, Stone
- Easy-to-read grid visualization
- Expandable to larger maps

#### 2. **Building System**
The game includes 7 different building types, each with unique properties:

| Building | Size | Cost | Purpose | Notes |
|----------|------|------|---------|-------|
| **Residential** | 2×2 | $100 | Houses citizens | Needs power & water |
| **Commercial** | 2×2 | $150 | Employment center | Increases happiness |
| **Industrial** | 3×3 | $200 | Production & jobs | Reduces nearby happiness |
| **Power Plant** | 2×2 | $300 | Generates power | Produces 50 power units |
| **Water Pump** | 1×1 | $100 | Generates water | Needs power to operate |
| **Road** | 1×1 | $25 | Transportation | Improves happiness |
| **Park** | 2×2 | $50 | Recreation | Boosts nearby happiness |

#### 3. **Utility Distribution Network**
Utilities spread from sources in a radius using breadth-first search:

**Power Distribution:**
- Power plants produce power
- Spreads up to 15 tiles from source
- Buildings need power to function
- Visual indicator: Yellow overlay shows power coverage

**Water Distribution:**
- Water pumps produce water
- Spreads up to 15 tiles from source
- Residents need water to live
- Visual indicator: Blue overlay shows water coverage

**Roads:**
- Improve happiness for nearby buildings
- Enable better traffic flow
- Marked as gray on the map

#### 4. **Population & Happiness System**

**Population Growth:**
- Residents move into connected residential buildings
- Growth depends on city happiness
- Happiness bonus: 1% growth per happiness point above 50%

**Happiness Factors:**
- Residential buildings: Base happiness +20
- Parks: +25 happiness (affects nearby buildings)
- Roads: +5 happiness per road
- Missing power: -15 happiness
- Missing water: -20 happiness
- Nearby industry: -5 per industrial building (max 8 tiles away)

**Happiness Formula:**
```
Happiness = (sum of all factors) / total population
Range: 0-100%
```

#### 5. **Economy System**
- Starting budget: $10,000
- Building costs deducted immediately
- Demolishing buildings returns 50% cost
- Track money in real-time

### Controls

**Mouse Interactions:**
- **Left Click**: Place selected building
- **Right Click**: Demolish building under cursor
- **Hover**: Preview building placement (green = valid, red = invalid)

**UI Controls:**
- **Pause/Resume**: Stop or continue simulation
- **Clear All**: Demolish all buildings at once
- **Show/Hide Tutorial**: Toggle help information

### Game Loop

The game updates at configurable speed (default: 1 tick/second):

1. **Recalculate Utilities** - Map power/water coverage
2. **Update Population** - Apply growth/decline
3. **Update Happiness** - Recalculate citizen mood
4. **Record History** - Track trends for graphs

## Strategy Tips

### Early Game (First 50 residents)
1. Build 1-2 residential zones
2. Immediately build a power plant
3. Add a water pump
4. Place some roads connecting buildings
5. Add parks to boost happiness

### Mid Game (50-200 residents)
1. Expand residential areas
2. Add commercial zones for employment
3. Maintain power balance
4. Use parks strategically between residential zones
5. Monitor happiness - keep above 60%

### Late Game (200+ residents)
1. Balance industrial production with residential happiness
2. Maintain surplus power production
3. Use parks to offset industrial pollution
4. Diversify economy with commercial zones
5. Plan city layout efficiently

### Key Strategies

**Power Management:**
- Always have surplus power production
- Power plants drain the treasury but essential
- Size power plants strategically for coverage

**Happiness Optimization:**
- Keep industrial zones far from residential
- Use parks to create happiness zones
- Build roads everywhere for +5 happiness boost
- Never let power/water disconnect from homes

**Budget Optimization:**
- Start building when money reaches $500
- Early game focus: Power + Water + Residential
- Demolish and rebuild to optimize placement
- Commercial zones are income generators

## UI Panels Explained

### Left Sidebar - Building Menu
- 7 building type buttons
- Grayed out if insufficient funds
- Shows cost and icon
- Click to select building
- Preview updates as you hover

### Right Sidebar - Game Info

**Stats Panel:**
- Current money
- Total population
- Happiness percentage
- Power balance (positive = surplus)
- Simulation time

**Info Panel:**
- Building count by type
- Power production/consumption
- Quick statistics

**Control Panel:**
- Pause/Resume button
- Clear All button (with confirmation)
- Color legend for map overlay

**Happiness Graph:**
- Visual trend over time
- Red line shows happiness history
- Helps track city health

## Game State

The game uses a sophisticated state management system:

```
GameState {
  Grid: 50×50 tiles with terrain & utilities
  Buildings: Array of placed structures
  Resources: Money, population
  Metrics: Happiness, power balance
  History: Happiness & population trends
}
```

Each building tracks:
- Position and size
- Type and properties
- Residents (for housing)
- Utility connections

## Performance Notes

- Efficient grid rendering with Canvas
- Optimized utility distribution algorithm
- Smooth 60 FPS gameplay
- Scalable to larger maps (tested to 100×100)

## Planned Features (Future)

- [ ] Taxes and income system
- [ ] Different terrain effects
- [ ] Natural disasters
- [ ] Traffic simulation
- [ ] Underground utilities
- [ ] Customizable map sizes
- [ ] Save/load functionality
- [ ] Multiplayer building
- [ ] Achievement system
- [ ] Advanced statistics

## Technical Details

### Architecture

```
src/
├── engine/
│   ├── GameState.js       # Core game logic
│   ├── types.js           # Constants & definitions
│   └── Achievements.js    # Achievement system
├── components/
│   ├── GameCanvas.jsx     # Canvas renderer
│   ├── UI.jsx             # UI components
│   ├── InfoPanel.jsx      # Information panels
│   └── styles.css         # Component styling
├── hooks/
│   └── useGame.js         # Game state management
└── App.jsx                # Main application
```

### Technology Stack
- **Framework**: React 18+
- **Rendering**: HTML5 Canvas
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Styling**: CSS3

### Key Algorithms

**Utility Distribution:**
```javascript
BFS from power plant:
- Queue all connected cells
- Mark as powered
- Continue up to 15 tiles away
- Exponential range growth
```

**Happiness Calculation:**
```javascript
For each residential building:
  happiness = base_happiness
  - (20 if no power)
  - (15 if no water)
  - (5 per nearby industrial)
  + (25 per adjacent park)
  + (5 per connected road)
```

## Troubleshooting

**Buildings not getting power?**
- Ensure power plant is within 15 tiles
- Check power plant is powered (needs water)
- Verify power plant has no obstruction

**Population not growing?**
- Happiness below 50% slows growth
- Ensure water and power connected
- Check happiness factors in Info Panel

**Game running slow?**
- Reduce building count
- It's expected at 500+ buildings
- Check browser hardware acceleration

## FAQ

**Q: How do I get more money?**
A: Commercial zones generate revenue (planned feature). For now, manage your budget carefully!

**Q: Can I expand the map?**
A: Yes! Modify `new GameState(100, 100)` in App.jsx for a 100×100 map.

**Q: Do I need to build roads?**
A: Not required, but they provide +5 happiness boost. Good investment for happiness!

**Q: What's the maximum population?**
A: Theoretically unlimited, but practical limit depends on your city layout and power production.

---

**Enjoy building your city! 🏙️**
