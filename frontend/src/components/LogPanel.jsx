import React from 'react';
import './LogPanel.css';

function LogPanel({ logs }) {
  return (
    <div className="log-panel">
      <h3>Event Log</h3>
      <div className="log-content">
        {logs.map((log, index) => (
          <p key={index}>
            <span className="log-timestamp">{log.time}</span>
            <span className="log-message">{log.message}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

export default LogPanel;
