import asyncio
import threading
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from capture import start_capture

app = FastAPI()
clients = set()
loop = None

async def broadcast(record):
    disconnect = set()
    for ws in list(clients):
        try:
            await ws.send_json(record)
        except:
            disconnect.add(ws)
    clients.difference_update(disconnect)

def on_packet(record):
    if loop and clients:
        asyncio.run_coroutine_threadsafe(broadcast(record), loop)

@app.on_event("startup")
async def startup():
    global loop
    loop = asyncio.get_event_loop()
    thread = threading.Thread(target=start_capture, args=(on_packet,), daemon=True)
    thread.start()
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

