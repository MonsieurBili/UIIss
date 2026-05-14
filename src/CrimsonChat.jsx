import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;
const WS_URL   = `${import.meta.env.VITE_WS_URL}/websocket`;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Exo+2:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --red:        #e8412a;
  --red-dark:   #c0341f;
  --red-glow:   rgba(232,65,42,0.25);
  --bg:         #0b0b0e;
  --bg2:        #111115;
  --bg3:        #18181e;
  --bg4:        #1f1f27;
  --panel:      rgba(14,14,18,0.97);
  --border:     rgba(255,255,255,0.06);
  --border-red: rgba(232,65,42,0.3);
  --text:       #d0d0e0;
  --text-dim:   #606070;
  --text-bright:#ffffff;
  --online:     #3dd68c;
  --sidebar-w:  220px;
  --convlist-w: 280px;
}

html, body, #root { height: 100%; }

.cr-app {
  font-family: 'Exo 2', sans-serif;
  display: flex;
  height: 100vh;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
}

.cr-sidebar {
  width: var(--sidebar-w);
  background: var(--panel);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 10;
}

.cr-call-btn {
  background: transparent; border: 1px solid var(--border); color: var(--text);
  padding: 6px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px;
  font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; transition: 0.2s;
}
.cr-call-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); color: var(--text-bright); border-color: var(--text-dim); box-shadow: 0 0 10px rgba(255,255,255,0.05); }
.cr-call-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.cr-brand {
  padding: 18px 20px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
}

.cr-brand-logo {
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--red);
  text-shadow: 0 0 12px var(--red-glow);
}

.cr-user-card {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  background: rgba(232,65,42,0.04);
}

.cr-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--red-dark), #7a1a0a);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700; font-size: 14px; color: #fff;
  flex-shrink: 0; position: relative;
  border: 1px solid var(--border-red);
}

.cr-avatar-sm {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a2a3a, #1a1a28);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700; font-size: 15px; color: var(--text);
  flex-shrink: 0; border: 1px solid var(--border);
}

.cr-user-info { flex: 1; min-width: 0; }
.cr-user-name {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600; font-size: 14px;
  color: var(--text-bright); letter-spacing: 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.cr-nav { flex: 1; padding: 12px 0; }

.cr-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 20px; font-size: 13px; font-weight: 500;
  color: var(--text-dim); cursor: pointer;
  letter-spacing: 0.5px; transition: all 0.18s; position: relative;
}
.cr-nav-item:hover { color: var(--text); background: rgba(255,255,255,0.03); }
.cr-nav-item.active { color: var(--text-bright); background: rgba(232,65,42,0.08); }
.cr-nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--red); box-shadow: 0 0 8px var(--red-glow);
}

.cr-nav-icon { width: 16px; height: 16px; opacity: 0.7; }
.cr-nav-item.active .cr-nav-icon { opacity: 1; }

.cr-sidebar-footer { padding: 12px 0; border-top: 1px solid var(--border); }

.cr-convlist {
  width: var(--convlist-w);
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; flex-shrink: 0;
}

.cr-convlist-header {
  padding: 16px 18px 14px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}

.cr-convlist-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px; font-weight: 700;
  letter-spacing: 2px; color: var(--text-bright);
}

.cr-convlist-scroll { flex: 1; overflow-y: auto; }
.cr-convlist-scroll::-webkit-scrollbar { width: 3px; }
.cr-convlist-scroll::-webkit-scrollbar-track { background: transparent; }
.cr-convlist-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.cr-conv-item {
  display: flex; align-items: center; gap: 11px;
  padding: 11px 14px; cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 0.15s; position: relative;
}
.cr-conv-item:hover { background: rgba(255,255,255,0.03); }
.cr-conv-item.active { background: rgba(232,65,42,0.07); }
.cr-conv-item.active::after {
  content: ''; position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 2px; background: var(--red);
}

