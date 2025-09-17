import React, { useEffect } from 'react';
import './css/WebcamView.css';

export default function WebcamView({ 
  theme, 
  videoRef, 
  showWebcam, 
  onToggleWebcam, 
  showOverlay, 
  onToggleOverlay,
  running
}) {
  // Ensure video stream restarts when webcam is shown again
  useEffect(() => {
    if (showWebcam && videoRef.current && running) {
      // Request camera access when webcam view is shown
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(console.error);
    }
  }, [showWebcam, running, videoRef]);
  
  if (!showWebcam) return null;
  
  return (
    <div className={`webcam-container ${theme}`}>
      <div className="webcam-view">
        <video 
          ref={videoRef} 
          className="webcam-video"
          autoPlay 
          muted 
          playsInline
        />
        <div className="webcam-controls">
          <button 
            className={`btn btn-sm ${theme}`}
            onClick={onToggleWebcam}
          >
            Hide Camera
          </button>
          <button 
            className={`btn btn-sm ${showOverlay ? 'btn-primary' : ''} ${theme}`}
            onClick={onToggleOverlay}
          >
            {showOverlay ? 'Hide Tracking' : 'Show Tracking'}
          </button>
        </div>
      </div>
    </div>
  );
}