import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { usePackets } from "../context/PacketContext"

const COLORS = { TCP: "#58a6ff", UDP: "#3fb950", DNS: "#d2a8ff", OTHER: "#8b949e" }

export default function ProtocolChart() {
  const { protocols } = usePackets()

  const data = Object.entries(protocols)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Protocol Breakdown</h2>
      {data.length === 0
        ? <p style={styles.empty}>Waiting for traffic...</p>
        : <PieChart width={280} height={260}>
            <Pie data={data} cx={130} cy={110} outerRadius={90}
              dataKey="value"> {data.map((entry) =>(
                <Cell key={entry.name} fill={COLORS[entry.name] || COLORS.OTHER} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend />
          </PieChart>
      }
    </div>
  )
}

const styles = {
  container: { background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "16px" },
  title: { color: "#58a6ff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" },
  empty: { color: "#8b949e", fontSize: "12px" }
}
