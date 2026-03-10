import { useState, useEffect, useCallback } from "react";
import Dashboard from "./pages/Dashboard";
import ThreatDetection from "./pages/ThreatDetection";
import AttackMap from "./pages/AttackMap";
import PhishingEngine from "./pages/PhishingEngine";
import AccessControl from "./pages/AccessControl";
import IncidentResponse from "./pages/IncidentResponse";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import CyberSimulator from "./pages/CyberSimulator";
import DarkWebMonitor from "./pages/DarkWebMonitor";
import ZeroTrust from "./pages/ZeroTrust";
import EncryptionLayer from "./pages/EncryptionLayer";
import SecurityLogs from "./pages/SecurityLogs";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import LiveFeed from "./components/LiveFeed";
import { API_BASE } from "./utils/api";

const PAGES = {
  dashboard: Dashboard,
  threats: ThreatDetection,
  map: AttackMap,
  phishing: PhishingEngine,
  access: AccessControl,
  incidents: IncidentResponse,
  intelligence: ThreatIntelligence,
  simulator: CyberSimulator,
  darkweb: DarkWebMonitor,
  zerotrust: ZeroTrust,
  encryption: EncryptionLayer,
  logs: SecurityLogs,
};

export default function App() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [liveFeed, setLiveFeed] = useState([]);
  const [ws, setWs] = useState(null);
  const [threatLevel, setThreatLevel] = useState("MODERATE");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const connectWS = useCallback(() => {
    try {
      const socket = new WebSocket(`${API_BASE.replace("http", "ws")}/ws/live`);
      socket.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "threat") {
            setLiveFeed(prev => [msg.data, ...prev].slice(0, 50));
            if (msg.data.severity === "critical") setThreatLevel("CRITICAL");
          } else if (msg.type === "metrics") {
            setThreatLevel(msg.data.threat_level || "MODERATE");
          }
        } catch {}
      };
      socket.onclose = () => setTimeout(connectWS, 5000);
      setWs(socket);
      return socket;
    } catch {
      setTimeout(connectWS, 5000);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("cyber_auth");
    if (saved) {
      try { setAuth(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (auth) {
      const socket = connectWS();
      return () => socket?.close();
    }
  }, [auth, connectWS]);

  if (!auth) {
    return <LoginPage onLogin={(data) => {
      setAuth(data);
      localStorage.setItem("cyber_auth", JSON.stringify(data));
    }} />;
  }

  const PageComponent = PAGES[page] || Dashboard;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#050a14", color: "#e2e8f0", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflow: "hidden" }}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} auth={auth} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.3s" }}>
        <TopBar
          auth={auth}
          threatLevel={threatLevel}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onLogout={() => { setAuth(null); localStorage.removeItem("cyber_auth"); ws?.close(); }}
        />
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
          <PageComponent auth={auth} liveFeed={liveFeed} />
        </div>
      </div>
      <LiveFeed feed={liveFeed} />
    </div>
  );
}