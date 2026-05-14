// ─── CRIMSON CALL UI COMPONENTS ──────────────────────────────────────────────
// Adaugă acest CSS în blocul `css` din CrimsonChat.jsx (lângă restul stilurilor)
// și folosește componentele <CallingScreen>, <ActiveCallScreen>, <IncomingCallScreen>
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. CSS de adăugat în blocul `css = \`...\`` ────────────────────────────
export const callCSS = `
/* ── CALL OVERLAY ── */
.cr-call-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
}

.cr-call-panel {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 4px; width: 300px; overflow: hidden;
  position: relative; font-family: 'Exo 2', sans-serif;
}

/* ── AVATAR RING ── */
.cr-call-avatar-ring {
  width: 90px; height: 90px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; position: relative;
}
.cr-call-avatar-ring::before {
  content: ''; position: absolute; inset: -8px; border-radius: 50%;
  border: 1px solid var(--border-red);
  animation: cr-ring-pulse 2s ease-in-out infinite;
}
.cr-call-avatar-ring::after {
  content: ''; position: absolute; inset: -18px; border-radius: 50%;
  border: 1px solid rgba(232,65,42,0.10);
  animation: cr-ring-pulse 2s ease-in-out infinite 0.4s;
}
@keyframes cr-ring-pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.3; transform: scale(1.06); }
}

.cr-call-avatar-ring.connected::before { animation: none; border-color: rgba(61,214,140,0.4); }
.cr-call-avatar-ring.connected::after  { animation: none; border-color: rgba(61,214,140,0.12); }

.cr-call-avatar-large {
  width: 90px; height: 90px; border-radius: 50%;
  background: linear-gradient(135deg, var(--red-dark), #7a1a0a);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif; font-weight: 700;
  font-size: 30px; color: #fff; border: 1px solid var(--border-red);
  position: relative; z-index: 1; flex-shrink: 0;
  transition: background 0.4s, border-color 0.4s;
}
.cr-call-avatar-large.connected {
  background: linear-gradient(135deg, #1a4a2e, #0d2818);
  border-color: rgba(61,214,140,0.35);
}

/* ── CALL STATUS TEXT ── */
.cr-call-status-label {
  font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 3px; color: var(--text-dim);
  text-align: center; margin-bottom: 6px; text-transform: uppercase;
}
.cr-call-status-label.ringing { color: var(--red); }

.cr-call-peer-name {
  font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700;
  letter-spacing: 2px; color: var(--text-bright); text-align: center;
}

/* ── PULSING DOTS ── */
.cr-call-dots { display: inline-flex; gap: 5px; justify-content: center; margin-top: 8px; }
.cr-call-dots span {
  width: 5px; height: 5px; border-radius: 50%; background: var(--text-dim);
  animation: cr-dot-blink 1.4s infinite;
}
.cr-call-dots span:nth-child(2) { animation-delay: 0.2s; }
.cr-call-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes cr-dot-blink {
  0%,80%,100% { opacity: 0.3; }
  40%          { opacity: 1; }
}

/* ── WAVEFORM ── */
.cr-call-waveform {
  display: flex; align-items: center; justify-content: center;
  gap: 3px; height: 30px; margin: 10px 0;
}
.cr-call-wave-bar {
  width: 3px; border-radius: 2px; background: var(--red);
  animation: cr-wave 0.8s ease-in-out infinite;
}
.cr-call-wave-bar:nth-child(1) { height: 8px;  animation-delay: 0s; }
.cr-call-wave-bar:nth-child(2) { height: 16px; animation-delay: 0.1s; }
.cr-call-wave-bar:nth-child(3) { height: 24px; animation-delay: 0.2s; }
.cr-call-wave-bar:nth-child(4) { height: 30px; animation-delay: 0.15s; }
.cr-call-wave-bar:nth-child(5) { height: 20px; animation-delay: 0.25s; }
.cr-call-wave-bar:nth-child(6) { height: 12px; animation-delay: 0.05s; }
.cr-call-wave-bar:nth-child(7) { height: 22px; animation-delay: 0.3s; }
.cr-call-wave-bar:nth-child(8) { height: 14px; animation-delay: 0.1s; }
.cr-call-wave-bar:nth-child(9) { height: 8px;  animation-delay: 0.2s; }
@keyframes cr-wave {
  0%,100% { transform: scaleY(0.35); opacity: 0.5; }
  50%      { transform: scaleY(1); opacity: 1; }
}

/* ── TIMER BAR (top strip pentru apel activ) ── */
.cr-call-mini-bar {
  background: rgba(232,65,42,0.08); border-bottom: 1px solid var(--border-red);
  padding: 8px 16px; display: flex; align-items: center; gap: 8px;
  font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 2px; color: var(--red);
}
.cr-call-mini-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--red);
  animation: cr-blink-step 1s steps(1) infinite;
}
@keyframes cr-blink-step { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }

/* ── INCOMING FLASH BG ── */
.cr-call-incoming-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 50% 40%, rgba(232,65,42,0.06) 0%, transparent 70%);
  animation: cr-flash 0.8s ease-in-out infinite;
}
@keyframes cr-flash { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

/* ── CALL BUTTONS ── */
.cr-call-actions { display: flex; justify-content: center; gap: 18px; margin-top: 22px; }

.cr-call-action-btn {
  width: 54px; height: 54px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; flex-shrink: 0;
}
.cr-call-action-btn:hover { transform: scale(1.08); }
.cr-call-action-btn:active { transform: scale(0.96); }

.cr-call-btn-end {
  background: var(--red); box-shadow: 0 0 16px rgba(232,65,42,0.35);
}
.cr-call-btn-end:hover { box-shadow: 0 0 26px rgba(232,65,42,0.6); }

.cr-call-btn-accept {
  background: #1a9e5c; box-shadow: 0 0 16px rgba(26,158,92,0.35);
  animation: cr-accept-bounce 1s ease-in-out infinite;
}
.cr-call-btn-accept:hover {
  box-shadow: 0 0 26px rgba(26,158,92,0.6);
  animation: none; transform: scale(1.08);
}
@keyframes cr-accept-bounce {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.07); }
}

.cr-call-btn-mute {
  background: var(--bg4); border: 1px solid var(--border);
}
.cr-call-btn-mute:hover { border-color: var(--text-dim); }
.cr-call-btn-mute.muted { background: rgba(232,65,42,0.15); border-color: var(--border-red); }

/* ── CONTENT PADDING ── */
.cr-call-body { padding: 30px 24px 26px; text-align: center; }
`;

