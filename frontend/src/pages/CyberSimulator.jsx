export default function CyberSimulator() {
  const [sims, setSims] = useState([]);
  const [running, setRunning] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(null);

  useEffect(() => {
    apiFetch("/api/simulator/attacks").then(d => { if (d) { setSims(d.available_simulations || []); setScore(d.last_score); } });
  }, []);

  async function runSim(id) {
    setRunning(id); setResult(null);
    const data = await apiFetch("/api/simulator/run", { method: "POST", body: JSON.stringify({ simulation_id: id }) });
    setRunning(null); if (data) setResult(data);
  }

  const gradeColor = { A: "#30d158", B: "#00d4ff", C: "#ffd60a", D: "#ff6b35", F: "#ff2d55" };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>⚔️ Cyber Attack Simulator</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>Test security posture with realistic attack simulations · Security Readiness Score</p>
      </div>

      {result && (
        <div style={{ background: "rgba(8,15,30,0.9)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "72px", fontWeight: "900", color: gradeColor[result.grade] || "#00d4ff" }}>{result.grade}</div>
              <div style={{ fontSize: "11px", color: "#4a6b8a" }}>READINESS GRADE</div>
            </div>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
                {[
                  { label: "READINESS SCORE", value: result.security_readiness_score, color: gradeColor[result.grade] },
                  { label: "VULNS FOUND", value: result.vulnerabilities_found, color: result.vulnerabilities_found > 3 ? "#ff2d55" : "#30d158" },
                  { label: "MTTD (sec)", value: result.mean_time_to_detect_sec, color: "#00d4ff" },
                  { label: "MTTR (sec)", value: result.mean_time_to_respond_sec, color: "#5e5ce6" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {result.recommendations?.length > 0 && (
                <div>
                  <div style={{ fontSize: "10px", color: "#4a6b8a", marginBottom: "6px" }}>RECOMMENDATIONS:</div>
                  {result.recommendations.map((r, i) => (
                    <div key={i} style={{ padding: "6px 10px", marginBottom: "4px", background: "rgba(0,212,255,0.05)", borderRadius: "6px", fontSize: "11px", color: "#8aa8c8" }}>
                      → {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {sims.map(sim => (
          <div key={sim.id} style={{ background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "12px", padding: "18px" }}>
            <div style={{ fontSize: "14px", color: "#e2e8f0", fontWeight: "700", marginBottom: "6px" }}>{sim.name}</div>
            <div style={{ fontSize: "11px", color: "#4a6b8a", marginBottom: "4px" }}>
              Duration: <span style={{ color: "#8aa8c8" }}>{sim.duration_sec}s</span>
            </div>
            <div style={{ fontSize: "11px", color: "#4a6b8a", marginBottom: "16px" }}>
              Category: <span style={{ color: "#5e5ce6", textTransform: "capitalize" }}>{sim.category}</span>
            </div>
            <button onClick={() => runSim(sim.id)} disabled={!!running} style={{
              width: "100%", padding: "10px",
              background: running === sim.id ? "rgba(255,45,85,0.2)" : "rgba(0,212,255,0.1)",
              border: `1px solid ${running === sim.id ? "rgba(255,45,85,0.4)" : "rgba(0,212,255,0.3)"}`,
              borderRadius: "8px", color: running === sim.id ? "#ff2d55" : "#00d4ff",
              cursor: running ? "not-allowed" : "pointer", fontSize: "11px",
              fontWeight: "700", letterSpacing: "1px", fontFamily: "inherit",
            }}>
              {running === sim.id ? "⚡ RUNNING..." : "▶ RUN SIMULATION"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}