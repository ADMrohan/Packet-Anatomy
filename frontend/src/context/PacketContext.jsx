import { createContext, useContext, useState, useEffect, useRef } from "react"

const PacketContext = createContext(null)

export function PacketProvider({ children }) {
  const [packets, setPackets] = useState([])
  const [protocols, setProtocols] = useState({ TCP: 0, UDP: 0, DNS: 0, OTHER: 0 })
  const [topTalkers, setTopTalkers] = useState({})
  const [alerts, setAlerts] = useState([])
  const pendingPackets = useRef([])

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws")

    ws.onopen = () => console.log("[ws] connected")
    ws.onclose = () => console.log("[ws] disconnected")

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "batch") {
        pendingPackets.current.push(...data.packets)
      }
    }

    // flush pending packets into state every second
    const interval = setInterval(() => {
      if (pendingPackets.current.length === 0) return

      const batch = pendingPackets.current.splice(0)

      // update packets -- keep last 100
      setPackets(prev => [...prev, ...batch].slice(-100))
 // update protocol counts
      setProtocols(prev => {
        const updated = { ...prev }
        batch.forEach(p => {
          const proto = p.proto || "OTHER"
          updated[proto] = (updated[proto] || 0) + 1
        })
        return updated
      })

      // update top talkers
      setTopTalkers(prev => {
        const updated = { ...prev }
        batch.forEach(p => {
          if (p.dst && !p.dst.startsWith("192.168.")){
		updated[p.dst] = (updated[p.dst] || 0 ) + 1
	  }
        })
        return updated
      })

      // update alerts
      const newAlerts = batch.filter(p => p.alert)
      if (newAlerts.length > 0) {
        setAlerts(prev => [...prev, ...newAlerts].slice(-50))
      }

    }, 1000)

    return () => {
      clearInterval(interval)
      ws.close()
    }
  }, [])

  return (
    <PacketContext.Provider value={{ packets, protocols, topTalkers, alerts }}>
      {children}
    </PacketContext.Provider>
  )
}

export function usePackets() {
  return useContext(PacketContext)
}
