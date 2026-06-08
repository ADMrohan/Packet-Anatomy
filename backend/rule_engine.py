from collections import defaultdict, deque
import time

syn_tracker = defaultdict(list)    # port scan detection
beacon_tracker = defaultdict(list) # beaconing detection

def evaluate(record) -> dict | None:
    src = record["src"]
    dst = record["dst"]
    proto = record["proto"]
    dport = record["dport"]
    length = record["length"]
    # Rule 1: Port scan detection
    # same src hitting >15 unique ports within 10 seconds
    if proto == "TCP" and dport:
        if src == dst:
            return None
        now = time.time()
        syn_tracker[src].append((now, dport))

        # throw away entries older than 10 seconds
        syn_tracker[src] = [
            (t, p) for t, p in syn_tracker[src]
            if now - t < 10
        ]

        unique_ports = len(set(p for _, p in syn_tracker[src]))

       # print(f"[DEBUG] src={src} unique_ports={unique_ports}")

        if unique_ports > 10:
            return {
                "alert": "PORT_SCAN",
                "src": src,
                "unique_ports_hit": unique_ports,
                "window_seconds": 10
            }

    # Rule 2: DNS tunneling suspicion
    # DNS packets with unusually large payloads
    if proto == "DNS" and length > 200:
        return {
            "alert": "DNS_TUNNELING_SUSPECTED",
            "src": src,
            "payload_size": length
        }
    # Rule 3: Beaconing detection
    # same src->dst pair communicating at suspiciously regular intervals
    if src and dst:
        key = f"{src}->{dst}"
        beacon_tracker[key].append(time.time())

        # only analyze once we have at least 5 data points
        if len(beacon_tracker[key]) >= 5:
            # keep only last 10 entries
            beacon_tracker[key] = beacon_tracker[key][-10:]

            intervals = [
                beacon_tracker[key][i+1] - beacon_tracker[key][i]
                for i in range(len(beacon_tracker[key]) - 1)
            ]

            variance = max(intervals) - min(intervals)

            if variance < 0.5:
                return {
                    "alert": "BEACONING_DETECTED",
                    "host_pair": key,
                    "interval_variance": round(variance, 3)
                }
    return None
