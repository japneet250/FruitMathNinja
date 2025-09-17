// MenuScreen.jsx
import React from 'react';
import './css/MenuScreen.css';

export default function MenuScreen({ 
  username, 
  onStartGame, 
  onShowLeaderboard, 
  onShowAchievements, 
  onLogout,
  theme,
  onThemeToggle
}) {
  return (
    <div className={`menu-screen ${theme}`}>
      <div className="menu-background">
        <div className="floating-fruits">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`floating-fruit fruit-${i}`}>
              {['🍎', '🍉', '🍍', '🍇'][i % 4]}
            </div>
          ))}
        </div>
      </div>
      
      <div className="menu-container">
        <div className="menu-header">
          <h1 className="game-title">
            <span className="title-icon">🥷</span>
            <span className="title-text">Math Fruit Ninja</span>
          </h1>
          <p className="welcome-text">Welcome back, <span className="username">{username}</span>!</p>
        </div>
        
        <div className="menu-buttons">
          <button className="menu-btn primary play-btn" onClick={onStartGame}>
            <span className="btn-icon">🎮</span>
            <span className="btn-text">Start Game</span>
            <span className="btn-effect"></span>
          </button>
          
          <button className="menu-btn secondary" onClick={onShowLeaderboard}>
            <span className="btn-icon">🏆</span>
            <span className="btn-text">Leaderboard</span>
          </button>
          
          <button className="menu-btn secondary" onClick={onShowAchievements}>
            <span className="btn-icon">🏅</span>
            <span className="btn-text">Achievements</span>
          </button>
        </div>
        
        <div className="menu-footer">
          <button className="theme-toggle" onClick={onThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button className="logout-btn" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}