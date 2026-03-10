import { useState, useEffect, useRef } from "react";
import { apiFetch, SEVERITY_COLORS } from "../utils/api";

// Simplified world map paths for major continents
const CONTINENTS = [
  { id: "na", d: "M 80 85 L 120 75 L 175 80 L 190 110 L 185 140 L 170 150 L 155 145 L 145 155 L 130 160 L 110 150 L 95 140 L 85 120 Z", label: "N.America" },
  { id: "sa", d: "M 145 165 L 165 158 L 180 175 L 185 220 L 175 255 L 160 265 L 148 255 L 140 235 L 138 200 L 140 178 Z", label: "S.America" },
  { id: "eu", d: "M 295 60 L 335 55 L 360 65 L 370 80 L 355 90 L 335 95 L 310 88 L 290 80 Z", label: "Europe" },
  { id: "af", d: "M 305 110 L 360 105 L 385 115 L 390 150 L 375 195 L 355 220 L 330 225 L 310 210 L 295 180 L 295 140 L 298 115 Z", label: "Africa" },
  { id: "as", d: "M 370 55 L 450 45 L 520 50 L 560 70 L 565 100 L 540 115 L 510 120 L 480 110 L 450 115 L 420 110 L 395 95 L 375 85 Z", label: "Asia" },
  { id: "au", d: "M 490 185 L 545 180 L 565 190 L 570 215 L 560 235 L 535 240 L 508 232 L 490 215 L 487 198 Z", label: "Oceania" },
];

function latLngToXY(lat, lng) {
  const x = ((lng + 180) / 360) * 660 + 30;
  const y = ((90 - lat) / 180) * 320 + 20;
  return { x, y };
}

function AttackLine({ src, dst, color, animating }) {
  const mid = { x: (src.x + dst.x) / 2, y: Math.min(src.y, dst.y) - 40 };
  const path = `M ${src.x} ${src.y} Q ${mid.x} ${mid.y} ${dst.x} ${dst.y}`;
  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6"
        strokeDasharray="4 2" style={{ animation: animating ? "dash 1.5s linear infinite" : "none" }} />
      <circle cx={dst.x} cy={dst.y} r="4" fill={color} opacity="0.8">
        <animate attributeName="r" values="4;10;4" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export default function AttackMap() {
  const [attacks, setAttacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const load = async () => {
      const data = await apiFetch("/api/threats/map");
      if (data) {
        setAttacks(data.attacks || []);
        setStats({ countries: data.total_countries, campaigns: data.active_campaigns });
      }
    };
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>🌐 Global Cyber Attack Map</h1>
          <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>Real-time visualization of worldwide cyber attack activity</p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { label: "ACTIVE ATTACKS", value: attacks.length, color: "#ff2d55" },
            { label: "COUNTRIES HIT", value: stats.countries || 47, color: "#ffd60a" },
            { label: "CAMPAIGNS", value: stats.campaigns || 16, color: "#ff6b35" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(8,15,30,0.8)", border: `1px solid ${s.color}30`,
              borderRadius: "8px", padding: "10px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{
        background: "rgba(8,15,30,0.9)", border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: "16px", padding: "16px", marginBottom: "20px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <svg width="100%" viewBox="0 0 720 360" style={{ display: "block" }}>
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0066ff" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#050a14" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="720" height="360" fill="url(#mapGlow)" />

          {/* Continents */}
          {CONTINENTS.map(c => (
            <path key={c.id} d={c.d} fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.2)"
              strokeWidth="1" />
          ))}

          {/* Attack Lines */}
          {attacks.slice(0, 20).map((attack, i) => {
            const src = latLngToXY(attack.src_lat, attack.src_lng);
            const dst = latLngToXY(attack.dst_lat, attack.dst_lng);
            const color = SEVERITY_COLORS[attack.severity] || "#ff6b35";
            return (
              <AttackLine key={i} src={src} dst={dst} color={color} animating={i < 5} />
            );
          })}

          {/* Attack Source Points */}
          {attacks.slice(0, 20).map((attack, i) => {
            const pos = latLngToXY(attack.src_lat, attack.src_lng);
            const color = SEVERITY_COLORS[attack.severity] || "#ff6b35";
            return (
              <g key={`src-${i}`} style={{ cursor: "pointer" }} onClick={() => setSelected(attack)}>
                <circle cx={pos.x} cy={pos.y} r="3" fill={color} />
                <circle cx={pos.x} cy={pos.y} r="8" fill={color} opacity="0.15" />
              </g>
            );
          })}
        </svg>

        <style>{`
          @keyframes dash { to { stroke-dashoffset: -20; } }
        `}</style>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        {["critical", "high", "medium", "low"].map(sev => (
          <div key={sev} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: SEVERITY_COLORS[sev],
              boxShadow: `0 0 6px ${SEVERITY_COLORS[sev]}`,
            }} />
            <span style={{ fontSize: "11px", color: "#8aa8c8", textTransform: "capitalize" }}>{sev}</span>
          </div>
        ))}
      </div>

      {/* Attack List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {attacks.slice(0, 8).map((attack, i) => {
          const c = SEVERITY_COLORS[attack.severity] || "#8aa8c8";
          return (
            <div key={i} style={{
              background: "rgba(8,15,30,0.8)", border: `1px solid ${c}25`,
              borderRadius: "10px", padding: "14px",
              cursor: "pointer",
              outline: selected?.id === attack.id ? `1px solid ${c}` : "none",
            }} onClick={() => setSelected(attack === selected ? null : attack)}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "700" }}>{attack.attack_type}</span>
                <span style={{
                  padding: "2px 8px", borderRadius: "4px",
                  background: `${c}20`, color: c,
                  fontSize: "9px", fontWeight: "700",
                }}>{attack.severity?.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#4a6b8a" }}>
                {attack.src_country} → {attack.dst_country}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "10px", color: "#8aa8c8" }}>Risk: <strong style={{ color: c }}>{attack.risk_score}</strong></span>
                <span style={{ fontSize: "10px", color: attack.blocked ? "#30d158" : "#ff6b35" }}>
                  {attack.blocked ? "✓ Blocked" : "⚠ Active"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Attack Detail */}
      {selected && (
        <div style={{
          marginTop: "16px",
          background: "rgba(8,15,30,0.9)", border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: "12px", padding: "20px",
        }}>
          <div style={{ fontSize: "13px", color: "#00d4ff", fontWeight: "700", marginBottom: "12px" }}>
            ATTACK DETAILS: {selected.id}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              ["Attack Type", selected.attack_type],
              ["Source IP", selected.src_ip],
              ["Origin", selected.src_country],
              ["Target", selected.dst_country],
              ["Risk Score", selected.risk_score],
              ["AI Confidence", `${((selected.ai_confidence || 0.9) * 100).toFixed(1)}%`],
              ["MITRE", selected.mitre_technique],
              ["Status", selected.blocked ? "Blocked" : "Active"],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>{k}</div>
                <div style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "600", marginTop: "2px" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}