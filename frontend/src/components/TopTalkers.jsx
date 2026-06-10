import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { usePackets } from "../context/PacketContext"

export default function TopTalkers() {
  const { topTalkers } = usePackets()

  const data = Object.entries(topTalkers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([ip, count]) => ({ ip, count }))

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>External Hosts</h2>
      {data.length === 0
        ? <p style={styles.empty}>Waiting for traffic...</p>
        : <BarChart width={280} height={260} data={data} layout="vertical">
            <XAxis type="number" stroke="#8b949e" fontSize={11} />
            <YAxis type="category" dataKey="ip" stroke="#8b949e"
              fontSize={10} width={110} />
            <Tooltip />
            <Bar dataKey="count" fill="#58a6ff" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#f78166" : "#58a6ff"} />
              ))}
            </Bar>
          </BarChart>
      }
    </div>
  )
}

const styles = {
  container: { background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "16px" },
  title: { color: "#58a6ff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" },
  empty: { color: "#8b949e", fontSize: "12px" }
}
