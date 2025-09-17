import React from 'react';
import './css/Sidebar.css';

export default function Sidebar({ 
  theme, 
  notes, 
  selectedNote, 
  onSelectNote, 
  onCreateNote, 
  onDeleteNote 
}) {
  return (
    <aside className={`sidebar ${theme}`}>
      <div className={`sidebar-header ${theme}`}>
        <h3>Notes</h3>
        <button 
          className="btn btn-icon btn-new" 
          onClick={onCreateNote}
          title="Create new note"
        >
          +
        </button>
      </div>
      
      <div className="sidebar-content">
        {notes.length === 0 ? (
          <div className="sidebar-empty">
            <p>No notes yet</p>
            <p className="sidebar-empty-hint">Create your first note to get started</p>
          </div>
        ) : (
          <ul className="notes-list">
            {notes.map(note => (
              <li key={note.id} className={`note-item ${theme}`}>
                <button
                  className={`note-button ${theme} ${selectedNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => onSelectNote(note)}
                >
                  <div className="note-title">{note.title}</div>
                  <div className="note-meta">
                    {note.strokes} strokes • {note.lastModified}
                  </div>
                </button>
                <button 
                  className={`btn btn-icon btn-delete ${theme}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  title="Delete note"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}