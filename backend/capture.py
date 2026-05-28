from scapy.all import sniff, IP, TCP, UDP, DNS

def parse_packet(pkt):
    record = {
        "timestamp": float(pkt.time),
        "proto": "OTHER",
        "src": None,
        "dst": None,
        "sport": None,
        "dport": None,
        "length": len(pkt),
        "ttl": None,
        "flags": None
    }
    if IP in pkt:
        record["src"] = pkt[IP].src
        record["dst"] = pkt[IP].dst
        record["ttl"] = pkt[IP].ttl

    if TCP in pkt:
        record["proto"] = "TCP"
        record["sport"] = pkt[TCP].sport
        record["dport"] = pkt[TCP].dport
        record["flags"] = str(pkt[TCP].flags)
    elif UDP in pkt:
        record["proto"] = "UDP"
        record["sport"] = pkt[UDP].sport
        record["dport"] = pkt[UDP].dport

    if DNS in pkt:
        record["proto"] = "DNS"

    return record

def start_capture(callback , iface="ens33"):
    print(f"[*] Starting capture on {iface}....")
    sniff(iface=iface, prn=lambda pkt:callback(parse_packet(pkt)),store=False, filter="ip")

if __name__ == "__main__":
    def print_packet(record):
        proto = record["proto"]
        src = record["src"]
        dst = record["dst"]
        sport = record["sport"]
        dport = record["dport"]
        ttl = record["ttl"]
        flags = record["flags"]
        length = record["length"]

        if proto == "DNS":
            print(f"[DNS]  {src} -> {dst}  len={length}")
        elif proto == "TCP":
            print(f"[TCP]  {src}:{sport} -> {dst}:{dport}  flags={flags}  TTL={ttl}  len={length}")
        elif proto == "UDP":
            print(f"[UDP]  {src}:{sport} -> {dst}:{dport}  TTL={ttl}  len={length}")
        else:
            print(f"[???]  {src} -> {dst}  TTL={ttl}  len={length}")

    start_capture(print_packet)

