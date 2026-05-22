import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import CreateRequest from "./pages/CreateRequest";
import AdminRequests from "./pages/AdminRequests";
import AccessLogs from "./pages/AccessLogs";

function AppLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: "#111827", color: "#e2e8f0", border: "1px solid #1f2d45" }
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><AppLayout><MyRequests /></AppLayout></ProtectedRoute>} />
          <Route path="/create-request" element={<ProtectedRoute><AppLayout><CreateRequest /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute adminOnly><AppLayout><AdminRequests /></AppLayout></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute adminOnly><AppLayout><AccessLogs /></AppLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}