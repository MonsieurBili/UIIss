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

/* ─── Icons (inline SVG) ────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "fp-spin 0.7s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

const UserPlaceholder = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

/* ─── Styles ───────────────────────────────────────────────────────────── */
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

  @keyframes fp-spin    { to { transform: rotate(360deg); } }
  @keyframes fp-fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fp-pulse   { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  @keyframes fp-slide   { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }

  .fp-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    padding: 36px 20px 60px;
    position: relative;
    overflow-x: hidden;
  }

  .fp-grid-bg {
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(91,33,240,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(91,33,240,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none; z-index: 0;
  }

  .fp-glow {
    position: fixed; top: -20%; left: -10%;
    width: 50%; height: 70%;
    background: radial-gradient(ellipse, rgba(200,40,20,0.08) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  .fp-content {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    animation: fp-fade-up 0.5s ease both;
  }

  .fp-corner {
    position: fixed; width: 50px; height: 50px; z-index: 2; opacity: 0.4;
  }
  .fp-corner-tl { top:12px; left:12px; border-top:2px solid var(--purple); border-left:2px solid var(--purple); }
  .fp-corner-tr { top:12px; right:12px; border-top:2px solid var(--purple); border-right:2px solid var(--purple); }
  .fp-corner-bl { bottom:12px; left:12px; border-bottom:2px solid var(--purple); border-left:2px solid var(--purple); }
  .fp-corner-br { bottom:12px; right:12px; border-bottom:2px solid var(--purple); border-right:2px solid var(--purple); }

  /* Panel */
  .fp-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    position: relative;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
    margin-bottom: 16px;
  }
  .fp-panel::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--crimson-dim) 0%, transparent 50%);
    pointer-events: none;
  }

  .fp-top-line {
    position: absolute; top: 0; left: 20px; right: 20px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--crimson), transparent);
    animation: fp-pulse 3s ease-in-out infinite;
  }

  /* Header */
  .fp-header {
    display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
    gap: 16px; margin-bottom: 24px;
  }
  .fp-header h1 {
    font-family: var(--font-display); font-size: 28px; font-weight: 700;
    letter-spacing: 2px; color: var(--text-bright);
    text-shadow: 0 0 20px var(--crimson-glow);
  }
  .fp-header p {
    font-family: var(--font-body); font-size: 13px; color: var(--text-dim);
    margin-top: 4px;
  }

  .fp-header-right {
    display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
  }

  .fp-search-wrap {
    display: flex; gap: 8px; align-items: center;
  }
  .fp-search {
    background: var(--surface2);
    border: 1px solid var(--border);
    color: #fff;
    font-family: var(--font-body);
    font-size: 14px;
    padding: 8px 36px 8px 12px;
    width: 220px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    outline: none;
    transition: border-color 0.2s;
  }
  .fp-search:focus { border-color: var(--border-hover); }
  .fp-search-icon {
    position: absolute; margin-left: -28px; color: var(--text-dim); pointer-events: none;
  }

  .fp-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-display);
    font-size: 13px; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 9px 18px; border: none; cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: background 0.2s, box-shadow 0.2s;
  }
  .fp-btn-primary { background: var(--crimson); color: #fff; }
  .fp-btn-primary:hover:not(:disabled) { background: var(--crimson-dark); box-shadow: 0 0 24px var(--crimson-glow); }
  .fp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .fp-btn-secondary {
    background: transparent; color: var(--text-dim);
    border: 1px solid var(--border); clip-path: none;
  }
  .fp-btn-secondary:hover { border-color: var(--border-hover); color: var(--text); }

  .fp-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 800px) {
    .fp-grid { grid-template-columns: 1fr; }
  }

  .fp-section-label {
    font-family: var(--font-display);
    font-size: 10px; font-weight: 600;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--crimson);
    display: flex; align-items: center; gap: 10px;
    padding: 16px 20px 12px;
  }
  .fp-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .fp-friend-list { padding: 0 0 8px; }

  .fp-friend-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(232,65,42,0.06);
    transition: background 0.15s;
    animation: fp-slide 0.3s ease both;
  }
  .fp-friend-item:hover { background: rgba(255,255,255,0.02); }

  .fp-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--text-dim); overflow: hidden; flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .fp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .fp-avatar.online { border-color: rgba(77,224,154,0.4); box-shadow: 0 0 8px rgba(77,224,154,0.15); }

  .fp-friend-info { flex: 1; min-width: 0; }
  .fp-friend-name {
    font-family: var(--font-display); font-size: 14px; font-weight: 600;
    letter-spacing: 1px; color: var(--text-bright); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis;
  }
  .fp-friend-status {
    font-size: 11px; color: var(--success);
    display: flex; align-items: center; gap: 5px; margin-top: 2px;
  }
  .fp-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--success); box-shadow: 0 0 6px var(--success);
    animation: fp-pulse 2s infinite;
  }

  .fp-request-card {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 10px 20px;
    border-bottom: 1px solid rgba(232,65,42,0.06);
    animation: fp-slide 0.3s ease both;
  }
  .fp-request-user { display: flex; align-items: center; gap: 10px; }
  .fp-request-actions { display: flex; gap: 6px; }

  .fp-empty {
    text-align: center; padding: 28px 16px;
    font-size: 12px; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text-dim);
  }

  /* Toast */
  .fp-toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    display: flex; align-items: center; gap: 8px;
    background: rgba(77,224,154,0.08);
    border: 1px solid rgba(77,224,154,0.25);
    color: var(--success);
    padding: 10px 16px;
    font-family: var(--font-display);
    font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    animation: fp-fade-up 0.3s ease;
  }
