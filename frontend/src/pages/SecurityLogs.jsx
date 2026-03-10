import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
export default function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => { const d = await apiFetch("/api/logs/security?limit=100"); if (d) setLogs(d.logs || []); };
    load(); const id = setInterval(load, 8000); return () => clearInterval(id);
  }, []);

  const logTypes = ["all", "AUTH_FAILURE", "INTRUSION_DETECTED", "FIREWALL_BLOCK", "POLICY_VIOLATION"];
  const filtered = filter === "all" ? logs : logs.filter(l => l.type === filter);
  const sevColor = { critical: "#ff2d55", error: "#ff6b35", warning: "#ffd60a", info: "#00d4ff" };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>📋 Security Logs & Analytics</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>Centralized SIEM · Real-time log aggregation · Forensic audit trail</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {logTypes.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: "5px 14px", borderRadius: "20px",
            background: filter === t ? "rgba(0,212,255,0.15)" : "transparent",
            border: `1px solid ${filter === t ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`,
            color: filter === t ? "#00d4ff" : "#4a6b8a",
            cursor: "pointer", fontSize: "10px", fontWeight: "600",
            letterSpacing: "1px", fontFamily: "inherit",
          }}>{t}</button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: "11px", color: "#4a6b8a", alignSelf: "center" }}>{filtered.length} entries</div>
      </div>

      <div style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ maxHeight: "600px", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, background: "rgba(5,10,20,0.98)", zIndex: 1 }}>
              <tr>
                {["TIMESTAMP", "TYPE", "SEVERITY", "MODULE", "USER", "IP", "MESSAGE"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", textAlign: "left", borderBottom: "1px solid rgba(0,212,255,0.1)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 80).map((log, i) => {
                const c = sevColor[log.severity] || "#4a6b8a";
                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "7px 12px", fontSize: "9px", color: "#4a6b8a", whiteSpace: "nowrap", fontFamily: "monospace" }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td style={{ padding: "7px 12px", fontSize: "10px", color: "#8aa8c8", whiteSpace: "nowrap" }}>{log.type}</td>
                    <td style={{ padding: "7px 12px" }}>
                      <span style={{ padding: "2px 6px", borderRadius: "3px", background: `${c}15`, color: c, fontSize: "9px", fontWeight: "700" }}>{log.severity?.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: "7px 12px", fontSize: "10px", color: "#5e5ce6" }}>{log.module}</td>
                    <td style={{ padding: "7px 12px", fontSize: "10px", color: "#4a6b8a" }}>{log.user}</td>
                    <td style={{ padding: "7px 12px", fontSize: "9px", color: "#4a6b8a", fontFamily: "monospace" }}>{log.ip}</td>
                    <td style={{ padding: "7px 12px", fontSize: "10px", color: "#8aa8c8" }}>{log.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
