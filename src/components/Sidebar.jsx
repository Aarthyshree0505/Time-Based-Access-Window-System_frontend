import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, FilePlus, FileText, CheckSquare,
  ScrollText, LogOut, Shield
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: <LayoutDashboard size={17} />, label: "Dashboard" },
  { to: "/create-request", icon: <FilePlus size={17} />, label: "New Request" },
  { to: "/my-requests", icon: <FileText size={17} />, label: "My Requests" },
];

const adminItems = [
  { to: "/admin/requests", icon: <CheckSquare size={17} />, label: "All Requests" },
  { to: "/admin/logs", icon: <ScrollText size={17} />, label: "Access Logs" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside style={{
      width: 240, background: "var(--surface)", borderRight: "1px solid var(--border)",
      position: "fixed", top: 0, left: 0, height: "100vh", display: "flex",
      flexDirection: "column", padding: "24px 16px", zIndex: 100
    }}>
      <div style={{ marginBottom: 32, padding: "0 8px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.5px", color: "var(--accent)" }}>
          AccessFlow
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>Access Management</div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
            borderRadius: 8, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
            color: isActive ? "var(--accent)" : "var(--muted)",
            background: isActive ? "rgba(59,130,246,0.1)" : "transparent",
            transition: "all 0.15s"
          })}>
            {item.icon}{item.label}
          </NavLink>
        ))}

        {user?.role === "ADMIN" && (
          <>
            <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", padding: "12px 12px 4px", display: "flex", alignItems: "center", gap: 6 }}>
              <Shield size={11} /> Admin
            </div>
            {adminItems.map(item => (
              <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                borderRadius: 8, textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
                color: isActive ? "var(--accent)" : "var(--muted)",
                background: isActive ? "rgba(59,130,246,0.1)" : "transparent",
                transition: "all 0.15s"
              })}>
                {item.icon}{item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <div style={{ padding: "8px 12px", marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{user?.name}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{user?.role}</div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}