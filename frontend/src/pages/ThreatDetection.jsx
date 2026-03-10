import { useState, useEffect } from "react";
import { apiFetch, SEVERITY_COLORS, SEVERITY_BG, timeAgo, formatBytes } from "../utils/api";

export default function ThreatDetection({ liveFeed }) {
  const [threats, setThreats] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState("all");
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch("/api/threats/live?limit=100");
      if (data) { setThreats(data.threats || []); setStats(data.stats || {}); }
    };
    load();
    const id = setInterval(load, 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (liveFeed.length > 0) {
      setThreats(prev => [...liveFeed, ...prev].slice(0, 100));
    }
  }, [liveFeed]);

  const filtered = filter === "all" ? threats : threats.filter(t => t.severity === filter);

  async function simulate() {
    setSimulating(true);
    await apiFetch("/api/threats/generate", { method: "POST", body: "{}" });
    setTimeout(() => setSimulating(false), 2000);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>⚡ Threat Detection</h1>
          <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>AI-powered real-time threat monitoring and classification</p>
        </div>
        <button onClick={simulate} disabled={simulating} style={{
          padding: "10px 20px", background: simulating ? "rgba(255,45,85,0.1)" : "rgba(255,45,85,0.2)",
          border: "1px solid rgba(255,45,85,0.4)", borderRadius: "8px",
          color: "#ff2d55", cursor: "pointer", fontSize: "11px",
          fontWeight: "700", fontFamily: "inherit", letterSpacing: "1px",
          boxShadow: simulating ? "0 0 20px rgba(255,45,85,0.3)" : "none",
        }}>
          {simulating ? "⚡ SIMULATING..." : "⚡ SIMULATE ATTACK"}
        </button>
      </div>

      {/* Attack Type Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "20px"
      }}>
        {Object.entries(stats.by_type || {}).slice(0, 10).map(([type, count]) => (
          <div key={type} style={{
            background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.1)",
            borderRadius: "8px", padding: "12px", textAlign: "center",
          }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#00d4ff" }}>{count}</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", marginTop: "2px" }}>
              {type.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Severity filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["all", "critical", "high", "medium", "low"].map(sev => {
          const c = sev === "all" ? "#00d4ff" : SEVERITY_COLORS[sev];
          return (
            <button key={sev} onClick={() => setFilter(sev)} style={{
              padding: "6px 16px", borderRadius: "20px",
              background: filter === sev ? `${c}25` : "transparent",
              border: `1px solid ${filter === sev ? c : "rgba(255,255,255,0.1)"}`,
              color: filter === sev ? c : "#4a6b8a",
              cursor: "pointer", fontSize: "11px", fontWeight: "600",
              letterSpacing: "1px", textTransform: "uppercase", fontFamily: "inherit",
            }}>
              {sev} {sev !== "all" && `(${(stats.by_severity || {})[sev] || 0})`}
            </button>
          );
        })}
        <div style={{ marginLeft: "auto", fontSize: "11px", color: "#4a6b8a", alignSelf: "center" }}>
          Showing {filtered.length} of {threats.length} threats
        </div>
      </div>

      {/* Threats Table */}
      <div style={{
        background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: "12px", overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,212,255,0.05)" }}>
              {["ID", "ATTACK TYPE", "SEVERITY", "RISK", "SOURCE IP", "ORIGIN", "TARGET", "BYTES", "AI CONF.", "MITRE", "STATUS", "TIME"].map(h => (
                <th key={h} style={{
                  fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px",
                  textAlign: "left", padding: "10px 12px",
                  borderBottom: "1px solid rgba(0,212,255,0.1)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 30).map((t, i) => {
              const c = SEVERITY_COLORS[t.severity] || "#8aa8c8";
              return (
                <tr key={t.id || i} style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  background: i === 0 && liveFeed[0]?.id === t.id ? "rgba(0,212,255,0.03)" : "transparent",
                  transition: "background 0.3s",
                }}>
                  <td style={{ padding: "8px 12px", fontSize: "10px", color: "#4a6b8a" }}>{t.id}</td>
                  <td style={{ padding: "8px 12px", fontSize: "11px", color: "#8aa8c8", fontWeight: "600", whiteSpace: "nowrap" }}>{t.attack_type}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{
                      padding: "3px 8px", borderRadius: "4px",
                      background: SEVERITY_BG[t.severity], color: c,
                      fontSize: "9px", fontWeight: "700", letterSpacing: "1px",
                    }}>{t.severity?.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: `conic-gradient(${c} ${t.risk_score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "9px", fontWeight: "700", color: c,
                    }}>{t.risk_score}</div>
                  </td>
                  <td style={{ padding: "8px 12px", fontSize: "10px", color: "#4a6b8a", fontFamily: "monospace" }}>{t.src_ip}</td>
                  <td style={{ padding: "8px 12px", fontSize: "11px", color: "#8aa8c8" }}>{t.src_country}</td>
                  <td style={{ padding: "8px 12px", fontSize: "11px", color: "#8aa8c8" }}>{t.dst_country}</td>
                  <td style={{ padding: "8px 12px", fontSize: "10px", color: "#4a6b8a" }}>{formatBytes(t.bytes || 0)}</td>
                  <td style={{ padding: "8px 12px", fontSize: "10px", color: "#30d158" }}>
                    {((t.ai_confidence || 0.9) * 100).toFixed(0)}%
                  </td>
                  <td style={{ padding: "8px 12px", fontSize: "9px", color: "#5e5ce6", fontFamily: "monospace" }}>{t.mitre_technique}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ fontSize: "10px", color: t.blocked ? "#30d158" : "#ff6b35", fontWeight: "700" }}>
                      {t.blocked ? "✓ BLOCKED" : "⚠ ACTIVE"}
                    </span>
                  </td>
                  <td style={{ padding: "8px 12px", fontSize: "10px", color: "#4a6b8a", whiteSpace: "nowrap" }}>{timeAgo(t.timestamp)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}