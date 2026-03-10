const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Command Center" },
  { id: "threats", icon: "⚡", label: "Threat Detection" },
  { id: "map", icon: "🌐", label: "Attack Map" },
  { id: "phishing", icon: "🎣", label: "Phishing Engine" },
  { id: "access", icon: "🔐", label: "Access Control" },
  { id: "incidents", icon: "🚨", label: "Incident Response" },
  { id: "intelligence", icon: "🧠", label: "AI Intelligence" },
  { id: "simulator", icon: "⚔️", label: "Attack Simulator" },
  { id: "darkweb", icon: "🕸️", label: "Dark Web Monitor" },
  { id: "zerotrust", icon: "🛡️", label: "Zero Trust" },
  { id: "encryption", icon: "🔒", label: "Encryption Layer" },
  { id: "logs", icon: "📋", label: "Security Logs" },
];

export default function Sidebar({ page, setPage, open, auth }) {
  return (
    <div style={{
      width: open ? "240px" : "64px",
      background: "linear-gradient(180deg, #080f1e 0%, #050a14 100%)",
      borderRight: "1px solid rgba(0,212,255,0.1)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.3s ease",
      overflow: "hidden",
      flexShrink: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: open ? "24px 20px" : "20px 16px",
        borderBottom: "1px solid rgba(0,212,255,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minHeight: "72px",
      }}>
        <div style={{
          width: "36px", height: "36px", flexShrink: 0,
          background: "linear-gradient(135deg, #00d4ff, #0066ff)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", boxShadow: "0 0 20px rgba(0,212,255,0.4)",
        }}>🛡</div>
        {open && (
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#00d4ff", letterSpacing: "1px" }}>CYBER SHIELD</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "2px" }}>AI PLATFORM v2.0</div>
          </div>
        )}
      </div>

      {/* User Badge */}
      {open && auth && (
        <div style={{
          margin: "12px 12px 4px",
          padding: "10px 12px",
          background: "rgba(0,212,255,0.05)",
          borderRadius: "8px",
          border: "1px solid rgba(0,212,255,0.1)",
        }}>
          <div style={{ fontSize: "10px", color: "#4a6b8a", marginBottom: "2px" }}>LOGGED IN AS</div>
          <div style={{ fontSize: "12px", color: "#00d4ff" }}>{auth.user?.username?.toUpperCase()}</div>
          <div style={{
            display: "inline-block", marginTop: "4px",
            padding: "1px 6px", borderRadius: "4px",
            background: "rgba(0,212,255,0.2)",
            fontSize: "9px", color: "#00d4ff", letterSpacing: "1px",
          }}>{auth.user?.role?.toUpperCase()}</div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "8px 8px", overflow: "auto" }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: "12px", padding: open ? "10px 12px" : "10px",
              marginBottom: "2px", background: page === item.id
                ? "linear-gradient(90deg, rgba(0,212,255,0.15), rgba(0,102,255,0.1))"
                : "transparent",
              border: page === item.id ? "1px solid rgba(0,212,255,0.25)" : "1px solid transparent",
              borderRadius: "8px", cursor: "pointer",
              color: page === item.id ? "#00d4ff" : "#4a6b8a",
              fontSize: "13px", textAlign: "left",
              transition: "all 0.2s", whiteSpace: "nowrap",
              justifyContent: open ? "flex-start" : "center",
            }}
            onMouseEnter={e => { if (page !== item.id) e.currentTarget.style.color = "#8aa8c8"; }}
            onMouseLeave={e => { if (page !== item.id) e.currentTarget.style.color = "#4a6b8a"; }}
          >
            <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
            {open && <span style={{ fontSize: "12px", fontWeight: page === item.id ? "600" : "400" }}>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Status indicator */}
      {open && (
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(0,212,255,0.1)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#30d158",
            boxShadow: "0 0 8px #30d158",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: "10px", color: "#4a6b8a" }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      )}
    </div>
  );
}