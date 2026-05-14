import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8081/api";

const getToken = () => localStorage.getItem("token");

const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

/* ─── Icons ───────────────────────────────────────────────────────────────── */

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const UserIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "pp-spin 0.7s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

/* ─── Styles ──────────────────────────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --crimson:       #e8412a;
    --crimson-dark:  #c0341f;
    --crimson-glow:  rgba(232,65,42,0.3);
    --crimson-dim:   rgba(232,65,42,0.08);
    --bg:            #0d0d10;
    --surface:       rgba(15,15,20,0.95);
    --surface2:      rgba(255,255,255,0.03);
    --border:        rgba(232,65,42,0.2);
    --border-hover:  rgba(232,65,42,0.5);
    --text:          #c8c8d4;
    --text-bright:   #ffffff;
    --text-dim:      #6a6a7a;
    --success:       #4de09a;
    --purple:        #5b21f0;
    --font-display:  'Rajdhani', sans-serif;
    --font-body:     'Exo 2', sans-serif;
  }

  @keyframes pp-spin    { to { transform: rotate(360deg); } }
  @keyframes pp-fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pp-pulse   { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  @keyframes pp-slide   { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }

  .pp-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    padding: 36px 20px 60px;
    position: relative;
    overflow-x: hidden;
  }

  .pp-grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(91,33,240,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(91,33,240,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  .pp-glow {
    position: fixed; top: -20%; left: -10%;
    width: 50%; height: 70%;
    background: radial-gradient(ellipse, rgba(200,40,20,0.08) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  .pp-content {
    position: relative; z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    animation: pp-fade-up 0.5s ease both;
  }

  .pp-corner {
    position: fixed; width: 50px; height: 50px; z-index: 2; opacity: 0.4;
  }
  .pp-corner-tl { top:12px; left:12px; border-top:2px solid var(--purple); border-left:2px solid var(--purple); }
  .pp-corner-tr { top:12px; right:12px; border-top:2px solid var(--purple); border-right:2px solid var(--purple); }
  .pp-corner-bl { bottom:12px; left:12px; border-bottom:2px solid var(--purple); border-left:2px solid var(--purple); }
  .pp-corner-br { bottom:12px; right:12px; border-bottom:2px solid var(--purple); border-right:2px solid var(--purple); }

  /* ── Panel ── */
  .pp-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    position: relative;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }
  .pp-panel::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--crimson-dim) 0%, transparent 50%);
    pointer-events: none;
  }

  .pp-top-line {
    position: absolute; top: 0; left: 20px; right: 20px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--crimson), transparent);
    animation: pp-pulse 3s ease-in-out infinite;
  }

  /* ── Header ── */
  .pp-header {
    display: flex; gap: 28px; align-items: flex-start;
    padding: 28px 32px;
    margin-bottom: 16px;
  }

  /* ── Avatar ── */
  .pp-avatar-wrap { position: relative; flex-shrink: 0; }

  .pp-avatar {
    width: 88px; height: 88px; border-radius: 50%;
    border: 2px solid var(--border-hover);
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    color: var(--text-dim); overflow: hidden;
    box-shadow: 0 0 20px var(--crimson-glow);
  }
  .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .pp-avatar-btn {
    position: absolute; bottom: 0; right: 0;
    width: 26px; height: 26px; border-radius: 50%;
    background: var(--crimson); border: 2px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff;
    transition: background 0.2s, transform 0.2s;
  }
  .pp-avatar-btn:hover { background: var(--crimson-dark); transform: scale(1.1); }
  .pp-avatar-btn.busy  { opacity: 0.6; pointer-events: none; animation: pp-pulse 1s infinite; }

  /* ── Identity ── */
  .pp-identity { flex: 1; min-width: 0; }

  .pp-role {
    font-family: var(--font-display);
    font-size: 10px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--crimson); margin-bottom: 6px;
  }

  .pp-name {
    font-family: var(--font-display);
    font-size: 28px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--text-bright);
    text-shadow: 0 0 20px var(--crimson-glow);
    margin-bottom: 4px;
  }

  .pp-name-input {
    font-family: var(--font-display);
    font-size: 24px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    background: transparent;
    border: none; border-bottom: 2px solid var(--crimson);
    color: var(--text-bright); outline: none; width: 100%;
    padding: 2px 0;
    animation: pp-slide 0.2s ease;
  }

  .pp-username {
    font-family: var(--font-body);
    font-size: 12px; letter-spacing: 1px;
    color: var(--text-dim); margin-bottom: 14px;
  }

  .pp-meta { display: flex; gap: 18px; flex-wrap: wrap; }

  .pp-chip {
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; letter-spacing: 1px;
    color: var(--text-dim); font-family: var(--font-body);
  }

  .pp-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 6px var(--success);
    animation: pp-pulse 2s infinite;
  }

  /* ── Actions ── */
  .pp-actions { display: flex; gap: 10px; flex-shrink: 0; padding-top: 4px; flex-wrap: wrap; }

  .pp-btn {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: var(--font-display);
    font-size: 13px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 9px 18px; border: none; cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: background 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .pp-btn-primary { background: var(--crimson); color: #fff; }
  .pp-btn-primary:hover:not(:disabled) {
    background: var(--crimson-dark);
    box-shadow: 0 0 24px var(--crimson-glow);
  }
  .pp-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .pp-btn-secondary {
    background: transparent; color: var(--text-dim);
    border: 1px solid var(--border); clip-path: none;
  }
  .pp-btn-secondary:hover { border-color: var(--border-hover); color: var(--text); }

  .pp-btn-saved {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(77,224,154,0.1); color: var(--success);
    border: 1px solid rgba(77,224,154,0.3);
    font-family: var(--font-display);
    font-size: 13px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 9px 18px;
    animation: pp-fade-up 0.3s ease;
  }

  /* ── Grid ── */
  .pp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  @media (max-width: 620px) {
    .pp-header { flex-direction: column; }
    .pp-grid   { grid-template-columns: 1fr; }
    .pp-name   { font-size: 22px; }
  }

  /* ── Section ── */
  .pp-section { padding: 24px 28px; animation: pp-fade-up 0.5s ease both; }
  .pp-section:nth-child(2) { animation-delay: 0.07s; }
  .pp-section:nth-child(3) { animation-delay: 0.14s; }
  .pp-section.pp-full { grid-column: 1 / -1; }

  .pp-section-label {
    font-family: var(--font-display);
    font-size: 10px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--crimson); margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .pp-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ── Bio & Quote ── */
  .pp-bio { font-size: 13px; line-height: 1.75; color: var(--text); }
  .pp-bio.empty { color: var(--text-dim); font-style: italic; }

  .pp-bio-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-bright);
    font-family: var(--font-body);
    font-size: 13px; line-height: 1.75;
    padding: 10px 14px;
    resize: vertical; min-height: 80px; outline: none;
    transition: border-color 0.2s;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
    animation: pp-slide 0.2s ease;
  }
  .pp-bio-input:focus { border-color: var(--border-hover); }

  .pp-quote {
    margin-top: 18px; padding-left: 14px;
    border-left: 2px solid var(--crimson);
    box-shadow: -4px 0 12px rgba(232,65,42,0.15);
  }
  .pp-quote-text { font-size: 13px; font-style: italic; color: var(--text-dim); }
  .pp-quote-text.empty { color: rgba(106,106,122,0.4); }

  .pp-quote-input {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid var(--border);
    color: var(--text-dim); font-family: var(--font-body);
    font-size: 13px; font-style: italic;
    padding: 3px 0; outline: none;
    transition: border-color 0.2s;
    animation: pp-slide 0.2s ease;
  }
  .pp-quote-input:focus { border-color: var(--crimson); }

  /* ── Stats ── */
  .pp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .pp-stat {
    background: var(--surface2); border: 1px solid var(--border);
    padding: 14px 16px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: border-color 0.2s;
  }
  .pp-stat:hover { border-color: var(--border-hover); }

  .pp-stat-val {
    font-family: var(--font-display);
    font-size: 24px; font-weight: 700;
    color: var(--text-bright); letter-spacing: 1px; margin-bottom: 3px;
  }
  .pp-stat-val .acc { color: var(--crimson); font-size: 14px; }

  .pp-stat-lbl {
    font-size: 9px; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text-dim);
  }

  /* ── Account rows ── */
  .pp-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(232,65,42,0.08);
  }
  .pp-row:last-child { border-bottom: none; }
  .pp-row-key {
    font-family: var(--font-display);
    font-size: 9px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase; color: var(--text-dim);
  }
  .pp-row-val { font-family: var(--font-body); font-size: 12px; color: var(--text); }

  /* ── Loading / Error screens ── */
  .pp-screen {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-body); color: var(--text-dim); gap: 12px;
  }
  .pp-error-box {
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    padding: 28px 36px;
    background: var(--surface); border: 1px solid var(--border);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .pp-error-msg { color: var(--crimson); font-size: 13px; letter-spacing: 1px; }

  /* ── Toast ── */
  .pp-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    display: flex; align-items: center; gap: 8px;
    background: rgba(77,224,154,0.08);
    border: 1px solid rgba(77,224,154,0.25);
    color: var(--success);
    padding: 10px 16px;
    font-family: var(--font-display);
    font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    animation: pp-fade-up 0.3s ease;
  }
