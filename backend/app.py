from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from simulation_manager import SimulationManager
import metrics_collector
import atexit
import threading
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

sim_manager = SimulationManager()

mininet_lock = threading.Lock()
metrics_thread = None
stop_event = threading.Event()

def collect_metrics():
    while not stop_event.is_set():
        if sim_manager.net:
            with mininet_lock:
                cpu = metrics_collector.get_cpu_usage(sim_manager.net)
                pps = metrics_collector.get_pps(sim_manager.net)
            data = {'cpu': f'{cpu:.2f}', 'pps': pps}
            socketio.emit('metrics_update', data)
        time.sleep(1)

@app.route('/api/start-simulation', methods=['POST'])
def start_simulation_route():
    global metrics_thread
    with mininet_lock:
        sim_manager.start_simulation()
    if metrics_thread is None or not metrics_thread.is_alive():
        stop_event.clear()
        metrics_thread = threading.Thread(target=collect_metrics)
        metrics_thread.start()
    socketio.emit('log_message', {'message': 'Simulation environment started.'})
    return jsonify({"status": "success", "message": "Mininet simulation started."})

@app.route('/api/stop-simulation', methods=['POST'])
def stop_simulation_route():
    with mininet_lock:
        sim_manager.stop_simulation()
    socketio.emit('log_message', {'message': 'Simulation environment stopped.'})
    return jsonify({"status": "success", "message": "Mininet simulation stopped."})

@app.route('/api/start-attack', methods=['POST'])
def start_attack():
    with mininet_lock:
        sim_manager.start_attack()
    socketio.emit('log_message', {'message': 'DDoS Attack Initiated from 4 hosts.'})
    return jsonify({"status": "success", "message": "Attack started."})

@app.route('/api/stop-attack', methods=['POST'])
def stop_attack():
    with mininet_lock:
        sim_manager.stop_attack()
    socketio.emit('log_message', {'message': 'Attack sequence halted.'})
    return jsonify({"status": "success", "message": "Attack stopped."})

@app.route('/api/apply-defense', methods=['POST'])
def apply_defense():
    with mininet_lock:
        sim_manager.apply_defense()
    socketio.emit('log_message', {'message': 'Firewall defense activated on victim.'})
    return jsonify({"status": "success", "message": "Defense applied."})

def cleanup():
    stop_event.set()
    if metrics_thread and metrics_thread.is_alive():
        metrics_thread.join()
    sim_manager.stop_simulation()

atexit.register(cleanup)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False, allow_unsafe_werkzeug=True)
