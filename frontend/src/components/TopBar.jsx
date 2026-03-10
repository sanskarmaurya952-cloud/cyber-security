import { useState, useEffect } from "react";

const LEVEL_COLORS = {
  LOW: "#30d158", MODERATE: "#ffd60a", HIGH: "#ff6b35", CRITICAL: "#ff2d55"
};

export default function TopBar({ auth, threatLevel, onMenuToggle, onLogout }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const color = LEVEL_COLORS[threatLevel] || "#ffd60a";

  return (
    <div style={{
      height: "56px",
      background: "rgba(8,15,30,0.95)",
      borderBottom: "1px solid rgba(0,212,255,0.1)",
      display: "flex", alignItems: "center",
      padding: "0 20px", gap: "16px",
      backdropFilter: "blur(10px)",
      flexShrink: 0,
    }}>
      <button onClick={onMenuToggle} style={{
        background: "none", border: "none", color: "#4a6b8a",
        cursor: "pointer", fontSize: "18px", padding: "4px",
        display: "flex", alignItems: "center",
      }}>☰</button>

      {/* Threat Level Badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "4px 12px", borderRadius: "6px",
        background: `${color}18`,
        border: `1px solid ${color}40`,
      }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: color, boxShadow: `0 0 8px ${color}`,
          animation: threatLevel === "CRITICAL" ? "pulse 0.8s infinite" : "pulse 2s infinite",
        }} />
        <span style={{ fontSize: "11px", color, fontWeight: "700", letterSpacing: "1px" }}>
          THREAT: {threatLevel}
        </span>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "24px", flex: 1, justifyContent: "center" }}>
        {[
          { label: "SHIELDS ACTIVE", value: "1,847" },
          { label: "THREATS TODAY", value: "3,241" },
          { label: "BLOCKED", value: "2,891" },
          { label: "AI ACCURACY", value: "94.2%" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#00d4ff", fontWeight: "700" }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Time */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "14px", color: "#8aa8c8", fontVariantNumeric: "tabular-nums" }}>
          {time.toLocaleTimeString()}
        </div>
        <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>UTC {time.toLocaleDateString()}</div>
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{
        background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)",
        color: "#ff2d55", padding: "6px 14px", borderRadius: "6px",
        cursor: "pointer", fontSize: "11px", fontWeight: "600",
        letterSpacing: "1px", fontFamily: "inherit",
      }}>LOGOUT</button>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}