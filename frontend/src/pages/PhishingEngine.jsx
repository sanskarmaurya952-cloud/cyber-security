import { useState } from "react";
import { apiFetch } from "../utils/api";

export default function PhishingEngine() {
  const [url, setUrl] = useState("");
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("url");

  const SAMPLES = {
    url: ["https://paypa1-secure-login.com/account", "https://g00gle-verify.net/update", "https://microsoft.com", "https://amazon-prize-winner.xyz/claim"],
    email: [
      "URGENT: Your account has been suspended. Click here immediately to verify your identity or lose access forever.",
      "Hello, this is a normal business email regarding our upcoming quarterly meeting.",
      "Your package could not be delivered. Please provide your credit card details to reschedule delivery.",
    ]
  };

  async function analyze() {
    if (!url && !emailText) return;
    setLoading(true);
    const data = await apiFetch("/api/phishing/analyze", {
      method: "POST",
      body: JSON.stringify({ url, email_text: emailText }),
    });
    setLoading(false);
    if (data) setResult(data);
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#e2e8f0", margin: 0 }}>🎣 Phishing Detection Engine</h1>
        <p style={{ fontSize: "12px", color: "#4a6b8a", margin: "4px 0 0" }}>AI + NLP-powered analysis to detect phishing URLs, emails, and malicious content</p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "ANALYZED TODAY", value: "48,291", color: "#00d4ff" },
          { label: "PHISHING DETECTED", value: "3,847", color: "#ff2d55" },
          { label: "DOMAINS BLOCKED", value: "12,445", color: "#ff6b35" },
          { label: "ACCURACY", value: "97.3%", color: "#30d158" },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(8,15,30,0.8)", border: `1px solid ${s.color}25`,
            borderRadius: "10px", padding: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Analysis Form */}
        <div style={{
          background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: "12px", padding: "24px",
        }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>ANALYZE CONTENT</div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            {["url", "email"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 16px", borderRadius: "20px",
                background: tab === t ? "rgba(0,212,255,0.15)" : "transparent",
                border: `1px solid ${tab === t ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                color: tab === t ? "#00d4ff" : "#4a6b8a",
                cursor: "pointer", fontSize: "11px", fontWeight: "600",
                letterSpacing: "1px", textTransform: "uppercase", fontFamily: "inherit",
              }}>{t === "url" ? "🔗 URL Check" : "📧 Email Scan"}</button>
            ))}
          </div>

          {tab === "url" ? (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#4a6b8a", letterSpacing: "1px", marginBottom: "8px" }}>URL TO ANALYZE</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://suspicious-site.com/login"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: "8px", color: "#e2e8f0", fontSize: "12px",
                  fontFamily: "monospace", outline: "none", boxSizing: "border-box",
                }}
              />
              <div style={{ marginTop: "8px" }}>
                <div style={{ fontSize: "9px", color: "#4a6b8a", marginBottom: "6px" }}>SAMPLE URLS:</div>
                {SAMPLES.url.map(s => (
                  <button key={s} onClick={() => setUrl(s)} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "4px 8px", marginBottom: "3px",
                    background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.1)",
                    borderRadius: "4px", color: "#4a6b8a", cursor: "pointer",
                    fontSize: "10px", fontFamily: "monospace", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "10px", color: "#4a6b8a", letterSpacing: "1px", marginBottom: "8px" }}>EMAIL CONTENT</label>
              <textarea
                value={emailText}
                onChange={e => setEmailText(e.target.value)}
                placeholder="Paste email content here..."
                rows={5}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: "8px", color: "#e2e8f0", fontSize: "12px",
                  fontFamily: "inherit", outline: "none", resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ marginTop: "8px" }}>
                {SAMPLES.email.map((s, i) => (
                  <button key={i} onClick={() => setEmailText(s)} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "4px 8px", marginBottom: "3px",
                    background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.1)",
                    borderRadius: "4px", color: "#4a6b8a", cursor: "pointer",
                    fontSize: "10px", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>Sample {i + 1}: {s.substring(0, 60)}...</button>
                ))}
              </div>
            </div>
          )}

          <button onClick={analyze} disabled={loading || (!url && !emailText)} style={{
            width: "100%", padding: "12px",
            background: loading ? "rgba(0,212,255,0.1)" : "linear-gradient(135deg, #0066ff, #00d4ff)",
            border: "none", borderRadius: "8px", color: "#fff",
            fontSize: "12px", fontWeight: "700", letterSpacing: "2px",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: loading ? "none" : "0 0 20px rgba(0,102,255,0.3)",
          }}>
            {loading ? "🔍 ANALYZING..." : "🔍 ANALYZE NOW"}
          </button>
        </div>

        {/* Result Panel */}
        <div style={{
          background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)",
          borderRadius: "12px", padding: "24px",
        }}>
          <div style={{ fontSize: "11px", color: "#4a6b8a", letterSpacing: "2px", marginBottom: "16px" }}>ANALYSIS RESULT</div>
          {!result ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "200px", color: "#4a6b8a", gap: "12px",
            }}>
              <div style={{ fontSize: "48px" }}>🔍</div>
              <div style={{ fontSize: "12px" }}>Submit content to analyze</div>
            </div>
          ) : (
            <div>
              {/* Verdict */}
              <div style={{
                padding: "20px", borderRadius: "12px", marginBottom: "20px",
                background: result.is_phishing ? "rgba(255,45,85,0.1)" : "rgba(48,209,88,0.1)",
                border: `1px solid ${result.is_phishing ? "rgba(255,45,85,0.3)" : "rgba(48,209,88,0.3)"}`,
                textAlign: "center",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>
                  {result.is_phishing ? "🚨" : "✅"}
                </div>
                <div style={{
                  fontSize: "18px", fontWeight: "800",
                  color: result.is_phishing ? "#ff2d55" : "#30d158",
                }}>
                  {result.is_phishing ? "PHISHING DETECTED" : "SAFE CONTENT"}
                </div>
                <div style={{ fontSize: "11px", color: "#8aa8c8", marginTop: "6px" }}>
                  Confidence: {((result.confidence || 0.9) * 100).toFixed(1)}%
                </div>
              </div>

              {/* Risk Score */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "#4a6b8a" }}>Risk Score</span>
                  <span style={{
                    fontSize: "11px", fontWeight: "700",
                    color: result.risk_score > 70 ? "#ff2d55" : result.risk_score > 40 ? "#ffd60a" : "#30d158",
                  }}>{result.risk_score}/100</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${result.risk_score}%`,
                    background: result.risk_score > 70 ? "#ff2d55" : result.risk_score > 40 ? "#ffd60a" : "#30d158",
                    borderRadius: "4px",
                    boxShadow: `0 0 8px ${result.risk_score > 70 ? "#ff2d55" : "#30d158"}`,
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>

              {/* Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                <div style={{ background: "rgba(0,212,255,0.05)", borderRadius: "8px", padding: "10px" }}>
                  <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>SSL CERT</div>
                  <div style={{ fontSize: "12px", color: result.ssl_valid ? "#30d158" : "#ff2d55", marginTop: "4px" }}>
                    {result.ssl_valid ? "✓ Valid" : "✗ Invalid/Missing"}
                  </div>
                </div>
                <div style={{ background: "rgba(0,212,255,0.05)", borderRadius: "8px", padding: "10px" }}>
                  <div style={{ fontSize: "9px", color: "#4a6b8a", letterSpacing: "1px" }}>DOMAIN AGE</div>
                  <div style={{ fontSize: "12px", color: result.domain_age_days < 30 ? "#ff2d55" : "#30d158", marginTop: "4px" }}>
                    {result.domain_age_days} days
                  </div>
                </div>
              </div>

              {result.indicators?.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", color: "#4a6b8a", letterSpacing: "1px", marginBottom: "8px" }}>THREAT INDICATORS</div>
                  {result.indicators.map((ind, i) => (
                    <div key={i} style={{
                      padding: "6px 10px", marginBottom: "4px",
                      background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.2)",
                      borderRadius: "6px", fontSize: "11px", color: "#ff6b35",
                    }}>⚠ {ind}</div>
                  ))}
                </div>
              )}

              {result.nlp_flags?.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", color: "#4a6b8a", letterSpacing: "1px", marginBottom: "8px" }}>NLP FLAGS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {result.nlp_flags.map((f, i) => (
                      <span key={i} style={{
                        padding: "3px 10px", borderRadius: "4px",
                        background: "rgba(255,214,10,0.1)", border: "1px solid rgba(255,214,10,0.25)",
                        fontSize: "10px", color: "#ffd60a",
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                padding: "12px 14px", borderRadius: "8px",
                background: result.is_phishing ? "rgba(255,45,85,0.1)" : "rgba(48,209,88,0.1)",
                border: `1px solid ${result.is_phishing ? "rgba(255,45,85,0.25)" : "rgba(48,209,88,0.25)"}`,
                fontSize: "12px", color: result.is_phishing ? "#ff2d55" : "#30d158",
                fontWeight: "600",
              }}>
                {result.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}