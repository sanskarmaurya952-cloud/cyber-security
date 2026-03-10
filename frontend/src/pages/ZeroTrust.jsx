import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
export default function ZeroTrust() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const load = async () => { const d = await apiFetch("/api/zerotrust/policy"); if (d) setData(d); };
    load(); const id = setInterval(load, 12000); return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>🛡️ Zero Trust Adaptive Security</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>Never trust, always verify · Continuous identity & device validation</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "TRUST SCORE", value: `${data?.trust_score || 92}/100`, color: "#30d158" },
          { label: "ACTIVE POLICIES", value: data?.policies_active || 186, color: "#00d4ff" },
          { label: "MICRO-SEGMENTS", value: data?.micro_segments || 67, color: "#5e5ce6" },
          { label: "DENIED TODAY", value: (data?.denied_requests || 847).toLocaleString(), color: "#ff2d55" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(8,15,30,0.8)", border: `1px solid ${s.color}25`, borderRadius: "10px", padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>VERIFICATION STATUS</div>
          {[
            { label: "Identity Verified", value: data?.identity_verified, icon: "👤" },
            { label: "Device Compliant", value: data?.device_compliant, icon: "💻" },
            { label: "Network Trusted", value: data?.network_trusted, icon: "🌐" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: "12px", color: "#8aa8c8" }}>{item.label}</span>
              </div>
              <span style={{ fontSize: "11px", color: item.value ? "#30d158" : "#ff2d55", fontWeight: "700" }}>
                {item.value ? "✓ VERIFIED" : "✗ FAILED"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>ZERO TRUST PRINCIPLES</div>
          {(data?.principles || []).map(p => (
            <div key={p.name} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#8aa8c8" }}>{p.name}</span>
                <span style={{ fontSize: "11px", color: "#00d4ff", fontWeight: "700" }}>{p.coverage}%</span>
              </div>
              <div style={{ height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${p.coverage}%`, background: "linear-gradient(90deg, #0066ff, #00d4ff)", borderRadius: "3px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>ACCESS DECISIONS TODAY</div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#30d158" }}>{((data?.access_decisions_today || 150000) - (data?.denied_requests || 847)).toLocaleString()}</div>
            <div style={{ fontSize: "10px", color: "#4a6b8a" }}>APPROVED</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#ff2d55" }}>{(data?.denied_requests || 847).toLocaleString()}</div>
            <div style={{ fontSize: "10px", color: "#4a6b8a" }}>DENIED</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "800", color: "#00d4ff" }}>{(data?.access_decisions_today || 150000).toLocaleString()}</div>
            <div style={{ fontSize: "10px", color: "#4a6b8a" }}>TOTAL</div>
          </div>
        </div>
      </div>
    </div>
  );
}