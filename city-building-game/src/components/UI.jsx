import React from 'react';
import { BUILDING_TYPES, BUILDING_STATS } from '../engine/types';
import './UI.css';

export function StatsPanel({ gameState }) {
  const stats = gameState.getStats();

  return (
    <div className="stats-panel">
      <h2>City Stats</h2>
      <div className="stat-item">
        <span className="label">Money:</span>
        <span className="value">${stats.money}</span>
      </div>
      <div className="stat-item">
        <span className="label">Population:</span>
        <span className="value">{stats.population}</span>
      </div>
      <div className="stat-item">
        <span className="label">Happiness:</span>
        <span className="value">{stats.happiness}%</span>
      </div>
      <div className="stat-item">
        <span className="label">Power Balance:</span>
        <span className={`value ${stats.powerBalance >= 0 ? 'positive' : 'negative'}`}>
          {stats.powerBalance > 0 ? '+' : ''}{stats.powerBalance}
        </span>
      </div>
      <div className="stat-item">
        <span className="label">Time:</span>
        <span className="value">{Math.floor(stats.time)}s</span>
      </div>
    </div>
  );
}

export function BuildingPanel({ selectedBuilding, onSelectBuilding, gameState }) {
  const buildings = Object.values(BUILDING_TYPES);

  return (
    <div className="building-panel">
      <h2>Buildings</h2>
      <div className="building-grid">
        {buildings.map(buildingType => {
          const stats = BUILDING_STATS[buildingType];
          const canAfford = gameState.money >= stats.cost;

          return (
            <button
              key={buildingType}
              className={`building-btn ${selectedBuilding === buildingType ? 'active' : ''} ${
                !canAfford ? 'disabled' : ''
              }`}
              onClick={() => onSelectBuilding(buildingType)}
              disabled={!canAfford}
              title={`Cost: $${stats.cost}`}
            >
              <div className="building-icon">{buildingType[0].toUpperCase()}</div>
              <div className="building-name">{buildingType.replace(/_/g, ' ')}</div>
              <div className="building-cost">${stats.cost}</div>
            </button>
          );
        })}
      </div>
      {selectedBuilding && (
        <div className="building-info">
          <h3>{selectedBuilding.replace(/_/g, ' ')}</h3>
          <BuildingInfo building={selectedBuilding} />
        </div>
      )}
    </div>
  );
}

function BuildingInfo({ building }) {
  const stats = BUILDING_STATS[building];

  return (
    <div className="info-details">
      <div className="info-item">
        <span>Size:</span>
        <span>{stats.width} x {stats.height}</span>
      </div>
      <div className="info-item">
        <span>Cost:</span>
        <span>${stats.cost}</span>
      </div>
      <div className="info-item">
        <span>Power:</span>
        <span className={stats.power > 0 ? 'positive' : 'negative'}>
          {stats.power > 0 ? '+' : ''}{stats.power}
        </span>
      </div>
      <div className="info-item">
        <span>Happiness:</span>
        <span className={stats.happiness > 0 ? 'positive' : 'negative'}>
          {stats.happiness > 0 ? '+' : ''}{stats.happiness}
        </span>
      </div>
    </div>
  );
}

export function ControlPanel({ onPause, isPaused, onClear }) {
  return (
    <div className="control-panel">
      <h2>Controls</h2>
      <div className="control-buttons">
        <button className="control-btn" onClick={onPause}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button className="control-btn danger" onClick={onClear}>
          Clear All
        </button>
      </div>
      <div className="legend">
        <h3>Legend</h3>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
          <span>Power Coverage</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#60a5fa' }}></div>
          <span>Water Coverage</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Residential</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Commercial</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#6366f1' }}></div>
          <span>Industrial</span>
        </div>
      </div>
    </div>
  );
}

export function HappinessGraph({ history }) {
  const height = 150;
  const width = 300;

  if (!history || history.length === 0) return null;

  const maxHistory = 100;
  const displayHistory = history.slice(-maxHistory);
  const max = 100;
  const min = 0;

  const points = displayHistory.map((value, i) => {
    const x = (i / (displayHistory.length - 1 || 1)) * width;
    const y = height - ((value - min) / (max - min)) * height;
    return { x, y, value };
  });

  return (
    <div className="graph-container">
      <h3>Happiness Trend</h3>
      <svg width={width} height={height} className="graph-svg">
        {/* Grid lines */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#444" strokeWidth="1" strokeDasharray="5,5" />

        {/* Line path */}
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill="#ef4444" />
        ))}
      </svg>
      <div className="graph-labels">
        <span>100%</span>
        <span>50%</span>
        <span>0%</span>
      </div>
    </div>
  );
}

export function Tutorial() {
  return (
    <div className="tutorial">
      <h2>How to Play</h2>
      <ul>
        <li>Select a building from the menu on the left</li>
        <li>Click on the grid to place it (green = valid, red = invalid)</li>
        <li>Right-click buildings to demolish them</li>
        <li>Build residential zones and utilities to grow your city</li>
        <li>Keep happiness high to attract more residents</li>
        <li>Balance power production with consumption</li>
      </ul>
    </div>
  );
}
