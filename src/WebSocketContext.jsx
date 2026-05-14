import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [wsConnected, setWsConnected] = useState(false);
  const stompRef = useRef(null);
  // Monitorizăm token-ul din localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      if (stompRef.current) stompRef.current.deactivate();
      setWsConnected(false);
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/websocket"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Global WebSocket Connected");
        setWsConnected(true);
      },
      onDisconnect: () => {
        console.log("Global WebSocket Disconnected");
        setWsConnected(false);
      },
    });

    client.activate();
    stompRef.current = client;

    return () => {
      if (stompRef.current) stompRef.current.deactivate();
    };
  }, [token]); // Se reconectează automat când apare/se schimbă token-ul (la login)

  return (
    <WebSocketContext.Provider value={{ stompClient: stompRef.current, wsConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);