`;

/* ─── Main component ──────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const [profile, setProfile]                 = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [editing, setEditing]                 = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveSuccess, setSaveSuccess]         = useState(false);
  const [localAvatar, setLocalAvatar]         = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({ displayName: "", description: "", quote: "" });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/profile`);
      if (res.status === 401) {
        // Token expirat sau invalid
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/");
        return;
      }
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setProfile(data);
      setForm({
        displayName: data.displayName || "",
        description: data.description || "",
        quote:       data.quote       || "",
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch(`${API_BASE}/profile`, {
        method: "PATCH",
        body: JSON.stringify({ description: form.description, activity: form.activity }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const updated = await res.json();
      setProfile(prev => ({ ...prev, ...updated }));
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setLocalAvatar(preview);

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/profile/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      await fetchProfile();
    } catch (e) {
      setError(e.message);
      setLocalAvatar(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({
      displayName: profile?.displayName || "",
      description: profile?.description || "",
      quote:       profile?.quote       || "",
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  /* ── Loading ── */
  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="pp-screen">
        <SpinnerIcon />
        <span style={{ fontFamily: "'Rajdhani',sans-serif", letterSpacing: 3, textTransform: "uppercase", fontSize: 12 }}>
          Loading profile…
        </span>
      </div>
    </>
  );

  /* ── Error ── */
  if (error) return (
    <>
      <style>{CSS}</style>
      <div className="pp-screen">
        <div className="pp-error-box">
          <span className="pp-error-msg">{error}</span>
          <button className="pp-btn pp-btn-primary" onClick={() => { setError(null); fetchProfile(); }}>
            Retry
          </button>
        </div>
      </div>
    </>
  );

  /* ── Helpers ── */
  const avatarSrc = localAvatar || profile?.profilePicUrl || null;

  const memberSince = (() => {
    const raw = profile?.createdAt || profile?.joinedAt || profile?.operationalSince || profile?.registeredAt;
    if (!raw) return null;
    return new Date(raw).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })();

  /* ── Render ── */
  return (
    <>
      <style>{CSS}</style>

      <div className="pp-root">
        <div className="pp-grid-bg" />
        <div className="pp-glow" />

        <div className="pp-corner pp-corner-tl" />
        <div className="pp-corner pp-corner-tr" />
        <div className="pp-corner pp-corner-bl" />
        <div className="pp-corner pp-corner-br" />

        <div className="pp-content">

          {/* ── Header ── */}
          <div className="pp-panel pp-header">
            <div className="pp-top-line" />

            {/* Avatar */}
            <div className="pp-avatar-wrap">
              <div className="pp-avatar">
                {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : <UserIcon />}
              </div>
              <label className={`pp-avatar-btn${uploadingAvatar ? " busy" : ""}`} title="Upload avatar">
                {uploadingAvatar ? <SpinnerIcon /> : <UploadIcon />}
                <input
                  type="file" accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            {/* Identity */}
            <div className="pp-identity">
              <div className="pp-role">User Profile</div>

              {editing ? (
                <input
                  className="pp-name-input"
                  value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  placeholder="Display name"
                />
              ) : (
                <div className="pp-name">{profile?.displayName || profile?.username || "—"}</div>
              )}

              <div className="pp-username">@{profile?.username || "—"}</div>

              <div className="pp-meta">
                <div className="pp-chip"><span className="pp-dot" /> Active</div>
                {profile?.email && <div className="pp-chip">{profile.email}</div>}
                {memberSince    && <div className="pp-chip">Since {memberSince}</div>}
              </div>
            </div>

            {/* Actions */}
            <div className="pp-actions">
              {saveSuccess ? (
                <div className="pp-btn-saved"><CheckIcon /> Saved</div>
              ) : editing ? (
                <>
                  <button className="pp-btn pp-btn-secondary" onClick={cancelEdit} disabled={saving}>
                    <XIcon /> Cancel
                  </button>
                  <button className="pp-btn pp-btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? <SpinnerIcon /> : <CheckIcon />} Save
                  </button>
                </>
              ) : (
                <>
                  <button className="pp-btn pp-btn-secondary" onClick={() => navigate('/chat')}>
                    Messages
                  </button>
                  <button className="pp-btn pp-btn-secondary" onClick={() => navigate('/friends')}>
                    Friends
                  </button>
                  <button className="pp-btn pp-btn-primary" onClick={() => setEditing(true)}>
                    <EditIcon /> Edit
                  </button>
                  <button className="pp-btn pp-btn-secondary" onClick={handleSignOut} style={{ fontSize: 11 }}>
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="pp-grid">

            {/* Biography */}
            <div className="pp-panel pp-section pp-full">
              <div className="pp-top-line" />
              <div className="pp-section-label">Biography</div>

              {editing ? (
                <textarea
                  className="pp-bio-input"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Tell others about yourself…"
                  rows={4}
                />
              ) : (
                <p className={`pp-bio${!profile?.description ? " empty" : ""}`}>
                  {profile?.description || "No biography provided yet."}
                </p>
              )}

              <div className="pp-quote">
                {editing ? (
                  <input
                    className="pp-quote-input"
                    value={form.quote}
                    onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                    placeholder="Your personal quote…"
                  />
                ) : (
                  <p className={`pp-quote-text${!profile?.quote ? " empty" : ""}`}>
                    {profile?.quote ? `"${profile.quote}"` : "No quote set."}
                  </p>
                )}
              </div>
            </div>

            {/* Account info */}
            <div className="pp-panel pp-section">
              <div className="pp-top-line" />
              <div className="pp-section-label">Account</div>
              {[
                { k: "Username",     v: profile?.username },
                { k: "Email",        v: profile?.email },
                { k: "Role",         v: profile?.role },
                { k: "Activity",     v: profile?.activity },
                { k: "Member since", v: memberSince },
              ].filter(r => r.v).map(r => (
                <div className="pp-row" key={r.k}>
                  <span className="pp-row-key">{r.k}</span>
                  <span className="pp-row-val">{r.v}</span>
                </div>
              ))}
            </div>

            {/* Stats — afișate doar dacă backend-ul le returnează */}
            {[profile?.commentCount, profile?.networkRank, profile?.connections, profile?.posts]
              .some(v => v !== undefined) && (
              <div className="pp-panel pp-section">
                <div className="pp-top-line" />
                <div className="pp-section-label">Activity</div>
                <div className="pp-stats">
                  {profile.commentCount !== undefined && (
                    <div className="pp-stat">
                      <div className="pp-stat-val">{profile.commentCount.toLocaleString()}</div>
                      <div className="pp-stat-lbl">Comments</div>
                    </div>
                  )}
                  {profile.networkRank !== undefined && (
                    <div className="pp-stat">
                      <div className="pp-stat-val"><span className="acc">#</span>{profile.networkRank}</div>
                      <div className="pp-stat-lbl">Network Rank</div>
                    </div>
                  )}
                  {profile.connections !== undefined && (
                    <div className="pp-stat">
                      <div className="pp-stat-val">{profile.connections.toLocaleString()}</div>
                      <div className="pp-stat-lbl">Connections</div>
                    </div>
                  )}
                  {profile.posts !== undefined && (
                    <div className="pp-stat">
                      <div className="pp-stat-val">{profile.posts.toLocaleString()}</div>
                      <div className="pp-stat-lbl">Posts</div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="pp-toast"><CheckIcon /> Profile updated</div>
      )}
    </>
  );
}
