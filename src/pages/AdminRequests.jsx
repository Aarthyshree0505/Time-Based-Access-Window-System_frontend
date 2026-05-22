import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [approveData, setApproveData] = useState({});

  const load = () => api.get("/request/all-requests").then(r => setRequests(r.data.requests || []));
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    const { start, end } = approveData[id] || {};
    if (!start || !end) return toast.error("Set access window first");
    const res = await api.put(`/request/approve/${id}`, { accessStart: start, accessEnd: end });
    toast.success(res.data.message);
    load();
  };

  const reject = async (id) => {
    if (!confirm("Reject this request?")) return;
    const res = await api.put(`/request/reject/${id}`);
    toast.success(res.data.message);
    load();
  };

  return (
    <div>
      <h1 className="page-title">All Requests</h1>
      <p className="page-subtitle">Manage and review all submitted requests</p>
      <div className="card">
        {requests.length === 0 ? (
          <div className="empty-state"><p>No requests found.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Requested By</th>
                  <th>Requested To</th>
                  <th>Requested Window</th>
                  <th>Status</th>
                  <th>Approve Window</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.title}</td>
                    <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{r.requestedBy?.name || "—"}</td>
                    <td style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{r.requestedTo?.name || "—"}</td>

                    {/* User's requested time window */}
                    <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {r.requestedStart ? (
                        <>
                          <div>From: {new Date(r.requestedStart).toLocaleString()}</div>
                          <div>To: {new Date(r.requestedEnd).toLocaleString()}</div>
                        </>
                      ) : "—"}
                    </td>

                    <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>

                    {/* Admin sets approved window */}
                    <td>
                      {r.status === "PENDING" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <input type="datetime-local" className="form-input"
                            style={{ width: 190, fontSize: "0.8rem", padding: "6px 10px" }}
                            defaultValue={r.requestedStart ? r.requestedStart.slice(0, 16) : ""}
                            onChange={e => setApproveData(p => ({ ...p, [r._id]: { ...p[r._id], start: e.target.value } }))} />
                          <input type="datetime-local" className="form-input"
                            style={{ width: 190, fontSize: "0.8rem", padding: "6px 10px" }}
                            defaultValue={r.requestedEnd ? r.requestedEnd.slice(0, 16) : ""}
                            onChange={e => setApproveData(p => ({ ...p, [r._id]: { ...p[r._id], end: e.target.value } }))} />
                        </div>
                      )}
                      {r.status === "APPROVED" && (
                        <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                          <div>{new Date(r.accessStart).toLocaleString()}</div>
                          <div>→ {new Date(r.accessEnd).toLocaleString()}</div>
                        </div>
                      )}
                    </td>

                    <td>
                      {r.status === "PENDING" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn-success"
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => approve(r._id)}>
                            <Check size={13} /> Approve
                          </button>
                          <button className="btn btn-danger"
                            style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                            onClick={() => reject(r._id)}>
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}
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