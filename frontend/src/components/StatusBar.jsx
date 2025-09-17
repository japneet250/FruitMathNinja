import React from 'react';
import './css/StatusBar.css';

export default function StatusBar({ 
  theme, 
  running, 
  selectedNote, 
  strokes, 
  currentStroke, 
  showWebcam, 
  onToggleWebcam 
}) {
  const totalStrokes = strokes.length + (currentStroke.current.length > 0 ? 1 : 0);
  
  return (
    <div className={`status-bar ${theme}`}>
      <div className="status-info">
        <span className={`status-indicator ${running ? 'active' : 'inactive'}`}>
          <span className={`status-dot ${running ? 'active' : 'inactive'}`}></span>
          {running ? 'Tracking Active' : 'Tracking Inactive'}
        </span>
        {selectedNote && (
          <span className="stroke-count">
            Strokes: {totalStrokes}
          </span>
        )}
        {selectedNote && (
          <span className="note-info">
            Note: {selectedNote.title}
          </span>
        )}
      </div>
      
      <div className="view-controls">
        <button 
          className={`btn btn-sm ${showWebcam ? 'btn-primary' : 'btn-secondary'} ${theme}`}
          onClick={onToggleWebcam}
        >
          {showWebcam ? 'Hide Camera' : 'Show Camera'}
        </button>
      </div>
    </div>
  );
}