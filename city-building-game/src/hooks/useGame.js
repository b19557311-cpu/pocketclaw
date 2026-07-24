import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState } from '../engine/GameState';

export function useGame(gridWidth = 50, gridHeight = 50, ticksPerSecond = 1) {
  const [gameState, setGameState] = useState(() => new GameState(gridWidth, gridHeight));
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef(null);

  // Game loop
  useEffect(() => {
    if (isPaused) return;

    const intervalMs = 1000 / ticksPerSecond;
    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const newState = new GameState(prev.gridWidth, prev.gridHeight);
        // Copy state properties
        Object.assign(newState, prev);
        newState.buildings = prev.buildings.map(b => ({ ...b }));
        newState.grid = prev.grid.map(row =>
          row.map(cell => ({ ...cell, utilities: { ...cell.utilities } }))
        );
        newState.happinessHistory = [...prev.happinessHistory];
        newState.populationHistory = [...prev.populationHistory];
        newState.ticksPerSecond = ticksPerSecond;
        newState.update();
        return newState;
      });
    }, intervalMs);

    return () => clearInterval(gameLoopRef.current);
  }, [isPaused, ticksPerSecond]);

  const placeBuilding = useCallback((x, y, buildingType) => {
    setGameState(prev => {
      const newState = new GameState(prev.gridWidth, prev.gridHeight);
      Object.assign(newState, prev);
      newState.buildings = prev.buildings.map(b => ({ ...b }));
      newState.grid = prev.grid.map(row =>
        row.map(cell => ({ ...cell, utilities: { ...cell.utilities } }))
      );
      newState.happinessHistory = [...prev.happinessHistory];
      newState.populationHistory = [...prev.populationHistory];

      const result = newState.placeBuilding(x, y, buildingType);
      if (result.success) {
        newState.recalculateUtilities();
      }
      return newState;
    });
  }, []);

  const removeBuilding = useCallback((buildingId) => {
    setGameState(prev => {
      const newState = new GameState(prev.gridWidth, prev.gridHeight);
      Object.assign(newState, prev);
      newState.buildings = prev.buildings.map(b => ({ ...b }));
      newState.grid = prev.grid.map(row =>
        row.map(cell => ({ ...cell, utilities: { ...cell.utilities } }))
      );
      newState.happinessHistory = [...prev.happinessHistory];
      newState.populationHistory = [...prev.populationHistory];

      newState.removeBuilding(buildingId);
      newState.recalculateUtilities();
      return newState;
    });
  }, []);

  const handleCellClick = useCallback((x, y) => {
    const building = gameState.getBuildingAt(x, y);

    // Right-click behavior via modifier key or if building exists
    if (building) {
      // In a real implementation, you'd check for right-click
      // For now, left-click on building removes it
      removeBuilding(building.id);
    } else if (selectedBuilding) {
      // Place new building
      placeBuilding(x, y, selectedBuilding);
    }
  }, [gameState, selectedBuilding, placeBuilding, removeBuilding]);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to demolish all buildings?')) {
      setGameState(new GameState(gameState.gridWidth, gameState.gridHeight));
    }
  }, [gameState.gridWidth, gameState.gridHeight]);

  return {
    gameState,
    selectedBuilding,
    setSelectedBuilding,
    hoveredCell,
    setHoveredCell,
    isPaused,
    setIsPaused,
    handleCellClick,
    handleClearAll,
  };
}
