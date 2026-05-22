import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Trash2, ShieldCheck } from "lucide-react";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  const load = () => api.get("/request/my-requests").then(r => setRequests(r.data.requests || []));
  useEffect(() => { load(); }, []);

  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;
    const res = await api.delete(`/request/delete/${id}`);
    toast.success(res.data.message);
    load();
  };

  const checkAccess = async (id) => {
    const res = await api.get(`/request/check-access/${id}`);
    toast(res.data.message, { icon: res.data.message === "ACCESS GRANTED" ? "✅" : "❌" });
  };

  return (
    <div>
      <h1 className="page-title">My Requests</h1>
      <p className="page-subtitle">Track all your submitted access requests</p>
      <div className="card">
        {requests.length === 0 ? (
          <div className="empty-state"><p>No requests found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Description</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td style={{ color: "var(--muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.description}</td>
                    <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        {r.status === "APPROVED" && (
                          <button className="btn btn-success" style={{ padding: "6px 12px", fontSize: "0.82rem" }} onClick={() => checkAccess(r._id)}>
                            <ShieldCheck size={13} /> Check
                          </button>
                        )}
                        <button className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.82rem" }} onClick={() => deleteRequest(r._id)}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
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