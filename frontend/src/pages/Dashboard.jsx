import { useState, useEffect } from "react";
import { apiFetch, SEVERITY_COLORS, timeAgo } from "../utils/api";

function MetricCard({ label, value, unit, color = "#00d4ff", sub }) {
  return (
    <div style={{
      background: "rgba(8,15,30,0.8)",
      border: `1px solid ${color}25`,
      borderRadius: "12px", padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "80px", height: "80px",
        background: `radial-gradient(circle at 100% 0%, ${color}10 0%, transparent 70%)`,
      }} />
      <div style={{ fontSize: "10px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "28px", fontWeight: "800", color }}>
        {value}<span style={{ fontSize: "14px", color: "#4a6b8a", marginLeft: "4px" }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: "10px", color: "#4a6b8a", marginTop: "6px" }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", color: "#8aa8c8" }}>{label}</span>
        <span style={{ fontSize: "11px", color, fontWeight: "700" }}>{value}%</span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: "3px",
          transition: "width 0.8s ease",
          boxShadow: `0 0 8px ${color}`,
        }} />
      </div>
    </div>
  );
}

export default function Dashboard({ liveFeed }) {
  const [data, setData] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [overview, met] = await Promise.all([
        apiFetch("/api/dashboard/overview"),
        apiFetch("/api/monitoring/metrics"),
      ]);
      if (overview) setData(overview);
      if (met) setMetrics(met);
    };
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  const m = data?.metrics || {};
  const ts = data?.threat_summary || {};
  const score = data?.security_score || 88;

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>Command Center</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0", letterSpacing: "1px" }}>
          REAL-TIME SECURITY OPERATIONS · AI-POWERED THREAT DETECTION
        </p>
      </div>

      {/* Security Score Ring */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{
          background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ position: "relative", width: "120px", height: "120px" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="8"/>
              <circle cx="60" cy="60" r="50" fill="none"
                stroke={score >= 90 ? "#30d158" : score >= 70 ? "#ffd60a" : "#ff2d55"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 314} 314`}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dasharray 1s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#00d4ff" }}>{score}</div>
              <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>SHIELD</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: "#8aa8c8", marginTop: "8px", textAlign: "center" }}>
            Security Score
          </div>
          <div style={{ fontSize: "9px", color: "#30d158", marginTop: "4px" }}>↑ +2.3% from yesterday</div>
        </div>

        {/* Threat Summary Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <MetricCard label="THREATS TODAY" value={ts.total_threats_today || "3,241"} color="#ff6b35" sub="↑ Active monitoring" />
          <MetricCard label="CRITICAL ALERTS" value={ts.critical || 24} color="#ff2d55" sub="Requires attention" />
          <MetricCard label="THREATS BLOCKED" value={ts.blocked || 892} color="#30d158" sub="Auto-response active" />
          <MetricCard label="CPU USAGE" value={m.cpu_usage || 48} unit="%" color="#0a84ff" sub="8 cores monitored" />
          <MetricCard label="NETWORK IN/OUT" value={`${m.network_in || 420}`} unit="Mbps" color="#5e5ce6" sub={`Out: ${m.network_out || 180} Mbps`} />
          <MetricCard label="ACTIVE SESSIONS" value={(m.active_connections || 1240).toLocaleString()} color="#ffd60a" sub="Across all endpoints" />
        </div>
      </div>

      {/* System Health Bars */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{
          background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: "12px", padding: "20px",
        }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>SYSTEM HEALTH</div>
          <ProgressBar label="CPU Load" value={m.cpu_usage || 48} max={100} color="#0a84ff" />
          <ProgressBar label="Memory Usage" value={m.memory_usage || 62} max={100} color="#5e5ce6" />
          <ProgressBar label="Disk I/O" value={34} max={100} color="#30d158" />
          <ProgressBar label="Network Saturation" value={28} max={100} color="#ff6b35" />
        </div>

        <div style={{
          background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: "12px", padding: "20px",
        }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>SECURITY POSTURE</div>
          <ProgressBar label="Zero Trust Score" value={data?.zero_trust_score || 91} max={100} color="#00d4ff" />
          <ProgressBar label="Compliance Score" value={data?.compliance_score || 96} max={100} color="#30d158" />
          <ProgressBar label="Patch Coverage" value={87} max={100} color="#ffd60a" />
          <ProgressBar label="Endpoint Protection" value={99} max={100} color="#30d158" />
        </div>
      </div>

      {/* Recent Threats Table */}
      <div style={{
        background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
        borderRadius: "12px", padding: "20px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px" }}>RECENT THREAT EVENTS</div>
          <div style={{
            padding: "3px 10px", borderRadius: "20px",
            background: "rgba(255,45,85,0.15)", border: "1px solid rgba(255,45,85,0.3)",
            fontSize: "9px", color: "#ff2d55", fontWeight: "700", letterSpacing: "1px",
          }}>● LIVE</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "TYPE", "SEVERITY", "SOURCE", "RISK", "STATUS", "TIME"].map(h => (
                <th key={h} style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", textAlign: "left", padding: "0 8px 8px", borderBottom: "1px solid rgba(0,212,255,0.1)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(liveFeed.slice(0, 8)).map((t, i) => {
              const c = SEVERITY_COLORS[t.severity] || "#8aa8c8";
              return (
                <tr key={t.id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "8px", fontSize: "10px", color: "#4a6b8a" }}>{t.id}</td>
                  <td style={{ padding: "8px", fontSize: "11px", color: "#8aa8c8", fontWeight: "600" }}>{t.attack_type}</td>
                  <td style={{ padding: "8px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "4px", background: `${c}20`, color: c, fontSize: "10px", fontWeight: "700" }}>
                      {t.severity?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "8px", fontSize: "10px", color: "#4a6b8a" }}>{t.src_country}</td>
                  <td style={{ padding: "8px", fontSize: "11px", color: c, fontWeight: "700" }}>{t.risk_score}</td>
                  <td style={{ padding: "8px" }}>
                    <span style={{ fontSize: "10px", color: t.blocked ? "#30d158" : "#ff6b35" }}>
                      {t.blocked ? "✓ Blocked" : "⚠ Active"}
                    </span>
                  </td>
                  <td style={{ padding: "8px", fontSize: "10px", color: "#4a6b8a" }}>{timeAgo(t.timestamp)}</td>
                </tr>
              );
            })}
            {liveFeed.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#4a6b8a", fontSize: "11px" }}>Loading threat data...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}