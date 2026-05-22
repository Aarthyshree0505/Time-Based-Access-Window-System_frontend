import { useEffect, useState } from "react";
import api from "../api/axios";
import { ShieldCheck, ShieldX } from "lucide-react";

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/request/access-logs").then(r => setLogs(r.data.logs || []));
  }, []);

  return (
    <div>
      <h1 className="page-title">Access Logs</h1>
      <p className="page-subtitle">Full audit trail of all access checks</p>
      <div className="card">
        {logs.length === 0 ? (
          <div className="empty-state"><p>No logs recorded yet.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Request</th><th>Time</th><th>Result</th></tr></thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 500 }}>{l.user?.name || "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{l.requestId?.title || l.requestId?._id || "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{new Date(l.accessTime).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${l.status === "ACCESS GRANTED" ? "badge-approved" : "badge-rejected"}`}>
                        {l.status === "ACCESS GRANTED" ? <ShieldCheck size={12} /> : <ShieldX size={12} />}
                        {l.status}
                      </span>
                    </td>
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