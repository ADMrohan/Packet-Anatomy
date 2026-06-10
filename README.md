# Packet Anatomy Lab

A real-time network packet capture and analysis engine with a live React dashboard.
Built to understand how network monitoring tools like Wireshark and Zeek work under the hood.

## What it does

- Captures live traffic off the network interface using libpcap via Scapy
- Parses IP, TCP, UDP, and DNS protocol headers in real time
- Streams parsed packets to a React dashboard via WebSockets
- Detects suspicious network behavior using a stateful rule engine
- Visualizes traffic patterns, protocol breakdown, and alerts live

## Tech Stack

- **Backend:** Python, Scapy, FastAPI, asyncio
- **Frontend:** React, Recharts, Vite
- **Transport:** WebSockets with 1-second batch delivery

## Project Structure
packet-anatomy-lab/
├── backend/
│   ├── main.py          # FastAPI app, WebSocket hub, batch sender
│   ├── capture.py       # Scapy sniffer, packet parser
│   └── rule_engine.py   # Detection rules with CIDR whitelisting
├── frontend/
│   └── src/
│       ├── context/
│       │   └── PacketContext.jsx   # WebSocket connection, shared state
│       └── components/
│           ├── LiveFeed.jsx        # Scrolling packet table
│           ├── ProtocolChart.jsx   # Protocol breakdown pie chart
│           ├── TopTalkers.jsx      # External host activity bar chart
│           └── AlertPanel.jsx      # Rule engine alert feed
└── requirements.txt

## Detection Rules

| Rule | Logic |
|---|---|
| Port Scan | >10 unique destination ports from same source within 10 seconds |
| DNS Tunneling | DNS payload size > 200 bytes |
| Beaconing | Same host pair communicating with interval variance < 0.5s |

## False Positive Handling

Beaconing detection uses CIDR-based whitelisting for known legitimate
infrastructure including Cloudflare, Fastly, and Google DNS ranges.
This mirrors how production SIEM tools handle baseline noise --
threshold tuning alone cannot distinguish legitimate CDN heartbeats
from C2 beaconing when both exhibit regular intervals.

## How to Run

**Backend:**
```bash
cd backend
sudo ../venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Known Limitations

- Requires promiscuous mode -- run backend with sudo
- Optimized for NAT network environments; bridged mode gives richer traffic
- Loopback traffic (localhost) not captured -- sniffer runs on ens33
- Whitelisted CIDR ranges may need updating for your network environment

## Key Concepts Learned

- BPF filters execute at kernel level before packets reach Python
- Blocking libpcap sniff() requires a dedicated thread to avoid freezing the async event loop
- Threading lock required when capture thread and async event loop share mutable state
- CIDR-based whitelisting is the production approach to false positive reduction
- Batching WebSocket messages reduces frontend re-renders from hundreds/second to one/second
