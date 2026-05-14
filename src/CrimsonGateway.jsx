import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8081/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --crimson: #e8412a;
    --crimson-dark: #c0341f;
    --crimson-glow: rgba(232,65,42,0.35);
    --bg: #0d0d10;
    --panel: rgba(15,15,20,0.92);
    --border: rgba(232,65,42,0.25);
    --border-hover: rgba(232,65,42,0.6);
    --text: #c8c8d4;
    --text-dim: #6a6a7a;
    --input-bg: rgba(255,255,255,0.04);
    --purple-accent: #5b21f0;
  }

  .cg-root {
    font-family: 'Exo 2', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .cg-grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(91,33,240,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(91,33,240,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
    pointer-events: none;
  }

  .cg-glow {
    position: fixed;
    top: -20%;
    right: -10%;
    width: 60%;
    height: 80%;
    background: radial-gradient(ellipse, rgba(200,40,20,0.12) 0%, transparent 65%);
    z-index: 0;
    pointer-events: none;
  }

  .cg-scanlines {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px
    );
    z-index: 1;
    pointer-events: none;
  }

  .cg-corner {
    position: fixed;
    width: 60px;
    height: 60px;
    z-index: 2;
    opacity: 0.6;
  }
  .cg-corner-tl { top: 12px; left: 12px; border-top: 2px solid var(--purple-accent); border-left: 2px solid var(--purple-accent); }
  .cg-corner-tr { top: 12px; right: 12px; border-top: 2px solid var(--purple-accent); border-right: 2px solid var(--purple-accent); }
  .cg-corner-bl { bottom: 12px; left: 12px; border-bottom: 2px solid var(--purple-accent); border-left: 2px solid var(--purple-accent); }
  .cg-corner-br { bottom: 12px; right: 12px; border-bottom: 2px solid var(--purple-accent); border-right: 2px solid var(--purple-accent); }

  .cg-particles {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
  }

  .cg-particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--crimson);
    border-radius: 50%;
    opacity: 0;
    animation: cg-float-up linear infinite;
  }

  @keyframes cg-float-up {
    0%   { opacity: 0; transform: translateY(0) translateX(0); }
    10%  { opacity: 0.4; }
    90%  { opacity: 0.1; }
    100% { opacity: 0; transform: translateY(-80vh) translateX(var(--dx)); }
  }

  .cg-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    padding: 16px;
    animation: cg-fade-up 0.6s ease both;
  }

  @keyframes cg-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cg-panel {
    background: var(--panel);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    padding: 44px 40px 36px;
    position: relative;
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
  }

  .cg-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(232,65,42,0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  .cg-top-line {
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--crimson), transparent);
    animation: cg-pulse 3s ease-in-out infinite;
  }

  @keyframes cg-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .cg-logo {
    text-align: center;
    margin-bottom: 36px;
  }

  .cg-logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-bottom: 14px;
  }

  .cg-logo-icon svg {
    filter: drop-shadow(0 0 8px var(--crimson));
  }

  .cg-logo-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #fff;
    text-shadow: 0 0 20px var(--crimson-glow);
  }

  .cg-logo-title span { color: var(--crimson); }

  .cg-logo-sub {
    font-size: 11.5px;
    letter-spacing: 2px;
    color: var(--text-dim);
    text-transform: uppercase;
    margin-top: 6px;
    font-weight: 300;
  }

  .cg-tabs {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 1px solid var(--border);
  }

  .cg-tab {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-dim);
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 10px 0 12px;
    cursor: pointer;
    position: relative;
    transition: color 0.25s;
  }

  .cg-tab::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 2px;
    background: var(--crimson);
    transform: scaleX(0);
    transition: transform 0.25s;
    box-shadow: 0 0 8px var(--crimson-glow);
  }

  .cg-tab.active { color: #fff; }
  .cg-tab.active::after { transform: scaleX(1); }

  .cg-field { margin-bottom: 18px; }

  .cg-label {
    font-family: 'Rajdhani', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cg-forgot {
    font-family: 'Exo 2', sans-serif;
    font-size: 10px;
    color: var(--crimson);
    cursor: pointer;
    letter-spacing: 1px;
    transition: opacity 0.2s;
  }
  .cg-forgot:hover { opacity: 0.7; }

  .cg-field-wrap { position: relative; }

  .cg-input {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--border);
    color: #fff;
    font-family: 'Exo 2', sans-serif;
    font-size: 14px;
    padding: 11px 42px 11px 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }

  .cg-input::placeholder { color: rgba(255,255,255,0.2); font-size: 13px; }

  .cg-input:focus {
    border-color: var(--border-hover);
    background: rgba(232,65,42,0.04);
    box-shadow: 0 0 0 1px rgba(232,65,42,0.15), inset 0 0 20px rgba(232,65,42,0.03);
  }

  .cg-field-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-dim);
    width: 16px;
    height: 16px;
    pointer-events: none;
  }

  .cg-btn {
    width: 100%;
    background: var(--crimson);
    color: #fff;
    border: none;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    padding: 13px;
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    transition: background 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .cg-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  }

  .cg-btn:hover:not(:disabled) {
    background: var(--crimson-dark);
    box-shadow: 0 0 30px var(--crimson-glow);
  }

  .cg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .cg-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cg-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes cg-spin { to { transform: rotate(360deg); } }

  .cg-msg {
    font-size: 12px;
    letter-spacing: 1px;
    margin-top: 14px;
    padding: 9px 14px;
    border-left: 2px solid;
    font-family: 'Exo 2', sans-serif;
  }

  .cg-msg-success { color: #4de09a; border-color: #4de09a; background: rgba(77,224,154,0.06); }
  .cg-msg-error   { color: var(--crimson); border-color: var(--crimson); background: rgba(232,65,42,0.06); }

  .cg-switch {
    text-align: center;
    margin-top: 22px;
    font-size: 12px;
    color: var(--text-dim);
    letter-spacing: 1px;
  }

  .cg-switch-link {
    color: var(--crimson);
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .cg-switch-link:hover { opacity: 0.7; }

  .cg-footer-text {
    text-align: center;
    margin-top: 24px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(255,255,255,0.1);
    text-transform: uppercase;
  }

  .cg-bottom-links {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 24px;
    z-index: 10;
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.15);
    text-transform: uppercase;
    font-family: 'Rajdhani', sans-serif;
  }

  .cg-bottom-links span { cursor: pointer; transition: color 0.2s; }
  .cg-bottom-links span:hover { color: var(--crimson); }

  .cg-hint {
    font-size: 9px;
    color: rgba(255,255,255,0.2);
    letter-spacing: 1px;
    margin-left: 6px;
  }
`;

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    bottom: Math.random() * 30,
    dx: Math.random() * 60 - 30,
    duration: 8 + Math.random() * 14,
    delay: Math.random() * 12,
  }));

  return (
    <div className="cg-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="cg-particle"
          style={{
            left: `${p.left}vw`,
            bottom: `${p.bottom}px`,
            "--dx": `${p.dx}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function IconUser() {
  return (
    <svg className="cg-field-icon" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="cg-field-icon" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11 1a3 3 0 013 3v1h1v10H1V5h1V4a3 3 0 013-3h6zm-1 4H6v-.5a2 2 0 114 0V5zm1-1V4a4 4 0 00-8 0v1H3v8h10V5h-2z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="cg-field-icon" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v.5l-6 4-6-4V3zm0 2.5l5.4 3.6a1 1 0 001.2 0L14 5.5V13a1 1 0 01-1 1H3a1 1 0 01-1-1V5.5z" />
    </svg>
  );
}

// ─── HELPER: decode JWT payload (fără librărie externă) ───────────────────────
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function LoginView({ onSwitch }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleLogin = async () => {
    if (!username || !password) {
      return setMsg({ type: "error", text: "Please fill in all fields." });
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const text = await res.text();
      if (res.ok) {
        // Salvează token-ul
        localStorage.setItem("token", text);

        // Extrage username-ul din JWT (câmpul "sub") și salvează currentUser
        const payload = decodeJwtPayload(text);
        const currentUser = {
          id: payload?.id || payload?.userId || null,
          username: payload?.sub || username,
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        setMsg({ type: "success", text: "✓ Access granted. Redirecting..." });
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        setMsg({ type: "error", text: text || "Authentication failed." });
      }
    } catch {
      setMsg({ type: "error", text: "Connection error. Check server status." });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div onKeyDown={handleKey}>
      <div className="cg-field">
        <div className="cg-label">Username</div>
        <div className="cg-field-wrap">
          <input
            className="cg-input"
            type="text"
            placeholder="Enter your gamer tag"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <IconUser />
        </div>
      </div>

      <div className="cg-field">
        <div className="cg-label">
          Password
          <span className="cg-forgot">Forgot Password?</span>
        </div>
        <div className="cg-field-wrap">
          <input
            className="cg-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <IconLock />
        </div>
      </div>

      <button className="cg-btn" onClick={handleLogin} disabled={loading}>
        {loading ? <><span className="cg-spinner" /> Syncing...</> : "Login ⟶"}
      </button>

      {msg && (
        <div className={`cg-msg cg-msg-${msg.type}`}>{msg.text}</div>
      )}

      <div className="cg-switch">
        Need an account?{" "}
        <span className="cg-switch-link" onClick={onSwitch}>Register</span>
      </div>
    </div>
  );
}

function RegisterView({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState(null);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      return setMsg({ type: "error", text: "All fields are required." });
    }
    if (password.length < 6) {
      return setMsg({ type: "error", text: "Password must be at least 6 characters." });
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const text = await res.text();
      if (res.ok) {
        setMsg({ type: "success", text: "✓ Account created. Redirecting to login..." });
        setTimeout(() => onSwitch(), 1800);
      } else {
        setMsg({ type: "error", text: text || "Registration failed." });
      }
    } catch {
      setMsg({ type: "error", text: "Connection error. Check server status." });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleRegister(); };

  return (
    <div onKeyDown={handleKey}>
      <div className="cg-field">
        <div className="cg-label">Username</div>
        <div className="cg-field-wrap">
          <input
            className="cg-input"
            type="text"
            placeholder="Choose your gamer tag"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <IconUser />
        </div>
      </div>

      <div className="cg-field">
        <div className="cg-label">Email</div>
        <div className="cg-field-wrap">
          <input
            className="cg-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <IconEmail />
        </div>
      </div>

      <div className="cg-field">
        <div className="cg-label">
          Password
          <span className="cg-hint">(min. 6 chars)</span>
        </div>
        <div className="cg-field-wrap">
          <input
            className="cg-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <IconLock />
        </div>
      </div>

      <button className="cg-btn" onClick={handleRegister} disabled={loading}>
        {loading ? <><span className="cg-spinner" /> Creating...</> : "Create Account ⟶"}
      </button>

      {msg && (
        <div className={`cg-msg cg-msg-${msg.type}`}>{msg.text}</div>
      )}

      <div className="cg-switch">
        Already have an account?{" "}
        <span className="cg-switch-link" onClick={onSwitch}>Login</span>
      </div>
    </div>
  );
}

export default function CrimsonGateway() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  // Dacă utilizatorul e deja autentificat, redirecționează direct la profil
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/profile", { replace: true });
    }
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="cg-root">
        <div className="cg-grid-bg" />
        <div className="cg-glow" />
        <div className="cg-scanlines" />
        <Particles />

        <div className="cg-corner cg-corner-tl" />
        <div className="cg-corner cg-corner-tr" />
        <div className="cg-corner cg-corner-bl" />
        <div className="cg-corner cg-corner-br" />

        <div className="cg-wrapper">
          <div className="cg-panel">
            <div className="cg-top-line" />

            <div className="cg-logo">
              <div className="cg-logo-icon">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <polygon points="18,2 34,10 34,26 18,34 2,26 2,10"
                    stroke="#e8412a" strokeWidth="1.5" fill="none" />
                  <polygon points="18,8 28,13 28,23 18,28 8,23 8,13"
                    fill="rgba(232,65,42,0.15)" stroke="#e8412a" strokeWidth="1" />
                  <circle cx="18" cy="18" r="4" fill="#e8412a" />
                </svg>
              </div>
              <div className="cg-logo-title">
                <span>CRIMSON</span> GATEWAY
              </div>
              <div className="cg-logo-sub">
                Welcome back. Enter your credentials to sync.
              </div>
            </div>

            <div className="cg-tabs">
              <button
                className={`cg-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                className={`cg-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            {tab === "login" ? (
              <LoginView onSwitch={() => setTab("register")} />
            ) : (
              <RegisterView onSwitch={() => setTab("login")} />
            )}

            <div className="cg-footer-text">Secure Uplink</div>
          </div>
        </div>

        <div className="cg-bottom-links">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </>
  );
}
