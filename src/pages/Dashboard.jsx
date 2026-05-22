import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/request/my-requests").then(r => setRequests(r.data.requests || []));
  }, []);

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === "PENDING").length,
    approved: requests.filter(r => r.status === "APPROVED").length,
    rejected: requests.filter(r => r.status === "REJECTED").length,
  };

  const stats = [
    { label: "Total Requests", value: counts.total, icon: <FileText size={20} />, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { label: "Pending", value: counts.pending, icon: <Clock size={20} />, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { label: "Approved", value: counts.approved, icon: <CheckCircle size={20} />, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { label: "Rejected", value: counts.rejected, icon: <XCircle size={20} />, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  ];

  const recent = requests.slice(0, 5);

  return (
    <div>
      <h1 className="page-title">Welcome, {user?.name} 👋</h1>
      <p className="page-subtitle">Here's a snapshot of your access requests</p>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>Recent Requests</h2>
          <Link to="/my-requests" className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "7px 14px" }}>View All</Link>
        </div>
        {recent.length === 0 ? (
          <div className="empty-state"><p>No requests yet. <Link to="/create-request" style={{ color: "var(--accent)" }}>Create one →</Link></p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}