.cr-conv-info { flex: 1; min-width: 0; }
.cr-conv-name {
  font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 14px;
  color: var(--text-bright); letter-spacing: 0.5px;
  display: flex; align-items: center; justify-content: space-between;
}
.cr-conv-time { font-family: 'Exo 2', sans-serif; font-size: 10px; color: var(--text-dim); font-weight: 400; }
.cr-conv-preview { font-size: 11.5px; color: var(--text-dim); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.cr-chat { flex: 1; display: flex; flex-direction: column; background: var(--bg); min-width: 0; }

.cr-chat-header {
  padding: 0 24px; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: var(--bg2); flex-shrink: 0;
}

.cr-peer-name { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: 1px; color: var(--text-bright); }

.cr-messages {
  flex: 1; overflow-y: auto; padding: 24px;
  display: flex; flex-direction: column; gap: 6px;
}
.cr-messages::-webkit-scrollbar { width: 3px; }
.cr-messages::-webkit-scrollbar-track { background: transparent; }
.cr-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.cr-msg-row {
  display: flex; align-items: flex-end; gap: 10px;
  animation: cr-msg-in 0.25s ease both;
}
@keyframes cr-msg-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cr-msg-row.mine { flex-direction: row-reverse; }

.cr-bubble {
  max-width: 62%; padding: 10px 14px;
  font-size: 13.5px; line-height: 1.55;
  border-radius: 2px; position: relative; word-break: break-word;
}
.cr-bubble-them { background: var(--bg3); border: 1px solid var(--border); color: var(--text); border-radius: 2px 12px 12px 2px; }
.cr-bubble-mine { background: var(--red); color: #fff; border-radius: 12px 2px 2px 12px; box-shadow: 0 0 18px rgba(232,65,42,0.25); }
.cr-bubble-time { font-size: 9.5px; color: rgba(255,255,255,0.4); margin-top: 4px; letter-spacing: 0.5px; text-align: right; }
.cr-bubble-them .cr-bubble-time { color: var(--text-dim); text-align: left; }

.cr-inputbar {
  padding: 14px 20px; border-top: 1px solid var(--border);
  background: var(--bg2); display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}

.cr-msg-input {
  flex: 1; background: var(--bg3); border: 1px solid var(--border);
  outline: none; color: var(--text); font-family: 'Exo 2', sans-serif;
  font-size: 13.5px; padding: 11px 14px; border-radius: 3px;
}

.cr-send-btn {
  width: 38px; height: 38px; background: var(--red);
  border: none; border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #fff; flex-shrink: 0;
}
.cr-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.cr-search-wrap {
  padding: 14px 18px; background: var(--bg2);
  border-bottom: 1px solid var(--border); position: relative;
}
.cr-search {
  width: 100%; background: var(--bg4) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-bright) !important;
  font-family: 'Exo 2', sans-serif; font-size: 13px;
  padding: 10px 12px; outline: none; border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
.cr-search:focus { border-color: var(--red) !important; box-shadow: 0 0 12px var(--red-glow), inset 0 1px 3px rgba(0,0,0,0.5); background: var(--bg3) !important; }

.cr-no-conv {
  flex: 1; display: flex; align-items: center; justify-content: center;
  flex-direction: column;
  background: radial-gradient(circle at center, rgba(232,65,42,0.04) 0%, var(--bg) 70%);
}
.cr-empty-icon {
  width: 80px; height: 80px; background: var(--bg2);
  border: 1px solid var(--border-red); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--red); margin-bottom: 20px;
  box-shadow: 0 0 30px var(--red-glow); animation: cr-float 4s ease-in-out infinite;
}
.cr-empty-title {
  font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700;
  letter-spacing: 4px; color: var(--text-bright); margin-bottom: 8px; text-transform: uppercase;
}
.cr-empty-sub { font-size: 13px; color: var(--text-dim); letter-spacing: 1.5px; max-width: 250px; text-align: center; line-height: 1.6; }
@keyframes cr-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

.cr-live-badge {
  background: var(--red); color: #fff;
  font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 2px; padding: 3px 8px; border-radius: 2px;
}
.cr-live-badge.offline { background: var(--bg4); color: var(--text-dim); }

/* ════════════════════════════════════════════════════════════
   CALL UI
   ════════════════════════════════════════════════════════════ */

.cr-call-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  animation: cr-overlay-in 0.2s ease both;
}
@keyframes cr-overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.cr-call-panel {
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: 4px; width: 300px; overflow: hidden;
  position: relative; font-family: 'Exo 2', sans-serif;
  animation: cr-panel-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes cr-panel-in {
  from { opacity: 0; transform: scale(0.88) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.cr-call-body { padding: 30px 24px 26px; text-align: center; }

/* Avatar ring */
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

/* Status labels */
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

/* Animated dots */
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

/* Waveform */
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

/* Active call top bar */
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

/* Incoming flash bg */
.cr-call-incoming-bg {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(circle at 50% 40%, rgba(232,65,42,0.06) 0%, transparent 70%);
  animation: cr-flash 0.8s ease-in-out infinite;
}
@keyframes cr-flash { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

/* Call action buttons */
.cr-call-actions { display: flex; justify-content: center; gap: 18px; margin-top: 22px; }

.cr-call-action-btn {
  width: 54px; height: 54px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; flex-shrink: 0;
}
.cr-call-action-btn:hover  { transform: scale(1.08); }
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
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconHome    = () => <svg viewBox="0 0 16 16" fill="currentColor" className="cr-nav-icon"><path d="M8 1L1 7h2v7h4v-4h2v4h4V7h2L8 1z"/></svg>;
const IconFriends = () => <svg viewBox="0 0 16 16" fill="currentColor" className="cr-nav-icon"><path d="M5 8a3 3 0 100-6 3 3 0 000 6zm-4 6a4 4 0 018 0H1zm10-6a2 2 0 100-4 2 2 0 000 4zm2 6a3 3 0 00-5.33-1.5A5 5 0 0115 14h-2z"/></svg>;
const IconChat    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:16,height:16}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconSend    = () => <svg viewBox="0 0 16 16" fill="currentColor" style={{width:16,height:16}}><path d="M1 1l14 7-14 7V9.5l10-1.5-10-1.5V1z"/></svg>;
const IconCall    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

// ─── CALL ICONS ───────────────────────────────────────────────────────────────
const IconPhoneEnd = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: "rotate(135deg)" }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
      19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3
      a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09
      9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0
      2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconPhoneAccept = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

// ─── UTILS ───────────────────────────────────────────────────────────────────
function initials(name = "") {
  return name.split(/[\s_]+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function fmtTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function dedupeMessages(msgs) {
  const map = new Map();
  for (const m of msgs) {
    const key = m.id != null ? String(m.id) : `tmp-${m.timestamp}-${m.content}`;
    map.set(key, m);
  }
  return Array.from(map.values());
}

// ─── HOOK: Timer apel activ ───────────────────────────────────────────────────
function useCallTimer(active) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!active) { setSecs(0); return; }
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ─── CALL SCREENS ─────────────────────────────────────────────────────────────

function CallingScreen({ peerUsername, onHangUp }) {
  const [muted, setMuted] = useState(false);
  return (
    <div className="cr-call-overlay">
      <div className="cr-call-panel">
        <div className="cr-call-body">
          <div className="cr-call-avatar-ring">
            <div className="cr-call-avatar-large">{initials(peerUsername)}</div>
          </div>
          <div className="cr-call-status-label">SE APELEAZĂ</div>
          <div className="cr-call-peer-name">{peerUsername}</div>
          <div className="cr-call-dots"><span/><span/><span/></div>
          <div className="cr-call-actions">
            <button
              className={`cr-call-action-btn cr-call-btn-mute${muted ? " muted" : ""}`}
              onClick={() => setMuted(m => !m)}
              title={muted ? "Activează microfon" : "Dezactivează microfon"}
            >
              <IconMic muted={muted} />
            </button>
            <button className="cr-call-action-btn cr-call-btn-end" onClick={onHangUp} title="Anulează">
              <IconPhoneEnd />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveCallScreen({ peerUsername, onHangUp }) {
  const [muted, setMuted] = useState(false);
  const timer = useCallTimer(true);
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
            {[...Array(9)].map((_, i) => <div key={i} className="cr-call-wave-bar"/>)}
          </div>
          <div className="cr-call-actions">
            <button
              className={`cr-call-action-btn cr-call-btn-mute${muted ? " muted" : ""}`}
              onClick={() => setMuted(m => !m)}
              title={muted ? "Activează microfon" : "Dezactivează microfon"}
            >
              <IconMic muted={muted} />
            </button>
            <button className="cr-call-action-btn cr-call-btn-end" onClick={onHangUp} title="Închide">
              <IconPhoneEnd />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomingCallScreen({ callerUsername, onAccept, onReject }) {
  return (
    <div className="cr-call-overlay">
      <div className="cr-call-panel" style={{ overflow: "hidden" }}>
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
            <button className="cr-call-action-btn cr-call-btn-end" onClick={onReject} title="Respinge">
              <IconPhoneEnd />
            </button>
            <button className="cr-call-action-btn cr-call-btn-accept" onClick={onAccept} title="Acceptă">
              <IconPhoneAccept />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CrimsonChat({ token, currentUser }) {
  const navigate = useNavigate();

  // ── State & Refs ──
  const [localStream, setLocalStream] = useState(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const jwt = token || localStorage.getItem("token") || "";
  const me  = currentUser
    || JSON.parse(localStorage.getItem("currentUser") || "null")
    || { id: null, username: "You" };

  const [conversations, setConversations] = useState([]);
  const [activeConv,    setActiveConv]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [inputText,     setInputText]     = useState("");
  const [search,        setSearch]        = useState("");
  const [loading,       setLoading]       = useState(true);
  const [wsConnected,   setWsConnected]   = useState(false);
  const [navActive,     setNavActive]     = useState("messages");

  // ── CALL STATE ──
  // null | { type: "calling", peer: string }
  //       | { type: "active",  peer: string }
  //       | { type: "incoming", caller: string, signal: object }
  const [callState, setCallState] = useState(null);

  const activeConvRef = useRef(null);
  const stompRef      = useRef(null);
  const messagesEnd   = useRef(null);

  activeConvRef.current = activeConv;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNavClick = (id) => {
    setNavActive(id);
    if (id === "home")     navigate("/profile");
    if (id === "friends")  navigate("/friends");
    if (id === "messages") navigate("/chat");
  };

  // ── Fetch conversații ──
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.status === 204) {
        setConversations([]);
      } else if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.error("Failed to fetch conversations:", e);
    }
  }, [jwt]);

  useEffect(() => {
    setLoading(true);
    fetchConversations().finally(() => setLoading(false));
  }, [fetchConversations]);

  // ── WEBRTC HELPERS ────────────────────────────────────────────────────────

  const sendSignal = useCallback((message) => {
    if (!stompRef.current?.connected) return;
    const messageWithSender = { ...message, senderUsername: me.username };
    stompRef.current.publish({
      destination: "/app/call/signal",
      body: JSON.stringify(messageWithSender),
    });
  }, [me.username]);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error("Eroare la accesarea microfonului:", error);
      alert("Nu am putut accesa microfonul.");
      return null;
    }
  };

  const createPeerConnection = useCallback((targetUsername) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };

    const pc = new RTCPeerConnection(configuration);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ targetUsername, type: "ICE_CANDIDATE", payload: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [sendSignal]);

  const createPeerConnectionWithTurn = useCallback((targetUsername, turn) => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: `turn:issproject.metered.live:80`,
          username: turn.username,
          credential: turn.credential,
        },
        {
          urls: `turn:issproject.metered.live:80?transport=tcp`,
          username: turn.username,
          credential: turn.credential,
        },
      ]
    };

    const pc = new RTCPeerConnection(configuration);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ targetUsername, type: "ICE_CANDIDATE", payload: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [sendSignal]);

  // ── Curăță apelul ────────────────────────────────────────────────────────
  const cleanupCall = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setCallState(null);
  }, []);

  // ── Handlers call UI ────────────────────────────────────────────────────
  const handleAcceptCall = async () => {
    if (!callState || callState.type !== "incoming") return;
    const { caller, signal } = callState;

    const stream = await startMicrophone();
    if (!stream) return;

    let turn = { username: "", credential: "" };
    try {
      const res = await fetch(`${API_BASE}/turn/credentials`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) turn = await res.json();
    } catch (e) {
      console.warn("TURN credentials fetch failed, falling back to STUN only:", e);
    }

    const pc = createPeerConnectionWithTurn(caller, turn);
    await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    sendSignal({ targetUsername: caller, type: "ANSWER", payload: answer });
    setCallState({ type: "active", peer: caller });
  };

  const handleRejectCall = () => {
    if (!callState) return;
    sendSignal({ targetUsername: callState.caller, type: "REJECT" });
    cleanupCall();
  };

  const handleHangUp = () => {
    if (!callState) return;
    const peer = callState.peer || callState.caller;
    sendSignal({ targetUsername: peer, type: "HANGUP" });
    cleanupCall();
  };

  // ── Conexiune WebSocket ────────────────────────────────────────────────────
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${jwt}` },
      reconnectDelay: 5000,

      onConnect: () => {
        setWsConnected(true);

        // 1. Subscripție CHAT TEXT
        client.subscribe(`/user/queue/messages`, (frame) => {
          const msg = JSON.parse(frame.body);
          const currentConv = activeConvRef.current;
          const belongsToActive =
            currentConv &&
            (msg.sender?.username === currentConv.user1?.username ||
             msg.sender?.username === currentConv.user2?.username) &&
            (msg.receiver?.username === currentConv.user1?.username ||
             msg.receiver?.username === currentConv.user2?.username);

          if (belongsToActive) {
            setMessages(prev => dedupeMessages([...prev, { ...msg, mine: msg.sender?.username === me.username }]));
          }

          setConversations(prev =>
            prev.map(conv => {
              const involvesSender   = conv.user1?.username === msg.sender?.username   || conv.user2?.username === msg.sender?.username;
              const involvesReceiver = conv.user1?.username === msg.receiver?.username || conv.user2?.username === msg.receiver?.username;
              if (involvesSender && involvesReceiver) {
                return { ...conv, lastMessagePreview: msg.content, lastMessageTime: msg.timestamp };
              }
              return conv;
            })
          );
        });

        // 2. Subscripție SEMNALIZARE WEBRTC
        client.subscribe(`/user/queue/call`, async (frame) => {
          const signal = JSON.parse(frame.body);
          const caller = signal.senderUsername;

          if (signal.type === "OFFER") {
            // ← înlocuiește window.confirm cu UI-ul nostru
            setCallState({ type: "incoming", caller, signal });

          } else if (signal.type === "ANSWER") {
            const pc = peerConnectionRef.current;
            if (pc) {
              await pc.setRemoteDescription(new RTCSessionDescription(signal.payload));
            }
            // Trecem în ecranul "activ"
            setCallState(prev => prev ? { ...prev, type: "active" } : null);

          } else if (signal.type === "ICE_CANDIDATE") {
            const pc = peerConnectionRef.current;
            if (pc && signal.payload) {
              await pc.addIceCandidate(new RTCIceCandidate(signal.payload));
            }

          } else if (signal.type === "HANGUP" || signal.type === "REJECT") {
            cleanupCall();
          }
        });
      },

      onDisconnect: () => setWsConnected(false),
    });

    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [jwt, me.username, createPeerConnection, sendSignal, cleanupCall]);

  // ── Selectare conversație ──────────────────────────────────────────────────
  const selectConversation = useCallback(async (conv) => {
    if (!conv?.id) return;
    setActiveConv(conv);
    setMessages([]);
    try {
      const res = await fetch(`${API_BASE}/conversations/${conv.id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        const msgs = data.map(m => ({ ...m, mine: m.sender?.username === me.username }));
        setMessages(dedupeMessages(msgs));
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    }
  }, [jwt, me.username]);

  // ── Trimitere mesaj ────────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    if (!inputText.trim() || !activeConv || !stompRef.current?.connected) return;

    const receiver = activeConv.user1?.username === me.username ? activeConv.user2 : activeConv.user1;
    stompRef.current.publish({
      destination: "/app/chat",
      body: JSON.stringify({ user1: receiver?.id, message: inputText.trim() }),
    });

    setInputText("");
  }, [inputText, activeConv, me.username]);

  // ── Inițiere Apel WebRTC ───────────────────────────────────────────────────
  const handleCallClick = async () => {
    if (!activePeer) return;

    const stream = await startMicrophone();
    if (!stream) return;

    let turn = { username: "", credential: "" };
    try {
      const res = await fetch(`${API_BASE}/turn/credentials`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) turn = await res.json();
    } catch (e) {
      console.warn("TURN credentials fetch failed, falling back to STUN only:", e);
    }

    setCallState({ type: "calling", peer: activePeer.username });

    const pc = createPeerConnectionWithTurn(activePeer.username, turn);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    sendSignal({ targetUsername: activePeer.username, type: "OFFER", payload: offer });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Filtrare conversații ───────────────────────────────────────────────────
  const filtered = conversations.filter(c => {
    const peer = c.user1?.username === me.username ? c.user2 : c.user1;
    return (peer?.username || "").toLowerCase().includes(search.toLowerCase());
  });

  const activePeer = activeConv
    ? (activeConv.user1?.username === me.username ? activeConv.user2 : activeConv.user1)
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="cr-app">

        {/* SIDEBAR */}
        <aside className="cr-sidebar">
          <div className="cr-brand"><div className="cr-brand-logo">CRIMSON</div></div>
          <div className="cr-user-card">
            <div className="cr-avatar">{initials(me.username)}</div>
            <div className="cr-user-info"><div className="cr-user-name">{me.username}</div></div>
          </div>
          <nav className="cr-nav">
            {[
              { id: "home",     label: "Profile",  icon: <IconHome /> },
              { id: "messages", label: "Messages", icon: <IconChat /> },
              { id: "friends",  label: "Friends",  icon: <IconFriends /> },
            ].map(item => (
              <div
                key={item.id}
                className={`cr-nav-item ${navActive === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.icon} {item.label}
              </div>
            ))}
          </nav>
          <div className="cr-sidebar-footer">
            <div className="cr-nav-item" onClick={handleSignOut}>Sign Out</div>
          </div>
        </aside>

        {/* LISTA CONVERSAȚII */}
        <section className="cr-convlist">
          <div className="cr-convlist-header">
            <div className="cr-convlist-title">Messages</div>
          </div>
          <div className="cr-search-wrap">
            <input
              className="cr-search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cr-convlist-scroll">
            {loading && <div style={{padding:"16px",color:"var(--text-dim)",fontSize:13}}>Loading...</div>}
            {!loading && filtered.length === 0 && (
              <div style={{padding:"16px",color:"var(--text-dim)",fontSize:13}}>No conversations</div>
            )}
            {filtered.map(conv => {
              const peer    = conv.user1?.username === me.username ? conv.user2 : conv.user1;
              const preview = conv.lastMessagePreview;
              const time    = conv.lastMessageTime;
              return (
                <div
                  key={conv.id}
                  className={`cr-conv-item ${activeConv?.id === conv.id ? "active" : ""}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="cr-avatar-sm">{initials(peer?.username)}</div>
                  <div className="cr-conv-info">
                    <div className="cr-conv-name">
                      {peer?.username || "Unknown"}
                      <span className="cr-conv-time">{time ? fmtTime(time) : ""}</span>
                    </div>
                    <div className="cr-conv-preview">{preview || "No messages yet"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ZONA DE CHAT */}
        <main className="cr-chat">
          {!activeConv ? (
            <div className="cr-no-conv">
              <div className="cr-empty-icon">
                <IconChat />
              </div>
              <div className="cr-empty-title">No chat selected</div>
              <div className="cr-empty-sub">Select a conversation to start chatting</div>
            </div>
          ) : (
            <>
              <div className="cr-chat-header">
                <div className="cr-peer-name">{activePeer?.username}</div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <button
                    className="cr-call-btn"
                    onClick={handleCallClick}
                    disabled={!wsConnected || !!callState}
                  >
                    <IconCall /> CALL
                  </button>
                  <div className={`cr-live-badge ${wsConnected ? "" : "offline"}`}>
                    {wsConnected ? "CONNECTED" : "OFFLINE"}
                  </div>
                </div>
              </div>

              <div className="cr-messages">
                {messages.map((msg, i) => (
                  <div key={msg.id ?? `tmp-${i}`} className={`cr-msg-row ${msg.mine ? "mine" : ""}`}>
                    <div className={`cr-bubble ${msg.mine ? "cr-bubble-mine" : "cr-bubble-them"}`}>
                      {msg.content}
                      <div className="cr-bubble-time">{fmtTime(msg.timestamp)}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEnd} />
              </div>

              <div className="cr-inputbar">
                <input
                  className="cr-msg-input"
                  placeholder={wsConnected ? "Type a message..." : "Reconnecting..."}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={!wsConnected}
                />
                <button
                  className="cr-send-btn"
                  onClick={sendMessage}
                  disabled={!wsConnected || !inputText.trim()}
                >
                  <IconSend />
                </button>
              </div>
            </>
          )}

          {/* Audio element pentru voce */}
          <audio ref={remoteAudioRef} autoPlay />
        </main>
      </div>

      {/* ── CALL OVERLAYS ── */}
      {callState?.type === "calling" && (
        <CallingScreen peerUsername={callState.peer} onHangUp={handleHangUp} />
      )}
      {callState?.type === "active" && (
        <ActiveCallScreen peerUsername={callState.peer} onHangUp={handleHangUp} />
      )}
      {callState?.type === "incoming" && (
        <IncomingCallScreen
          callerUsername={callState.caller}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
    </>
  );
}
