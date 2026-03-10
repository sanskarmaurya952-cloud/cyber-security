import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function LoginPage({ onLogin }) {
  const [step, setStep] = useState("credentials"); // credentials | mfa
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [mfa, setMfa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingData, setPendingData] = useState(null);

  async function handleLogin() {
    setLoading(true); setError("");
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!data) { setError("Connection failed. Using demo mode."); setTimeout(() => onLogin({ user: { username: form.username, role: "admin" }, access_token: "demo" }), 1000); return; }
    if (data.mfa_required) { setPendingData(data); setStep("mfa"); }
    else onLogin(data);
  }

  async function handleMFA() {
    setLoading(true); setError("");
    const res = await apiFetch("/api/auth/mfa/verify", { method: "POST", body: JSON.stringify({ code: mfa }) });
    setLoading(false);
    if (res?.verified) onLogin(pendingData);
    else setError("Invalid MFA code. Try: 123456");
  }

  return (
    <div style={{
      height: "100vh", background: "#050a14",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.05,
        backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "420px", position: "relative",
        background: "rgba(8,15,30,0.9)",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: "16px", padding: "40px",
        boxShadow: "0 0 60px rgba(0,102,255,0.15), 0 0 0 1px rgba(0,212,255,0.05)",
        backdropFilter: "blur(20px)",
      }}>
        {/* Shield icon */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,102,255,0.2))",
            border: "1px solid rgba(0,212,255,0.3)",
            fontSize: "32px", marginBottom: "16px",
            boxShadow: "0 0 30px rgba(0,212,255,0.2)",
          }}>🛡</div>
          <div style={{ fontSize: "22px", fontWeight: "800", color: "#00d4ff", letterSpacing: "2px" }}>CYBER SHIELD</div>
          <div style={{ fontSize: "10px", color: "#4a6b8a", letterSpacing: "3px", marginTop: "4px" }}>AI-POWERED SECURITY PLATFORM</div>
        </div>

        {step === "credentials" ? (
          <>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "6px" }}>USERNAME</label>
              <input
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                style={inputStyle}
                placeholder="admin"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "6px" }}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={inputStyle}
                placeholder="••••••••"
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button onClick={handleLogin} disabled={loading} style={btnStyle}>
              {loading ? "AUTHENTICATING..." : "SECURE LOGIN →"}
            </button>
            <div style={{ marginTop: "16px", fontSize: "10px", color: "#4a6b8a", textAlign: "center" }}>
              Demo: admin/admin123 · analyst/analyst123 · viewer/viewer123
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "24px", fontSize: "12px", color: "#8aa8c8" }}>
              MFA required. Enter your 6-digit code.
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "6px" }}>MFA CODE</label>
              <input
                value={mfa}
                onChange={e => setMfa(e.target.value)}
                style={{ ...inputStyle, textAlign: "center", fontSize: "20px", letterSpacing: "8px" }}
                placeholder="000000"
                maxLength={6}
                onKeyDown={e => e.key === "Enter" && handleMFA()}
              />
            </div>
            <button onClick={handleMFA} disabled={loading} style={btnStyle}>
              {loading ? "VERIFYING..." : "VERIFY CODE →"}
            </button>
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#4a6b8a", textAlign: "center" }}>Demo code: 123456</div>
          </>
        )}

        {error && (
          <div style={{
            marginTop: "12px", padding: "10px 12px",
            background: "rgba(255,45,85,0.1)", border: "1px solid rgba(255,45,85,0.3)",
            borderRadius: "6px", fontSize: "11px", color: "#ff2d55", textAlign: "center",
          }}>{error}</div>
        )}

        {/* Security badges */}
        <div style={{ display: "flex", gap: "8px", marginTop: "24px", justifyContent: "center" }}>
          {["AES-256", "TLS 1.3", "ZERO TRUST", "MFA"].map(badge => (
            <span key={badge} style={{
              padding: "3px 8px", borderRadius: "4px",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.15)",
              fontSize: "9px", color: "#4a6b8a",
            }}>{badge}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px",
  background: "rgba(0,212,255,0.05)",
  border: "1px solid rgba(0,212,255,0.2)",
  borderRadius: "8px", color: "#e2e8f0",
  fontSize: "13px", fontFamily: "inherit",
  outline: "none", boxSizing: "border-box",
};

const btnStyle = {
  width: "100%", padding: "12px",
  background: "linear-gradient(135deg, #0066ff, #00d4ff)",
  border: "none", borderRadius: "8px",
  color: "#fff", fontSize: "12px",
  fontWeight: "700", letterSpacing: "2px",
  cursor: "pointer", fontFamily: "inherit",
  boxShadow: "0 0 20px rgba(0,102,255,0.3)",
};