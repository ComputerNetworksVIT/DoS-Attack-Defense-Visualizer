import re
import time

last_check_time = 0
last_rx_packets = 0

def get_cpu_usage(net):
    """Gets a stable CPU usage reading from h2 using vmstat."""
    if not net: return 0.0
    try:
        h2 = net.get('h2')
        # vmstat 1 2 gives two readings, 1 second apart. We take the second one.
        # The 15th column is the idle percentage.
        result = h2.cmd("vmstat 1 2 | tail -1 | awk '{print $15}'")
        idle_percentage = float(result.strip())
        # CPU usage is 100 - idle percentage
        return 100.0 - idle_percentage
    except (AttributeError, ValueError):
        return 0.0
        
def get_pps(net):
    """Calculates pps by reading iptables' internal packet counter on h2."""
    if not net: return 0
    global last_check_time, last_rx_packets

    try:
        h2 = net.get('h2')
        result = h2.cmd('iptables -t raw -L PREROUTING -v -n -x')

        # THE FIX IS HERE: Added '\\s*' to handle leading spaces
        match = re.search(r'\s*pkts\s+bytes\s+target\s+prot.*\n\s*(\d+)', result)

        if not match: return 0

        current_rx_packets = int(match.group(1))
        current_time = time.time()

        if last_check_time > 0:
            time_delta = current_time - last_check_time
            packets_delta = current_rx_packets - last_rx_packets
            pps = packets_delta / time_delta if time_delta > 0 else 0
        else:
            pps = 0

        last_check_time = current_time
        last_rx_packets = current_rx_packets

        return round(pps)
    except (AttributeError, ValueError):
        last_check_time, last_rx_packets = 0, 0
        return 0
