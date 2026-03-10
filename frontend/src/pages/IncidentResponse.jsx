import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function IncidentResponse() {
  const [responding, setResponding] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  async function triggerResponse() {
    setResponding(true);
    const data = await apiFetch("/api/incident/respond", {
      method: "POST",
      body: JSON.stringify({ incident_id: `INC-${Date.now()}` }),
    });
    setResponding(false);
    if (data) { setResult(data); setHistory(h => [data, ...h].slice(0, 5)); }
  }

  const PLAYBOOKS = [
    { name: "DDoS Mitigation", steps: ["Rate limit traffic", "Enable CDN scrubbing", "Notify upstream ISP", "Update firewall ACLs"], time: "< 2 min", color: "#ff2d55" },
    { name: "Ransomware Response", steps: ["Isolate infected hosts", "Disable SMB shares", "Restore from clean backup", "Force password reset"], time: "< 5 min", color: "#ff6b35" },
    { name: "Credential Breach", steps: ["Lock compromised accounts", "Force MFA re-enrollment", "Audit access logs", "Issue security advisory"], time: "< 3 min", color: "#ffd60a" },
    { name: "Data Exfiltration", steps: ["Block external connections", "Capture forensic image", "Preserve audit trail", "Notify DPO"], time: "< 4 min", color: "#5e5ce6" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>🚨 Automated Incident Response</h1>
          <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>Self-healing system · Auto-isolation · Backup restoration · Zero manual intervention</p>
        </div>
        <button onClick={triggerResponse} disabled={responding} style={{
          padding: "12px 24px",
          background: responding ? "rgba(255,45,85,0.2)" : "linear-gradient(135deg, #ff2d55, #ff6b35)",
          border: "none", borderRadius: "8px", color: "#fff",
          cursor: "pointer", fontSize: "12px", fontWeight: "700",
          letterSpacing: "1px", fontFamily: "inherit",
          boxShadow: responding ? "0 0 30px rgba(255,45,85,0.5)" : "0 0 20px rgba(255,45,85,0.3)",
          animation: responding ? "pulse 0.8s infinite" : "none",
        }}>
          {responding ? "⚡ RESPONDING..." : "⚡ TRIGGER AUTO-RESPONSE"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "AVG RESPONSE TIME", value: "1.8s", color: "#30d158" },
          { label: "AUTO-RESOLVED", value: "847", color: "#00d4ff" },
          { label: "SYSTEMS HEALED", value: "124", color: "#5e5ce6" },
          { label: "UPTIME MAINTAINED", value: "99.97%", color: "#ffd60a" },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(8,15,30,0.8)", border: `1px solid ${s.color}25`,
            borderRadius: "10px", padding: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Response Result */}
      {result && (
        <div style={{
          background: "rgba(48,209,88,0.08)", border: "1px solid rgba(48,209,88,0.25)",
          borderRadius: "12px", padding: "20px", marginBottom: "24px",
          animation: "fadeIn 0.3s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: "#30d158", fontWeight: "800" }}>✓ INCIDENT CONTAINED: {result.incident_id}</div>
            <div style={{ fontSize: "11px", color: "#4a6b8a" }}>Response time: {result.response_time_ms}ms</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {(result.actions_taken || []).map((action, i) => (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: "8px",
                background: action.status === "completed" ? "rgba(48,209,88,0.08)" : "rgba(255,214,10,0.08)",
                border: `1px solid ${action.status === "completed" ? "rgba(48,209,88,0.2)" : "rgba(255,214,10,0.2)"}`,
              }}>
                <div style={{ fontSize: "10px", color: action.status === "completed" ? "#30d158" : "#ffd60a", marginBottom: "4px" }}>
                  {action.status === "completed" ? "✓" : "⏳"} {action.status.toUpperCase()}
                </div>
                <div style={{ fontSize: "11px", color: "#8aa8c8" }}>{action.action}</div>
                <div style={{ fontSize: "9px", color: "#4a6b8a", marginTop: "3px" }}>{action.time_ms}ms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playbooks */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>AUTOMATED PLAYBOOKS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {PLAYBOOKS.map(pb => (
            <div key={pb.name} style={{
              background: "rgba(8,15,30,0.8)", border: `1px solid ${pb.color}25`,
              borderRadius: "12px", padding: "18px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "700" }}>{pb.name}</div>
                <div style={{ fontSize: "10px", color: pb.color, fontWeight: "700" }}>{pb.time}</div>
              </div>
              {pb.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{
                    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                    background: `${pb.color}20`, border: `1px solid ${pb.color}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", color: pb.color, fontWeight: "700",
                  }}>{i + 1}</div>
                  <div style={{ fontSize: "11px", color: "#8aa8c8" }}>{step}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Self Healing Status */}
      <div style={{
        background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: "12px", padding: "20px",
      }}>
        <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>🔄 SELF-HEALING SYSTEM STATUS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { label: "Auto-Isolation", desc: "Infected nodes quarantined within 500ms", active: true },
            { label: "State Recovery", desc: "Clean snapshot restored in < 30 seconds", active: true },
            { label: "Config Rollback", desc: "Malicious config changes auto-reverted", active: true },
            { label: "Key Rotation", desc: "Compromised keys rotated automatically", active: true },
            { label: "Patch Deployment", desc: "Critical patches deployed without downtime", active: true },
            { label: "Backup Verification", desc: "Hourly integrity checks on all backups", active: true },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "12px", background: "rgba(0,212,255,0.03)",
              borderRadius: "8px", border: "1px solid rgba(0,212,255,0.08)",
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: item.active ? "#30d158" : "#ff2d55",
                boxShadow: `0 0 6px ${item.active ? "#30d158" : "#ff2d55"}`,
                marginTop: "3px", flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "600", marginBottom: "3px" }}>{item.label}</div>
                <div style={{ fontSize: "10px", color: "#4a6b8a" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );
}