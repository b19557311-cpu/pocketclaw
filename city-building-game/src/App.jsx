import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { StatsPanel, BuildingPanel, ControlPanel, HappinessGraph, Tutorial } from './components/UI';
import { useGame } from './hooks/useGame';
import './App.css';

function App() {
  const {
    gameState,
    selectedBuilding,
    setSelectedBuilding,
    hoveredCell,
    setHoveredCell,
    isPaused,
    setIsPaused,
    handleCellClick,
    handleClearAll,
  } = useGame(50, 50, 1);

  const [showTutorial, setShowTutorial] = useState(true);

  const handleCanvasHover = (e) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const TILE_SIZE = 32;
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (x >= 0 && x < gameState.gridWidth && y >= 0 && y < gameState.gridHeight) {
      setHoveredCell({ x, y });
    } else {
      setHoveredCell(null);
    }
  };

  const handleCanvasContextMenu = (e) => {
    e.preventDefault();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const TILE_SIZE = 32;
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    const building = gameState.getBuildingAt(x, y);
    if (building) {
      // This demonstrates right-click removal
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏙️ City Builder Game</h1>
        <div className="header-controls">
          <button
            className="mini-btn"
            onClick={() => setShowTutorial(!showTutorial)}
          >
            {showTutorial ? 'Hide' : 'Show'} Tutorial
          </button>
        </div>
      </header>

      <div className="app-container">
        <div className="sidebar left-sidebar">
          <BuildingPanel
            selectedBuilding={selectedBuilding}
            onSelectBuilding={setSelectedBuilding}
            gameState={gameState}
          />
        </div>

        <div className="main-content">
          <div
            className="canvas-wrapper"
            onMouseMove={handleCanvasHover}
            onContextMenu={handleCanvasContextMenu}
          >
            <GameCanvas
              gameState={gameState}
              selectedBuilding={selectedBuilding}
              onCellClick={handleCellClick}
              hoveredCell={hoveredCell}
            />
          </div>
        </div>

        <div className="sidebar right-sidebar">
          <StatsPanel gameState={gameState} />
          <ControlPanel
            onPause={() => setIsPaused(!isPaused)}
            isPaused={isPaused}
            onClear={handleClearAll}
          />
          <HappinessGraph history={gameState.happinessHistory} />
          {showTutorial && <Tutorial />}
        </div>
      </div>
    </div>
  );
}

export default App;
