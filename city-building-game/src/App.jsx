import React, { useState, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { StatsPanel, BuildingPanel, ControlPanel, HappinessGraph, Tutorial } from './components/UI';
import { InfoPanel } from './components/InfoPanel';
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
    handleRemoveBuilding,
    handleClearAll,
  } = useGame(50, 50, 1);

  const [showTutorial, setShowTutorial] = useState(true);

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
          <div className="canvas-wrapper">
            <GameCanvas
              gameState={gameState}
              selectedBuilding={selectedBuilding}
              onCellClick={handleCellClick}
              hoveredCell={hoveredCell}
              onHover={setHoveredCell}
              onRemoveBuilding={handleRemoveBuilding}
            />
          </div>
        </div>

        <div className="sidebar right-sidebar">
          <StatsPanel gameState={gameState} />
          <InfoPanel gameState={gameState} selectedBuildingType={selectedBuilding} />
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
