// AchievementsScreen.jsx
import React from 'react';
import './css/AchievementsScreen.css';

export default function AchievementsScreen({ achievements, onBack, theme }) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className={`achievements-screen ${theme}`}>
      <div className="achievements-container">
        <div className="achievements-header">
          <h1 className="achievements-title">
            <span className="title-icon">🏅</span>
            <span>Achievements</span>
          </h1>
          <div className="achievements-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {unlockedCount}/{totalCount} Unlocked ({completionPercentage}%)
            </span>
          </div>
        </div>
        
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="achievement-date">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              {!achievement.unlocked && (
                <div className="achievement-locked-overlay">
                  <span className="lock-icon">🔒</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button className="back-btn" onClick={onBack}>
          <span>← Back to Menu</span>
        </button>
      </div>
    </div>
  );
}