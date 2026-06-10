import asyncio
import threading
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from capture import start_capture
from rule_engine import evaluate

app = FastAPI()
clients = set()
loop = None
batch_lock = threading.Lock()
packet_batch = []

async def broadcast(record):
    disconnect = set()
    for ws in list(clients):
        try:
            await ws.send_json(record)
        except:
            disconnect.add(ws)
    clients.difference_update(disconnect)

async def batch_sender():
    while True:
        await asyncio.sleep(1)
        with batch_lock:
            if packet_batch and clients:
                batch = packet_batch.copy()
                packet_batch.clear()
            else:
                batch = []
        if batch:
            await broadcast({"type": "batch", "packets": batch})

def on_packet(record):
    alert = evaluate(record)
    if alert:
        record["alert"]=alert
    with batch_lock:
        packet_batch.append(record)

@app.on_event("startup")
async def startup():
    global loop
    loop = asyncio.get_event_loop()
    thread = threading.Thread(target=start_capture, args=(on_packet,), daemon=True)
    thread.start()
    asyncio.ensure_future(batch_sender())
    print("[*] Capture thread started")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.add(websocket)
    print(f"[+] Client connected. Total: {len(clients)}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        clients.discard(websocket)
        print(f"[-] Client disconnected. Total: {len(clients)}")

