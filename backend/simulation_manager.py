from mininet.net import Mininet
from mininet.topo import SingleSwitchTopo
from mininet.log import setLogLevel, info
import time

class SimulationManager:
    def __init__(self):
        self.net = None
        # MODIFIED: Store a list of attack processes
        self.attack_processes = []

    def start_simulation(self):
        if self.net: return
        print("Starting Mininet simulation with 5 hosts...")
        setLogLevel('info')
        
        # MODIFIED: Create a topology with 5 hosts
        topo = SingleSwitchTopo(5) 
        self.net = Mininet(topo=topo, controller=None)
        self.net.start()
        
        h2 = self.net.get('h2')
        h2.cmd('iptables -t raw -I PREROUTING 1 -p tcp')
        print("Mininet started successfully.")

    def stop_simulation(self):
        self.stop_attack() # This will stop all attack processes
        if self.net:
            print("Stopping Mininet simulation...")
            self.flush_defense_rules()
            self.net.stop()
            self.net = None
            print("Mininet stopped.")

    def start_attack(self):
        if not self.net or self.attack_processes: return
        print("Starting DDoS attack from 4 hosts...")
        
        victim = self.net.get('h2')
        # Get all hosts that are NOT the victim
        attackers = [h for h in self.net.hosts if h != victim]

        for attacker in attackers:
            print(f"  - Launching attack from {attacker.name}")
            attack_command = f"nping --tcp -p 80 --flags syn --rate 5000 -c 100000 {victim.IP()}"
            # Start an attack from each attacker and add it to our list
            proc = attacker.popen(attack_command, shell=True)
            self.attack_processes.append(proc)
        
        print("DDoS attack started.")
    
    def stop_attack(self):
        if self.attack_processes:
            print("Stopping all attack processes...")
            for proc in self.attack_processes:
                proc.terminate()
            self.attack_processes = [] # Clear the list
            print("All attacks stopped.")

    def apply_defense(self):
        if not self.net: return
        print("Applying firewall rules on h2...")
        h2 = self.net.get('h2')
        h2.cmd("iptables -A INPUT -p tcp --syn -m limit --limit 2/s --limit-burst 5 -j ACCEPT")
        h2.cmd("iptables -A INPUT -p tcp --syn -j DROP")
        print("Firewall rules applied.")

    def flush_defense_rules(self):
        if not self.net: return
        h2 = self.net.get('h2')
        h2.cmd("iptables -F")
        print("Firewall rules flushed.")
