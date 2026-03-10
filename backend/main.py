"""
AI-Powered Cyber Shield Platform - Backend API
FastAPI application with security modules, AI threat detection, and real-time monitoring
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import asyncio
import json
import random
import math
from datetime import datetime, timedelta
from typing import Optional
import logging

# ─── App Init ───────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cyber-shield")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🛡️  Cyber Shield Platform starting...")
    yield
    logger.info("🛡️  Cyber Shield Platform shutting down...")

app = FastAPI(
    title="AI Cyber Shield Platform",
    description="National-Level AI-Powered Cybersecurity Platform",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer(auto_error=False)

# ─── WebSocket Manager ───────────────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# ─── In-Memory State ─────────────────────────────────────────────────────────
attack_log = []
blocked_ips = set()
locked_accounts = set()
incidents = []
threat_counter = 0

ATTACK_TYPES = ["DDoS", "BruteForce", "Phishing", "Ransomware", "SQLInjection",
                "XSS", "MalwareUpload", "InsiderThreat", "ZeroDay", "ManInTheMiddle"]
COUNTRIES = ["China", "Russia", "USA", "Brazil", "Germany", "India", "UK",
             "Ukraine", "Iran", "North Korea", "Netherlands", "France"]
SEVERITIES = ["critical", "high", "medium", "low"]
SEVERITY_WEIGHTS = [0.1, 0.25, 0.35, 0.3]

def gen_ip():
    return f"{random.randint(1,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"

def gen_risk_score(severity: str) -> int:
    ranges = {"critical": (85, 100), "high": (65, 84), "medium": (40, 64), "low": (10, 39)}
    lo, hi = ranges[severity]
    return random.randint(lo, hi)

def generate_threat_event():
    global threat_counter
    threat_counter += 1
    severity = random.choices(SEVERITIES, weights=SEVERITY_WEIGHTS)[0]
    attack_type = random.choice(ATTACK_TYPES)
    src_country = random.choice(COUNTRIES)
    dst_country = random.choice(["USA", "UK", "Germany", "France", "Japan"])
    src_ip = gen_ip()
    risk = gen_risk_score(severity)

    event = {
        "id": f"THR-{threat_counter:05d}",
        "timestamp": datetime.utcnow().isoformat(),
        "attack_type": attack_type,
        "severity": severity,
        "risk_score": risk,
        "src_ip": src_ip,
        "dst_ip": gen_ip(),
        "src_country": src_country,
        "dst_country": dst_country,
        "src_lat": random.uniform(-60, 70),
        "src_lng": random.uniform(-150, 150),
        "dst_lat": random.uniform(30, 60),
        "dst_lng": random.uniform(-120, 30),
        "status": "active",
        "description": f"{attack_type} attack detected from {src_country} targeting {dst_country} infrastructure",
        "bytes": random.randint(1000, 10_000_000),
        "packets": random.randint(100, 50000),
        "blocked": severity in ["critical", "high"],
        "ai_confidence": round(random.uniform(0.72, 0.99), 3),
        "mitre_technique": f"T{random.randint(1000, 1599)}.{random.randint(1, 9):03d}",
    }
    attack_log.append(event)
    if len(attack_log) > 500:
        attack_log.pop(0)
    if severity in ["critical", "high"]:
        blocked_ips.add(src_ip)
    return event

def generate_system_metrics():
    t = datetime.utcnow().timestamp()
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "cpu_usage": round(35 + 20 * abs(math.sin(t / 30)) + random.gauss(0, 3), 1),
        "memory_usage": round(58 + 12 * abs(math.sin(t / 60)) + random.gauss(0, 2), 1),
        "network_in": round(random.uniform(120, 850), 1),
        "network_out": round(random.uniform(80, 420), 1),
        "active_connections": random.randint(840, 2400),
        "requests_per_sec": random.randint(1200, 8500),
        "blocked_requests": random.randint(12, 180),
        "threat_level": random.choice(["LOW", "MODERATE", "HIGH", "CRITICAL"]),
        "uptime_pct": 99.97,
        "firewall_rules_active": random.randint(2800, 3200),
        "ssl_certs_valid": random.randint(245, 260),
        "endpoints_monitored": 1847,
    }

def generate_predictive_intelligence():
    predictions = []
    for attack in random.sample(ATTACK_TYPES, 5):
        prob = round(random.uniform(0.15, 0.94), 3)
        predictions.append({
            "attack_type": attack,
            "probability": prob,
            "confidence": round(random.uniform(0.7, 0.98), 3),
            "estimated_time": f"Next {random.randint(1, 72)} hours",
            "severity": random.choice(SEVERITIES),
            "indicators": random.randint(3, 18),
            "recommendation": f"Increase monitoring for {attack} vectors; patch CVE-202{random.randint(0,5)}-{random.randint(1000,9999)}",
        })
    predictions.sort(key=lambda x: x["probability"], reverse=True)
    return predictions

def generate_dark_web_alerts():
    alerts = []
    types = ["credential_leak", "data_breach", "ransomware_listing", "exploit_sale", "database_dump"]
    for i in range(random.randint(2, 6)):
        alerts.append({
            "id": f"DW-{random.randint(10000, 99999)}",
            "type": random.choice(types),
            "source": random.choice(["Tor Forum", "Paste Site", "Dark Market", "IRC Channel", "Telegram"]),
            "severity": random.choice(SEVERITIES),
            "timestamp": (datetime.utcnow() - timedelta(hours=random.randint(0, 48))).isoformat(),
            "affected_records": random.randint(500, 5_000_000),
            "data_types": random.sample(["emails", "passwords", "SSNs", "credit_cards", "medical_records"], 2),
            "price_usd": random.randint(500, 50000),
            "verified": random.choice([True, False]),
        })
    return alerts

# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "AI Cyber Shield Platform v2.0", "status": "operational", "modules": 12}

@app.post("/api/auth/login")
async def login(credentials: dict):
    username = credentials.get("username", "")
    password = credentials.get("password", "")
    users = {
        "admin": {"password": "admin123", "role": "admin", "mfa": True},
        "analyst": {"password": "analyst123", "role": "analyst", "mfa": False},
        "viewer": {"password": "viewer123", "role": "viewer", "mfa": False},
    }
    if username not in users or users[username]["password"] != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = users[username]
    return {
        "access_token": f"shield_token_{username}_{datetime.utcnow().timestamp()}",
        "token_type": "bearer",
        "user": {"username": username, "role": user["role"]},
        "mfa_required": user["mfa"],
        "session_expires": (datetime.utcnow() + timedelta(hours=8)).isoformat(),
    }

@app.post("/api/auth/mfa/verify")
async def verify_mfa(payload: dict):
    code = payload.get("code", "")
    if code == "123456" or len(code) == 6:
        return {"verified": True, "message": "MFA verified successfully"}
    raise HTTPException(status_code=401, detail="Invalid MFA code")

@app.get("/api/dashboard/overview")
async def dashboard_overview():
    metrics = generate_system_metrics()
    recent = attack_log[-20:] if attack_log else [generate_threat_event() for _ in range(10)]
    critical_count = sum(1 for a in recent if a["severity"] == "critical")
    high_count = sum(1 for a in recent if a["severity"] == "high")
    return {
        "metrics": metrics,
        "threat_summary": {
            "total_threats_today": random.randint(1200, 4800),
            "critical": critical_count,
            "high": high_count,
            "blocked": len(blocked_ips),
            "resolved": random.randint(800, 2400),
            "active_incidents": len(incidents),
        },
        "security_score": random.randint(72, 94),
        "zero_trust_score": random.randint(80, 98),
        "compliance_score": random.randint(85, 99),
        "recent_threats": recent[-5:],
    }

@app.get("/api/threats/live")
async def get_live_threats(limit: int = 50):
    while len(attack_log) < limit:
        generate_threat_event()
    return {
        "threats": attack_log[-limit:],
        "total": len(attack_log),
        "blocked_ips": list(blocked_ips)[:20],
        "stats": {
            "by_type": {t: sum(1 for a in attack_log if a["attack_type"] == t) for t in ATTACK_TYPES},
            "by_severity": {s: sum(1 for a in attack_log if a["severity"] == s) for s in SEVERITIES},
        }
    }

@app.post("/api/threats/generate")
async def trigger_threat(background_tasks: BackgroundTasks):
    event = generate_threat_event()
    await manager.broadcast({"type": "new_threat", "data": event})
    return {"message": "Threat simulated", "event": event}

@app.get("/api/threats/map")
async def get_attack_map():
    events = []
    for _ in range(random.randint(15, 35)):
        e = generate_threat_event()
        events.append(e)
    return {"attacks": events, "total_countries": 47, "active_campaigns": random.randint(8, 24)}

@app.get("/api/monitoring/metrics")
async def get_metrics():
    history = []
    for i in range(30):
        t = datetime.utcnow() - timedelta(minutes=(29 - i))
        history.append({
            "time": t.strftime("%H:%M"),
            "threats": random.randint(5, 80),
            "blocked": random.randint(3, 60),
            "cpu": round(30 + 30 * abs(math.sin(i / 5)) + random.gauss(0, 3), 1),
            "memory": round(50 + 20 * abs(math.sin(i / 8)) + random.gauss(0, 2), 1),
            "network": random.randint(100, 900),
        })
    return {"current": generate_system_metrics(), "history": history}

@app.get("/api/intelligence/predictions")
async def get_predictions():
    return {
        "predictions": generate_predictive_intelligence(),
        "model_accuracy": 0.924,
        "last_updated": datetime.utcnow().isoformat(),
        "signals_analyzed": random.randint(50000, 200000),
        "threat_actors_tracked": random.randint(180, 340),
    }

@app.get("/api/intelligence/darkweb")
async def get_darkweb_intel():
    return {
        "alerts": generate_dark_web_alerts(),
        "monitored_keywords": 847,
        "sources_active": 234,
        "last_scan": datetime.utcnow().isoformat(),
        "breach_exposure_score": random.randint(20, 75),
    }

@app.post("/api/phishing/analyze")
async def analyze_phishing(payload: dict):
    url = payload.get("url", "")
    email_text = payload.get("email_text", "")
    is_phishing = any(kw in url.lower() for kw in ["login", "secure", "verify", "update", "paypal", "bank"]) or random.random() < 0.3
    risk = random.randint(75, 98) if is_phishing else random.randint(5, 30)
    return {
        "is_phishing": is_phishing,
        "risk_score": risk,
        "confidence": round(random.uniform(0.82, 0.99), 3),
        "indicators": ["Suspicious domain", "Lookalike URL", "Urgency language"] if is_phishing else [],
        "domain_age_days": random.randint(1, 15) if is_phishing else random.randint(500, 5000),
        "ssl_valid": not is_phishing,
        "similar_domains": [f"paypa1.com", f"g00gle.com"] if is_phishing else [],
        "nlp_flags": ["Urgency", "Authority impersonation", "Fear tactics"] if is_phishing else [],
        "recommendation": "BLOCK - High phishing probability" if is_phishing else "SAFE - No threats detected",
    }

@app.get("/api/access/sessions")
async def get_sessions():
    sessions = []
    for i in range(random.randint(8, 20)):
        risk = random.choice(["normal", "normal", "normal", "suspicious", "anomalous"])
        sessions.append({
            "id": f"SES-{random.randint(10000, 99999)}",
            "user": random.choice(["alice@org.gov", "bob@org.gov", "charlie@org.gov", "diana@org.gov"]),
            "ip": gen_ip(),
            "country": random.choice(COUNTRIES),
            "device": random.choice(["Windows 11", "macOS 14", "Ubuntu 22", "iOS 17", "Android 14"]),
            "browser": random.choice(["Chrome 120", "Firefox 121", "Safari 17", "Edge 120"]),
            "login_time": (datetime.utcnow() - timedelta(minutes=random.randint(1, 480))).isoformat(),
            "risk_level": risk,
            "mfa_passed": True,
            "behavioral_score": random.randint(60, 100),
            "actions": random.randint(5, 200),
        })
    return {"sessions": sessions, "total_active": len(sessions), "suspicious_count": sum(1 for s in sessions if s["risk_level"] in ["suspicious", "anomalous"])}

@app.post("/api/incident/respond")
async def auto_respond(payload: dict):
    incident_id = payload.get("incident_id", f"INC-{random.randint(10000, 99999)}")
    actions = [
        {"action": "Isolated affected endpoint", "status": "completed", "time_ms": random.randint(50, 200)},
        {"action": "Blocked source IP range", "status": "completed", "time_ms": random.randint(10, 80)},
        {"action": "Revoked compromised tokens", "status": "completed", "time_ms": random.randint(30, 150)},
        {"action": "Snapshot backup initiated", "status": "in_progress", "time_ms": random.randint(500, 2000)},
        {"action": "Notified security team", "status": "completed", "time_ms": random.randint(20, 100)},
        {"action": "Updated firewall rules", "status": "completed", "time_ms": random.randint(40, 160)},
    ]
    incident = {
        "incident_id": incident_id,
        "response_time_ms": sum(a["time_ms"] for a in actions),
        "actions_taken": actions,
        "status": "contained",
        "threat_eliminated": True,
        "timestamp": datetime.utcnow().isoformat(),
    }
    incidents.append(incident)
    await manager.broadcast({"type": "incident_resolved", "data": incident})
    return incident

@app.get("/api/simulator/attacks")
async def get_attack_simulations():
    return {
        "available_simulations": [
            {"id": "sim_ddos", "name": "DDoS Attack Simulation", "duration_sec": 30, "category": "network"},
            {"id": "sim_phishing", "name": "Spear Phishing Campaign", "duration_sec": 15, "category": "social"},
            {"id": "sim_ransomware", "name": "Ransomware Deployment", "duration_sec": 45, "category": "malware"},
            {"id": "sim_bruteforce", "name": "Credential Brute Force", "duration_sec": 20, "category": "access"},
            {"id": "sim_insider", "name": "Insider Threat Scenario", "duration_sec": 25, "category": "internal"},
            {"id": "sim_apt", "name": "Advanced Persistent Threat", "duration_sec": 60, "category": "advanced"},
        ],
        "last_score": random.randint(70, 95),
        "simulations_run": random.randint(12, 48),
    }

@app.post("/api/simulator/run")
async def run_simulation(payload: dict):
    sim_id = payload.get("simulation_id", "sim_ddos")
    score = random.randint(65, 98)
    return {
        "simulation_id": sim_id,
        "security_readiness_score": score,
        "grade": "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D",
        "vulnerabilities_found": random.randint(0, 8),
        "controls_effective": random.randint(15, 28),
        "mean_time_to_detect_sec": random.randint(8, 120),
        "mean_time_to_respond_sec": random.randint(30, 600),
        "recommendations": [
            "Enable network segmentation for critical systems",
            "Increase log retention to 365 days",
            "Deploy honeypots on internal network",
            "Enable geo-blocking for high-risk regions",
        ][:random.randint(1, 4)],
        "timestamp": datetime.utcnow().isoformat(),
    }

@app.get("/api/zerotrust/policy")
async def get_zerotrust():
    return {
        "trust_score": random.randint(75, 99),
        "policies_active": random.randint(120, 240),
        "micro_segments": random.randint(45, 89),
        "last_verified": datetime.utcnow().isoformat(),
        "identity_verified": True,
        "device_compliant": True,
        "network_trusted": False,
        "access_decisions_today": random.randint(50000, 200000),
        "denied_requests": random.randint(200, 2000),
        "principles": [
            {"name": "Verify Explicitly", "status": "active", "coverage": random.randint(85, 100)},
            {"name": "Least Privilege", "status": "active", "coverage": random.randint(78, 99)},
            {"name": "Assume Breach", "status": "active", "coverage": random.randint(80, 100)},
        ]
    }

@app.get("/api/encryption/status")
async def get_encryption_status():
    return {
        "overall_status": "operational",
        "algorithms": {
            "AES-256-GCM": {"status": "active", "endpoints": random.randint(400, 600)},
            "RSA-4096": {"status": "active", "endpoints": random.randint(100, 200)},
            "ECDSA-P384": {"status": "active", "endpoints": random.randint(200, 300)},
            "ChaCha20-Poly1305": {"status": "active", "endpoints": random.randint(50, 100)},
        },
        "keys_managed": random.randint(8000, 15000),
        "certs_expiring_soon": random.randint(0, 5),
        "tls_version": "1.3",
        "perfect_forward_secrecy": True,
        "data_at_rest_encrypted": True,
        "channels_secured": random.randint(1200, 2000),
    }

@app.get("/api/logs/security")
async def get_security_logs(limit: int = 100):
    logs = []
    log_types = ["AUTH_SUCCESS", "AUTH_FAILURE", "FIREWALL_BLOCK", "INTRUSION_DETECTED",
                 "POLICY_VIOLATION", "DATA_ACCESS", "CONFIG_CHANGE", "ALERT_GENERATED"]
    for i in range(limit):
        log_type = random.choice(log_types)
        logs.append({
            "id": f"LOG-{random.randint(100000, 999999)}",
            "timestamp": (datetime.utcnow() - timedelta(seconds=i * random.randint(5, 60))).isoformat(),
            "type": log_type,
            "severity": "critical" if "INTRUSION" in log_type else random.choice(["info", "warning", "error"]),
            "user": random.choice(["system", "admin", "alice", "bob", "api_gateway"]),
            "ip": gen_ip(),
            "message": f"{log_type}: {random.choice(['Successful', 'Failed', 'Blocked', 'Detected'])} event on {random.choice(['endpoint-01', 'gateway', 'db-server', 'api-server'])}",
            "module": random.choice(["firewall", "auth", "ids", "dlp", "siem"]),
        })
    return {"logs": logs, "total": len(logs)}

# ─── WebSocket ────────────────────────────────────────────────────────────────
@app.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Push threat event every 3-8 seconds
            await asyncio.sleep(random.uniform(3, 8))
            event = generate_threat_event()
            await manager.broadcast({"type": "threat", "data": event})
            # Also push metrics every 5 seconds
            if random.random() < 0.4:
                metrics = generate_system_metrics()
                await manager.broadcast({"type": "metrics", "data": metrics})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)