// AccessControl.jsx
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export function AccessControl() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch("/api/access/sessions");
      if (data) setSessions(data.sessions || []);
    };
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  const riskColor = { normal: "#30d158", suspicious: "#ffd60a", anomalous: "#ff2d55" };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>🔐 Secure Access Control</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>MFA · RBAC · Device Fingerprinting · Behavioral Auth · Zero Trust Sessions</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "ACTIVE SESSIONS", value: sessions.length, color: "#00d4ff" },
          { label: "MFA ENFORCED", value: `${sessions.filter(s => s.mfa_passed).length}/${sessions.length}`, color: "#30d158" },
          { label: "SUSPICIOUS", value: sessions.filter(s => s.risk_level === "suspicious").length, color: "#ffd60a" },
          { label: "ANOMALOUS", value: sessions.filter(s => s.risk_level === "anomalous").length, color: "#ff2d55" },
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

      <div style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,212,255,0.1)", fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px" }}>
          ACTIVE USER SESSIONS
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,212,255,0.03)" }}>
              {["USER", "IP ADDRESS", "COUNTRY", "DEVICE", "BROWSER", "RISK", "MFA", "BEHAVIORAL", "ACTIONS", "LOGGED IN"].map(h => (
                <th key={h} style={{ padding: "10px 12px", fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", textAlign: "left", borderBottom: "1px solid rgba(0,212,255,0.08)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => {
              const rc = riskColor[s.risk_level] || "#4a6b8a";
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "10px 12px", fontSize: "11px", color: "#e2e8f0" }}>{s.user}</td>
                  <td style={{ padding: "10px 12px", fontSize: "10px", color: "#4a6b8a", fontFamily: "monospace" }}>{s.ip}</td>
                  <td style={{ padding: "10px 12px", fontSize: "11px", color: "#8aa8c8" }}>{s.country}</td>
                  <td style={{ padding: "10px 12px", fontSize: "10px", color: "#8aa8c8" }}>{s.device}</td>
                  <td style={{ padding: "10px 12px", fontSize: "10px", color: "#4a6b8a" }}>{s.browser}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: "4px", background: `${rc}20`, color: rc, fontSize: "9px", fontWeight: "700" }}>
                      {s.risk_level?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "11px", color: s.mfa_passed ? "#30d158" : "#ff2d55" }}>
                    {s.mfa_passed ? "✓" : "✗"}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                        <div style={{ height: "100%", width: `${s.behavioral_score}%`, background: s.behavioral_score > 70 ? "#30d158" : "#ffd60a", borderRadius: "2px" }} />
                      </div>
                      <span style={{ fontSize: "10px", color: "#8aa8c8" }}>{s.behavioral_score}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: "11px", color: "#8aa8c8" }}>{s.actions}</td>
                  <td style={{ padding: "10px 12px", fontSize: "10px", color: "#4a6b8a" }}>
                    {new Date(s.login_time).toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "20px" }}>
        {[
          { title: "MFA Status", desc: "TOTP & Hardware Key enforced on all admin accounts", status: "ACTIVE", icon: "🔑", color: "#30d158" },
          { title: "Device Fingerprinting", desc: "Browser fingerprint + hardware hash tracked per user", status: "ACTIVE", icon: "🖥", color: "#00d4ff" },
          { title: "Geo-Anomaly Detection", desc: "Login from unusual country/IP range flagged instantly", status: "ACTIVE", icon: "🌍", color: "#5e5ce6" },
        ].map(c => (
          <div key={c.title} style={{
            background: "rgba(8,15,30,0.8)", border: `1px solid ${c.color}25`,
            borderRadius: "12px", padding: "18px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{c.icon}</div>
            <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "700", marginBottom: "6px" }}>{c.title}</div>
            <div style={{ fontSize: "11px", color: "#4a6b8a", marginBottom: "12px" }}>{c.desc}</div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "3px 10px", borderRadius: "20px",
              background: `${c.color}15`, border: `1px solid ${c.color}30`,
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
              <span style={{ fontSize: "10px", color: c.color, fontWeight: "700" }}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AccessControl;