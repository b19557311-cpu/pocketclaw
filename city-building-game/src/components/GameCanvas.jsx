import React, { useEffect, useRef, useCallback } from 'react';
import { BUILDING_TYPES, BUILDING_STATS } from '../engine/types';

export const TILE_SIZE = 32;
const COLORS = {
  grass: '#2d5016',
  water: '#1e40af',
  stone: '#9ca3af',
  grid: '#4b5563',
  selected: '#fbbf24',
  power: '#fbbf24',
  waterUtility: '#60a5fa',
  road: '#78716c',
};

const BUILDING_COLORS = {
  residential: '#ef4444',
  commercial: '#3b82f6',
  industrial: '#6366f1',
  power_plant: '#fbbf24',
  water_pump: '#0ea5e9',
  road: '#9ca3af',
  park: '#10b981',
};

export function GameCanvas({ gameState, selectedBuilding, onCellClick, hoveredCell, onHover, onRemoveBuilding }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    const width = gameState.gridWidth * TILE_SIZE;
    const height = gameState.gridHeight * TILE_SIZE;

    canvas.width = width;
    canvas.height = height;

    // Draw grid
    for (let y = 0; y < gameState.gridHeight; y++) {
      for (let x = 0; x < gameState.gridWidth; x++) {
        const cell = gameState.grid[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Draw terrain
        ctx.fillStyle = COLORS[cell.terrain] || COLORS.grass;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Draw utilities
        if (cell.utilities.power) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }
        if (cell.utilities.water) {
          ctx.fillStyle = 'rgba(96, 165, 250, 0.15)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }

        // Draw grid lines
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      }
    }

    // Draw buildings
    gameState.buildings.forEach(building => {
      const px = building.x * TILE_SIZE;
      const py = building.y * TILE_SIZE;
      const width = building.width * TILE_SIZE;
      const height = building.height * TILE_SIZE;

      // Building fill
      ctx.fillStyle = BUILDING_COLORS[building.type];
      ctx.fillRect(px, py, width, height);

      // Building border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, width, height);

      // Highlight if hovered
      if (hoveredCell &&
          hoveredCell.x >= building.x &&
          hoveredCell.x < building.x + building.width &&
          hoveredCell.y >= building.y &&
          hoveredCell.y < building.y + building.height) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 1, py - 1, width + 2, height + 2);
      }

      // Utility indicators
      if (building.powerConnected) {
        ctx.fillStyle = COLORS.power;
        ctx.fillRect(px + 2, py + 2, 6, 6);
      }
      if (building.waterConnected) {
        ctx.fillStyle = COLORS.waterUtility;
        ctx.fillRect(px + width - 8, py + 2, 6, 6);
      }

      // Draw resident count for residential
      if (building.type === BUILDING_TYPES.RESIDENTIAL && building.residents > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${building.residents}`, px + width / 2, py + height / 2);
      }
    });

    // Draw placement preview
    if (hoveredCell && selectedBuilding) {
      const stats = BUILDING_STATS[selectedBuilding];
      if (stats) {
        const px = hoveredCell.x * TILE_SIZE;
        const py = hoveredCell.y * TILE_SIZE;
        const width = stats.width * TILE_SIZE;
        const height = stats.height * TILE_SIZE;

        // Check if valid placement
        let canPlace = true;
        for (let dy = 0; dy < stats.height; dy++) {
          for (let dx = 0; dx < stats.width; dx++) {
            const cell = gameState.getCell(hoveredCell.x + dx, hoveredCell.y + dy);
            if (!cell || cell.buildingId !== null) {
              canPlace = false;
            }
          }
        }

        ctx.fillStyle = canPlace ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(px, py, width, height);

        ctx.strokeStyle = canPlace ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, width, height);
      }
    }
  }, [gameState, hoveredCell, selectedBuilding]);

  const handleCanvasClick = useCallback((e) => {
    if (e.button === 0) { // Left click
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
      const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
      onCellClick(x, y);
    }
  }, [onCellClick]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    const building = gameState?.getBuildingAt(x, y);
    if (building && onRemoveBuilding) {
      onRemoveBuilding(building.id);
    }
  }, [gameState, onRemoveBuilding]);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (x >= 0 && x < gameState?.gridWidth && y >= 0 && y < gameState?.gridHeight) {
      onHover?.({ x, y });
    } else {
      onHover?.(null);
    }
  }, [gameState, onHover]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
      style={{
        border: '2px solid #333',
        cursor: 'crosshair',
        backgroundColor: '#1a1a1a',
        maxWidth: '100%',
        display: 'block',
      }}
    />
  );
}
