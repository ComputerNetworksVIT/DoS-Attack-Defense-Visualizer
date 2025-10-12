import React from 'react';
import axios from 'axios';
import './ControlPanel.css';
import { FaPlay, FaStop, FaBolt, FaShieldAlt, FaStopCircle } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

function ControlPanel({ status, setStatus }) {
  const handleStartSim = () => {
    axios.post(`${API_BASE_URL}/start-simulation`)
      .then(() => setStatus('running'))
      .catch(err => console.error("Error starting simulation:", err));
  };
  
  const handleStopSim = () => {
    axios.post(`${API_BASE_URL}/stop-simulation`)
      .then(() => setStatus('offline'))
      .catch(err => console.error("Error stopping simulation:", err));
  };

  const handleStartAttack = () => {
    axios.post(`${API_BASE_URL}/start-attack`)
      .then(() => setStatus('attacking'))
      .catch(err => console.error("Error starting attack:", err));
  };

  const handleStopAttack = () => {
    axios.post(`${API_BASE_URL}/stop-attack`)
      .then(() => setStatus('running'))
      .catch(err => console.error("Error stopping attack:", err));
  };

  const handleApplyDefense = () => {
    axios.post(`${API_BASE_URL}/apply-defense`)
      .then(() => setStatus('defended'))
      .catch(err => console.error("Error applying defense:", err));
  };

  return (
    <div className="control-panel">
      <div className="button-group">
        <button onClick={handleStartSim} className="btn btn-start" disabled={status !== 'offline'}>
          <FaPlay /> Start Sim
        </button>
        <button onClick={handleStopSim} className="btn btn-stop" disabled={status === 'offline'}>
          <FaStop /> Stop Sim
        </button>
      </div>
      <div className="button-group">
        <button onClick={handleStartAttack} className="btn btn-attack" disabled={status !== 'running'}>
          <FaBolt /> Launch Attack
        </button>
        <button onClick={handleApplyDefense} className="btn btn-defend" disabled={status !== 'attacking'}>
          <FaShieldAlt /> Apply Defense
        </button>
        <button onClick={handleStopAttack} className="btn btn-stop-attack" disabled={status === 'offline' || status === 'running'}>
          <FaStopCircle /> Stop Attack
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