// ── 2. ICONS ──────────────────────────────────────────────────────────────────
const IconPhone = ({ rotate = 0, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: `rotate(${rotate}deg)` }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
      19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3
      a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09
      9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0
      2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconMic = ({ muted = false }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
    stroke={muted ? "var(--red)" : "#d0d0e0"} strokeWidth="2" strokeLinecap="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
    {muted && <line x1="4" y1="4" x2="20" y2="20" stroke="var(--red)" strokeWidth="2"/>}
  </svg>
);

// ── 3. UTILS ──────────────────────────────────────────────────────────────────
function initials(name = "") {
  return name.split(/[\s_]+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function useTimer(active) {
  const [secs, setSecs] = React.useState(0);
  React.useEffect(() => {
    if (!active) { setSecs(0); return; }
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ── 4. COMPONENT: Ecran "Se apelează..." ──────────────────────────────────────
/**
 * Props:
 *   peerUsername: string   — numele celui sunat
 *   onHangUp: () => void   — callback când utilizatorul închide
 */
export function CallingScreen({ peerUsername, onHangUp }) {
  const [muted, setMuted] = React.useState(false);

  return (
    <div className="cr-call-overlay">
      <div className="cr-call-panel">
        <div className="cr-call-body">
          <div className="cr-call-avatar-ring">
            <div className="cr-call-avatar-large">{initials(peerUsername)}</div>
          </div>
          <div className="cr-call-status-label">SE APELEAZĂ</div>
          <div className="cr-call-peer-name">{peerUsername}</div>
          <div className="cr-call-dots">
            <span/><span/><span/>
          </div>
          <div className="cr-call-actions">
            <button
              className={`cr-call-action-btn cr-call-btn-mute ${muted ? "muted" : ""}`}
              onClick={() => setMuted(m => !m)}
              title={muted ? "Activează microfon" : "Dezactivează microfon"}
            >
              <IconMic muted={muted} />
            </button>
            <button
              className="cr-call-action-btn cr-call-btn-end"
              onClick={onHangUp}
              title="Anulează apelul"
            >
              <IconPhone rotate={135} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 5. COMPONENT: Ecran "Ești în apel" ───────────────────────────────────────
/**
 * Props:
 *   peerUsername: string   — numele persoanei cu care vorbești
 *   onHangUp: () => void   — callback când închizi apelul
 */
export function ActiveCallScreen({ peerUsername, onHangUp }) {
  const [muted, setMuted] = React.useState(false);
  const timer = useTimer(true);

  return (
    <div className="cr-call-overlay">
      <div className="cr-call-panel">
        <div className="cr-call-mini-bar">
          <div className="cr-call-mini-dot"/>
          ÎN APEL · {timer}
        </div>
        <div className="cr-call-body">
          <div className="cr-call-avatar-ring connected">
            <div className="cr-call-avatar-large connected">{initials(peerUsername)}</div>
          </div>
          <div className="cr-call-peer-name">{peerUsername}</div>
          <div className="cr-call-waveform">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="cr-call-wave-bar"/>
            ))}
          </div>
          <div className="cr-call-actions">
            <button
              className={`cr-call-action-btn cr-call-btn-mute ${muted ? "muted" : ""}`}
              onClick={() => setMuted(m => !m)}
              title={muted ? "Activează microfon" : "Dezactivează microfon"}
            >
              <IconMic muted={muted} />
            </button>
            <button
              className="cr-call-action-btn cr-call-btn-end"
              onClick={onHangUp}
              title="Închide apelul"
            >
              <IconPhone rotate={135} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. COMPONENT: Ecran "Ești sunat" ─────────────────────────────────────────
/**
 * Props:
 *   callerUsername: string   — numele celui care te sună
 *   onAccept: () => void     — callback când accepți
 *   onReject: () => void     — callback când refuzi
 */
export function IncomingCallScreen({ callerUsername, onAccept, onReject }) {
  return (
    <div className="cr-call-overlay">
      <div className="cr-call-panel" style={{ position: "relative", overflow: "hidden" }}>
        <div className="cr-call-incoming-bg"/>
        <div className="cr-call-body">
          <div className="cr-call-status-label ringing">APEL PRIMIT</div>
          <div className="cr-call-avatar-ring" style={{ marginTop: 8 }}>
            <div className="cr-call-avatar-large">{initials(callerUsername)}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="cr-call-peer-name">{callerUsername}</div>
            <div className="cr-call-status-label" style={{ marginTop: 4 }}>te sună...</div>
          </div>
          <div className="cr-call-actions">
            <button
              className="cr-call-action-btn cr-call-btn-end"
              onClick={onReject}
              title="Respinge"
            >
              <IconPhone rotate={135} />
            </button>
            <button
              className="cr-call-action-btn cr-call-btn-accept"
              onClick={onAccept}
              title="Acceptă"
            >
              <IconPhone />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── 7. CUM INTEGREZI ÎN CrimsonChat.jsx ──────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
//
// PASUL 1 — Adaugă stări în componenta principală:
//
//   const [callState, setCallState] = useState(null);
//   // Valori posibile:
//   //   null                              → niciun apel
//   //   { type: "calling",  peer }        → tu suni pe cineva
//   //   { type: "active",   peer }        → ești în apel
//   //   { type: "incoming", caller }      → ești sunat
//
// PASUL 2 — Modifică handleCallClick:
//
//   const handleCallClick = async () => {
//     if (!activePeer) return;
//     const stream = await startMicrophone();
//     if (!stream) return;
//     setCallState({ type: "calling", peer: activePeer.username });
//     const pc = createPeerConnection(activePeer.username);
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     sendSignal({ targetUsername: activePeer.username, type: "OFFER", payload: offer });
//   };
//
// PASUL 3 — Modifică gestionarea semnalelor WebRTC în onConnect:
//
//   if (signal.type === "OFFER") {
//     // Înlocuiește window.confirm cu starea React:
//     setCallState({ type: "incoming", caller: signal.senderUsername, signal });
//
//   } else if (signal.type === "ANSWER") {
//     setCallState(prev => prev ? { ...prev, type: "active" } : null);
//     const pc = peerConnectionRef.current;
//     if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
//   }
//
// PASUL 4 — Adaugă handler-ele pentru butoanele de apel:
//
//   const handleAcceptCall = async () => {
//     const { caller, signal } = callState;
//     const stream = await startMicrophone();
//     if (!stream) return;
//     const pc = createPeerConnection(caller);
//     await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     sendSignal({ targetUsername: caller, type: "ANSWER", payload: answer });
//     setCallState({ type: "active", peer: caller });
//   };
//
//   const handleRejectCall = () => {
//     sendSignal({ targetUsername: callState.caller, type: "REJECT" });
//     setCallState(null);
//   };
//
//   const handleHangUp = () => {
//     peerConnectionRef.current?.close();
//     peerConnectionRef.current = null;
//     localStreamRef.current?.getTracks().forEach(t => t.stop());
//     localStreamRef.current = null;
//     setLocalStream(null);
//     setCallState(null);
//   };
//
// PASUL 5 — Adaugă în return(), înainte de </> final:
//
//   {callState?.type === "calling" && (
//     <CallingScreen peerUsername={callState.peer} onHangUp={handleHangUp} />
//   )}
//   {callState?.type === "active" && (
//     <ActiveCallScreen peerUsername={callState.peer} onHangUp={handleHangUp} />
//   )}
//   {callState?.type === "incoming" && (
//     <IncomingCallScreen
//       callerUsername={callState.caller}
//       onAccept={handleAcceptCall}
//       onReject={handleRejectCall}
//     />
//   )}
//
// PASUL 6 — Adaugă `callCSS` în blocul css existent:
//   const css = `...stilurile existente...` + callCSS;
//
// ─────────────────────────────────────────────────────────────────────────────
