import { usePackets } from "../context/PacketContext"

export default function AlertPanel() {
  const { alerts } = usePackets()

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Alerts
        {alerts.length > 0 &&
          <span style={styles.badge}>{alerts.length}</span>
        }
      </h2>
      <div style={styles.feed}>
        {alerts.length === 0
          ? <p style={styles.empty}>No alerts triggered</p>
          : [...alerts].reverse().map((pkt, i) => (
              <div key={i} style={styles.alert}>
                <span style={styles.alertType}>
                  {pkt.alert.alert}
                </span>
                <span style={styles.alertDetail}>
                  {pkt.alert.src && `src: ${pkt.alert.src}`}
                  {pkt.alert.host_pair && `pair: ${pkt.alert.host_pair}`}
                  {pkt.alert.unique_ports_hit && ` | ports: ${pkt.alert.unique_ports_hit}`}
                  {pkt.alert.payload_size && ` | size: ${pkt.alert.payload_size}b`}
                  {pkt.alert.interval_variance && ` | variance: ${pkt.alert.interval_variance}`}
                </span>
              </div>
            ))
        }
      </div>
    </div>
  )
}

const styles = {
  container: { background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "16px", height: "100%" },
  title: { color: "#f78166", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" },
  badge: { background: "#f78166", color: "#0d1117", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: "bold" },
  feed: { overflowY: "auto", maxHeight: "280px" },
  alert: { borderLeft: "3px solid #f78166", paddingLeft: "10px", marginBottom: "10px" },
  alertType: { color: "#f78166", fontWeight: "bold", fontSize: "12px", display: "block" },
  alertDetail: { color: "#8b949e", fontSize: "11px", fontFamily: "monospace" },
  empty: { color: "#8b949e", fontSize: "12px" }
}
