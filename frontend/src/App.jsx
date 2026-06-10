import { PacketProvider } from "./context/PacketContext"
import LiveFeed from "./components/LiveFeed"
import ProtocolChart from "./components/ProtocolChart"
import TopTalkers from "./components/TopTalkers"
import AlertPanel from "./components/AlertPanel"

function App() {
  return (
     <PacketProvider>
      <div style={styles.app}>
        <h1 style={styles.header}>
          Packet Anatomy Lab
          <span style={styles.subtitle}>real-time network analysis</span>
        </h1>
        <div style={styles.grid}>
          <div style={styles.wide}><LiveFeed /></div>
          <div><ProtocolChart /></div>
          <div><TopTalkers /></div>
          <div style={styles.wide}><AlertPanel /></div>
        </div>
      </div>
    </PacketProvider>
  )
}

const styles = {
  app: { padding: "20px", minHeight: "100vh" },
  header: {
    color: "#58a6ff", marginBottom: "20px", fontSize: "20px",
    display: "flex", alignItems: "baseline", gap: "12px"
  },
  subtitle: { color: "#8b949e", fontSize: "13px", fontWeight: "normal" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },
  wide: { gridColumn: "span 2" }
}


export default App
