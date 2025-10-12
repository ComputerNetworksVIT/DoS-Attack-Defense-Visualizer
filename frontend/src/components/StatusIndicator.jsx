import React from 'react';
import './StatusIndicator.css';

function StatusIndicator({ status }) {
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <div className="status-indicator">
      <div className={`light ${status}`}></div>
      <p>Status: <span>{statusText}</span></p>
    </div>
  );
}

export default StatusIndicator;