`;

/* ─── Main component ────────────────────────────────────────────────────── */
export default function FriendsPage() {
  const navigate = useNavigate();
  const [friends,        setFriends]        = useState([]);
  const [requests,       setRequests]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [adding,         setAdding]         = useState(false);
  const [toast,          setToast]          = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        authFetch(`${API_BASE}/friends`),
        authFetch(`${API_BASE}/friends/friendsRequests`),
      ]);

      if (friendsRes.status === 401 || requestsRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/");
        return;
      }

      setFriends(friendsRes.status === 204 ? [] : await friendsRes.json());
      setRequests(requestsRes.status === 204 ? [] : await requestsRes.json());
    } catch (e) {
      setError("Failed to load friends data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch current user's profile to know our username
    authFetch(`${API_BASE}/profile`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.username) setCurrentUsername(data.username); })
      .catch(() => {});
  }, []);

  const handleAddFriend = async () => {
    if (!searchUsername.trim()) return;
    setAdding(true);
    try {
      const res = await authFetch(`${API_BASE}/friends/sendFriendRequest/${searchUsername.trim()}`, {
        method: "POST",
      });
      if (res.ok) {
        showToast(`Friend request sent to ${searchUsername.trim()}`);
        setSearchUsername("");
      } else if (res.status === 409) {
        showToast("Request already sent or you're already friends");
      } else {
        showToast("Failed to send request");
      }
    } catch {
      showToast("Connection error");
    } finally {
      setAdding(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await authFetch(`${API_BASE}/friends/${id}/accept`, { method: "POST" });
      if (res.ok) {
        showToast("Friend request accepted");
        fetchData();
      } else {
        showToast("Failed to accept");
      }
    } catch {
      showToast("Connection error");
    }
  };

  const handleDeny = async (id) => {
    try {
      const res = await authFetch(`${API_BASE}/friends/${id}/deny`, { method: "POST" });
      if (res.ok) {
        showToast("Friend request denied");
        fetchData();
      } else {
        showToast("Failed to deny");
      }
    } catch {
      showToast("Connection error");
    }
  };

  const getOtherUser = (friendship) => {
    if (!currentUsername) return friendship.user1;
    if (friendship.user1?.username === currentUsername) return friendship.user2;
    return friendship.user1;
  };

  const renderFriendItem = (friendship) => {
    const friend = getOtherUser(friendship);
    if (!friend) return null;
    return (
      <div key={friendship.id} className="fp-friend-item">
        <div className="fp-avatar online">
          {friend.profilePicUrl ? <img src={friend.profilePicUrl} alt="" /> : <UserPlaceholder />}
        </div>
        <div className="fp-friend-info">
          <div className="fp-friend-name">{friend.username}</div>
          <div className="fp-friend-status">
            <span className="fp-status-dot" /> Online
          </div>
        </div>
      </div>
    );
  };

  const renderRequestItem = (friendship) => {
    const sender = friendship.user1;
    return (
      <div key={friendship.id} className="fp-request-card">
        <div className="fp-request-user">
          <div className="fp-avatar" style={{ width: 32, height: 32 }}>
            {sender.profilePicUrl ? <img src={sender.profilePicUrl} alt="" /> : <UserPlaceholder />}
          </div>
          <span className="fp-friend-name" style={{ fontSize: 13 }}>{sender.username}</span>
        </div>
        <div className="fp-request-actions">
          <button className="fp-btn fp-btn-primary" onClick={() => handleAccept(friendship.id)} style={{ padding: '6px 12px', fontSize:11 }}>
            <CheckIcon /> Accept
          </button>
          <button className="fp-btn fp-btn-secondary" onClick={() => handleDeny(friendship.id)} style={{ padding: '6px 12px', fontSize:11 }}>
            <XIcon /> Deny
          </button>
        </div>
      </div>
    );
  };

  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="fp-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SpinnerIcon />
        <span style={{ marginLeft: 12, fontFamily: 'Rajdhani', letterSpacing: 2 }}>Loading friends…</span>
      </div>
    </>
  );

  if (error) return (
    <>
      <style>{CSS}</style>
      <div className="fp-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 24, clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
          <p style={{ color: 'var(--crimson)' }}>{error}</p>
          <button className="fp-btn fp-btn-primary" onClick={fetchData} style={{ marginTop: 12 }}>Retry</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="fp-root">
        <div className="fp-grid-bg" />
        <div className="fp-glow" />
        <div className="fp-corner fp-corner-tl" />
        <div className="fp-corner fp-corner-tr" />
        <div className="fp-corner fp-corner-bl" />
        <div className="fp-corner fp-corner-br" />

        <div className="fp-content">
          <div className="fp-header">
            <div>
              <h1>Friends Network</h1>
              <p>Manage your gaming circle and active connections.</p>
            </div>

            <div className="fp-header-right">
              {/* Search + Add Friend */}
              <div className="fp-search-wrap" style={{ position: 'relative' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="fp-search"
                    type="text"
                    placeholder="Find a friend..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                  />
                  <span className="fp-search-icon"><SearchIcon /></span>
                </div>
                <button className="fp-btn fp-btn-primary" onClick={handleAddFriend} disabled={adding || !searchUsername.trim()}>
                  {adding ? <SpinnerIcon /> : <AddIcon />} ADD FRIEND
                </button>
              </div>

              {/* Navigation buttons */}
              <button className="fp-btn fp-btn-secondary" onClick={() => navigate('/chat')}>
                <ChatIcon /> Messages
              </button>
              <button className="fp-btn fp-btn-secondary" onClick={() => navigate('/profile')}>
                <BackIcon /> Profile
              </button>
            </div>
          </div>

          <div className="fp-grid">
            {/* Active Friends */}
            <div className="fp-panel">
              <div className="fp-top-line" />
              <div className="fp-section-label">
                Active Friends
                <span style={{ background: 'var(--crimson)', color: '#fff', fontSize: 9, padding: '1px 6px', borderRadius: 10 }}>
                  {friends.length} ONLINE
                </span>
              </div>
              <div className="fp-friend-list">
                {friends.length === 0 ? (
                  <div className="fp-empty">No friends yet. Use the search to add gamers.</div>
                ) : (
                  friends.map(renderFriendItem)
                )}
              </div>
            </div>

            {/* Friend Requests */}
            <div className="fp-panel">
              <div className="fp-top-line" />
              <div className="fp-section-label">
                Friend Requests
                <span style={{ background: 'var(--crimson)', color: '#fff', fontSize: 9, padding: '1px 6px', borderRadius: 10 }}>
                  {requests.length}
                </span>
              </div>
              <div style={{ padding: '0 0 12px' }}>
                {requests.length === 0 ? (
                  <div className="fp-empty">No pending requests.</div>
                ) : (
                  requests.map(renderRequestItem)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="fp-toast"><CheckIcon /> {toast}</div>}
    </>
  );
}
