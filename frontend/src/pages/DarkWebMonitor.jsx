import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
export default function DarkWebMonitor() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = async () => { const d = await apiFetch("/api/intelligence/darkweb"); if (d) setData(d); };
    load(); const id = setInterval(load, 20000); return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>🕸️ Dark Web Threat Intelligence</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>Monitoring dark web markets, paste sites, and Tor forums for leaked data</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "MONITORED KEYWORDS", value: data?.monitored_keywords || 847, color: "#5e5ce6" },
          { label: "ACTIVE SOURCES", value: data?.sources_active || 234, color: "#00d4ff" },
          { label: "NEW ALERTS", value: data?.alerts?.length || 0, color: "#ff2d55" },
          { label: "EXPOSURE SCORE", value: `${data?.breach_exposure_score || 42}/100`, color: "#ffd60a" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(8,15,30,0.8)", border: `1px solid ${s.color}25`, borderRadius: "10px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
        {(data?.alerts || []).map((alert, i) => {
          const c = SEVERITY_COLORS[alert.severity] || "#8aa8c8";
          return (
            <div key={i} style={{ background: "rgba(8,15,30,0.8)", border: `1px solid ${c}30`, borderRadius: "12px", padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "4px", background: `${c}20`, color: c, fontSize: "9px", fontWeight: "700" }}>
                      {alert.severity?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "11px", color: "#5e5ce6" }}>{alert.source}</span>
                    {alert.verified && <span style={{ fontSize: "9px", color: "#30d158", padding: "1px 6px", background: "rgba(48,209,88,0.1)", borderRadius: "3px" }}>✓ VERIFIED</span>}
                  </div>
                  <div style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "700", textTransform: "capitalize" }}>
                    {alert.type?.replace(/_/g, " ")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "#ff2d55", fontWeight: "700" }}>${alert.price_usd?.toLocaleString()}</div>
                  <div style={{ fontSize: "10px", color: "#4a6b8a" }}>listed price</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "24px" }}>
                <div><span style={{ fontSize: "10px", color: "#4a6b8a" }}>Records: </span><span style={{ fontSize: "11px", color: "#e2e8f0", fontWeight: "600" }}>{alert.affected_records?.toLocaleString()}</span></div>
                <div><span style={{ fontSize: "10px", color: "#4a6b8a" }}>Data Types: </span><span style={{ fontSize: "11px", color: "#8aa8c8" }}>{alert.data_types?.join(", ")}</span></div>
                <div><span style={{ fontSize: "10px", color: "#4a6b8a" }}>Detected: </span><span style={{ fontSize: "11px", color: "#8aa8c8" }}>{timeAgo(alert.timestamp)}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}