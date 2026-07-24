import React, { useState } from 'react';
import './InfoPanel.css';

export function InfoPanel({ gameState, selectedBuildingType }) {
  const [tab, setTab] = useState('info'); // 'info', 'buildings', 'achievements'

  if (!gameState) return null;

  return (
    <div className="info-panel">
      <div className="info-tabs">
        <button
          className={`info-tab ${tab === 'info' ? 'active' : ''}`}
          onClick={() => setTab('info')}
        >
          Info
        </button>
        <button
          className={`info-tab ${tab === 'buildings' ? 'active' : ''}`}
          onClick={() => setTab('buildings')}
        >
          Buildings
        </button>
      </div>

      <div className="info-content">
        {tab === 'info' && (
          <div className="info-tab-content">
            <div className="info-stat">
              <span className="label">Total Buildings:</span>
              <span className="value">{gameState.buildings.length}</span>
            </div>
            <div className="info-stat">
              <span className="label">Residential:</span>
              <span className="value">
                {gameState.buildings.filter(b => b.type === 'residential').length}
              </span>
            </div>
            <div className="info-stat">
              <span className="label">Industrial:</span>
              <span className="value">
                {gameState.buildings.filter(b => b.type === 'industrial').length}
              </span>
            </div>
            <div className="info-stat">
              <span className="label">Commercial:</span>
              <span className="value">
                {gameState.buildings.filter(b => b.type === 'commercial').length}
              </span>
            </div>
            <div className="info-stat">
              <span className="label">Power Plants:</span>
              <span className="value">
                {gameState.buildings.filter(b => b.type === 'power_plant').length}
              </span>
            </div>
            <div className="info-stat">
              <span className="label">Parks:</span>
              <span className="value">
                {gameState.buildings.filter(b => b.type === 'park').length}
              </span>
            </div>
          </div>
        )}

        {tab === 'buildings' && (
          <div className="info-tab-content">
            <h4>Power & Resources</h4>
            <div className="info-stat">
              <span className="label">Production:</span>
              <span className="value">{gameState.powerProduction}</span>
            </div>
            <div className="info-stat">
              <span className="label">Consumption:</span>
              <span className="value">{gameState.powerConsumption}</span>
            </div>
            <div className="info-stat">
              <span className="label">Balance:</span>
              <span className={`value ${gameState.powerProduction - gameState.powerConsumption >= 0 ? 'positive' : 'negative'}`}>
                {gameState.powerProduction - gameState.powerConsumption}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
