// LeaderboardScreen.jsx
import React from 'react';
import './css/LeaderboardScreen.css';

export default function LeaderboardScreen({ scores, onBack, theme }) {
  return (
    <div className={`leaderboard-screen ${theme}`}>
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">
            <span className="title-icon">🏆</span>
            <span>Leaderboard</span>
          </h1>
        </div>
        
        <div className="scores-list">
          {scores.length === 0 ? (
            <p className="no-scores">No scores yet! Be the first to play!</p>
          ) : (
            scores.slice(0, 10).map((score, index) => (
              <div key={index} className={`score-item rank-${index + 1}`}>
                <span className="rank">
                  {index === 0 && <span className="medal">🥇</span>}
                  {index === 1 && <span className="medal">🥈</span>}
                  {index === 2 && <span className="medal">🥉</span>}
                  {index > 2 && <span className="rank-number">#{index + 1}</span>}
                </span>
                <span className="player-name">{score.username}</span>
                <span className="player-score">{score.score.toLocaleString()}</span>
                <span className="player-difficulty">{score.difficulty || 'Medium'}</span>
              </div>
            ))
          )}
        </div>
        
        <button className="back-btn" onClick={onBack}>
          <span>← Back to Menu</span>
        </button>
      </div>
    </div>
  );
}