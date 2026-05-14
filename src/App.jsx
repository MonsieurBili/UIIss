import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WebSocketProvider } from "./WebSocketContext"; // Importă provider-ul
import CrimsonGateway from "./CrimsonGateway";
import ProfilePage from "./ProfilePage";
import FriendsPage from "./FriendsPage";
import CrimsonChat from "./CrimsonChat";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <WebSocketProvider> {/* Înfășoară rutele aici */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CrimsonGateway />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/friends" element={<PrivateRoute><FriendsPage /></PrivateRoute>} />
          <Route path="/chat"    element={<PrivateRoute><CrimsonChat /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}