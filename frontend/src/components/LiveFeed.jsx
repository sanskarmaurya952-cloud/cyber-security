import { SEVERITY_COLORS, timeAgo } from "../utils/api";

export default function LiveFeed({ feed }) {
  return (
    <div style={{
      width: "280px",
      background: "linear-gradient(180deg, #080f1e 0%, #050a14 100%)",
      borderLeft: "1px solid rgba(0,212,255,0.1)",
      display: "flex", flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid rgba(0,212,255,0.1)",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <div style={{
          width: "8px", height: "8px", borderRadius: "50%",
          background: "#ff2d55", boxShadow: "0 0 8px #ff2d55",
          animation: "livePulse 1s infinite",
        }} />
        <span style={{ fontSize: "11px", color: "#00d4ff", fontWeight: "700", letterSpacing: "2px" }}>LIVE FEED</span>
        <span style={{
          marginLeft: "auto", background: "rgba(255,45,85,0.2)",
          color: "#ff2d55", padding: "2px 6px", borderRadius: "4px",
          fontSize: "10px", fontWeight: "700",
        }}>{feed.length}</span>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
        {feed.length === 0 ? (
          <div style={{ color: "#4a6b8a", fontSize: "11px", textAlign: "center", padding: "20px 10px" }}>
            Waiting for live events...
          </div>
        ) : feed.map((item, i) => {
          const color = SEVERITY_COLORS[item.severity] || "#8aa8c8";
          return (
            <div key={item.id || i} style={{
              padding: "10px 10px",
              marginBottom: "4px",
              borderRadius: "6px",
              background: `${color}08`,
              border: `1px solid ${color}25`,
              animation: i === 0 ? "fadeIn 0.3s ease" : "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{
                  fontSize: "9px", fontWeight: "700", color,
                  letterSpacing: "1px", textTransform: "uppercase",
                }}>{item.severity}</span>
                <span style={{ fontSize: "9px", color: "#4a6b8a" }}>{timeAgo(item.timestamp)}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#8aa8c8", marginBottom: "2px", fontWeight: "600" }}>
                {item.attack_type}
              </div>
              <div style={{ fontSize: "10px", color: "#4a6b8a" }}>
                {item.src_country} → {item.dst_country}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "9px", color: "#4a6b8a" }}>{item.src_ip}</span>
                <span style={{
                  fontSize: "9px", color: item.blocked ? "#30d158" : "#ff6b35",
                  fontWeight: "700",
                }}>{item.blocked ? "✓ BLOCKED" : "⚠ ACTIVE"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}