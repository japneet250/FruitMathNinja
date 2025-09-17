// GameOverScreen.jsx
import React, { useEffect, useState } from 'react';
import './css/GameOverScreen.css';

export default function GameOverScreen({ 
  score, 
  finalStats, 
  isNewHighScore, 
  onRestart, 
  onBackToMenu, 
  theme 
}) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Animate stats appearance
    setTimeout(() => setShowStats(true), 500);
  }, []);

  return (
    <div className={`game-over-screen ${theme}`}>
      <div className="game-over-container">
        <div className="game-over-header">
          <h1 className="game-over-title">Game Over!</h1>
          {isNewHighScore && (
            <div className="new-high-score">
              <span className="high-score-icon">🎉</span>
              <span className="high-score-text">New High Score!</span>
              <span className="high-score-icon">🎉</span>
            </div>
          )}
        </div>
        
        <div className={`final-stats ${showStats ? 'show' : ''}`}>
          <div className="stat-item main-score">
            <span className="stat-label">Final Score</span>
            <span className="stat-value">{score.toLocaleString()}</span>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-label">Max Combo</span>
              <span className="stat-value">{finalStats.maxCombo}x</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{finalStats.accuracy}%</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">⚡</span>
              <span className="stat-label">Power-ups Used</span>
              <span className="stat-value">{finalStats.powerUpsUsed}</span>
            </div>
          </div>
        </div>
        
        <div className="game-over-buttons">
          <button className="game-over-btn primary" onClick={onRestart}>
            <span className="btn-icon">🔄</span>
            <span className="btn-text">Play Again</span>
          </button>
          <button className="game-over-btn secondary" onClick={onBackToMenu}>
            <span className="btn-icon">📋</span>
            <span className="btn-text">Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}