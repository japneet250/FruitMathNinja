import React from 'react';
import './css/Navbar.css';

export default function Navbar({ 
  running, 
  onToggleRunning, 
  onClearCanvas, 
  theme, 
  onToggleTheme, 
  onExport,
  selectedNote 
}) {
  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-brand">
        <h1 className="navbar-title">AirWrite</h1>
      </div>
      
      <div className="navbar-controls">
        <button 
          className={`btn btn-primary ${running ? 'btn-stop' : 'btn-start'}`}
          onClick={onToggleRunning}
        >
          {running ? 'Stop Tracking' : 'Start Tracking'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onClearCanvas}
          disabled={!selectedNote}
        >
          Clear Canvas
        </button>
        <button 
          className="btn btn-secondary"
          onClick={onExport}
          disabled={!selectedNote}
        >
          Export PNG
        </button>
      </div>

      <div className="navbar-actions">
        <button 
          className="btn btn-icon" 
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}