import { usePackets } from "../context/PacketContext"

export default function LiveFeed() {
  const { packets } = usePackets()

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Live Feed</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Proto</th>
              <th style={styles.th}>Source</th>
              <th style={styles.th}>Destination</th>
              <th style={styles.th}>Port</th>
              <th style={styles.th}>TTL</th>
              <th style={styles.th}>Flags</th>
              <th style={styles.th}>Len</th>
            </tr>
          </thead>
          <tbody>
            {[...packets].reverse().map((pkt, i) => (
              <tr key={i} style={pkt.alert ? styles.alertRow : styles.row}>
                <td style={styles.td}>
                  <span style={protoColor(pkt.proto)}>{pkt.proto}</span>
                </td>
                <td style={styles.td}>{pkt.src}</td>
                <td style={styles.td}>{pkt.dst}</td>
                <td style={styles.td}>{pkt.dport || "-"}</td>
                <td style={styles.td}>{pkt.ttl || "-"}</td>
                <td style={styles.td}>{pkt.flags || "-"}</td>
                <td style={styles.td}>{pkt.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function protoColor(proto) {
  const colors = {
    TCP: "#58a6ff",
    UDP: "#3fb950",
    DNS: "#d2a8ff",
    OTHER: "#8b949e"
  }
  return { color: colors[proto] || colors.OTHER, fontWeight: "bold" }
}

const styles = {
  container: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "16px",
    height: "100%"
  },
  title: {
    color: "#58a6ff",
    marginBottom: "12px",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  tableWrapper: {
    overflowY: "auto",
    maxHeight: "300px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    textAlign: "left",
    padding: "6px 8px",
    borderBottom: "1px solid #30363d",
    color: "#8b949e",
    fontSize: "12px",
    position: "sticky",
    top: 0,
    background: "#161b22"
  },
  td: {
    padding: "4px 8px",
    borderBottom: "1px solid #21262d",
    fontSize: "12px",
    fontFamily: "monospace"
  },
  row: {
    background: "transparent"
  },
  alertRow: {
    background: "#2d1a1a"
  }
}
