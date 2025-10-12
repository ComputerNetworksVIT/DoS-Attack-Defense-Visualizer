import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import ControlPanel from './components/ControlPanel';
import CpuGauge from './components/CpuGauge';
import StatusIndicator from './components/StatusIndicator';
import LogPanel from './components/LogPanel';
import AnimatedBackground from './components/AnimatedBackground';

const socket = io('http://localhost:5000');

function App() {
  const [cpuHistory, setCpuHistory] = useState(Array(50).fill(0));
  const [simStatus, setSimStatus] = useState('offline');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on('metrics_update', (data) => {
      setCpuHistory(prevHistory => {
        const newHistory = [...prevHistory, data.cpu];
        return newHistory.length > 50 ? newHistory.slice(1) : newHistory;
      });
    });

    socket.on('log_message', (data) => {
      const time = new Date().toLocaleTimeString();
      const newLog = { time: `[${time}]`, message: data.message };
      setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100));
    });

    socket.on('disconnect', () => {
      setSimStatus('offline');
    });

    return () => {
      socket.off('metrics_update');
      socket.off('log_message');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="App">
      <AnimatedBackground />
      <header>
        <h1>Project Sentinel: DoS Visualizer</h1>
        <p>An interactive dashboard to simulate and defend against Denial of Service attacks.</p>
      </header>
      <main>
        <div className="main-content">
          <div className="dashboard-display">
            <CpuGauge cpuHistory={cpuHistory} />
          </div>
          <div className="side-panel">
            <StatusIndicator status={simStatus} />
            <ControlPanel status={simStatus} setStatus={setSimStatus} />
            <LogPanel logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
