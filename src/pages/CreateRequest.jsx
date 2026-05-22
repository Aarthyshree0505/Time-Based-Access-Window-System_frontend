import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";

export default function CreateRequest() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requestedTo: "",
    requestedStart: "",
    requestedEnd: ""
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/user/all").then(r => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/request/create", form);
      toast.success(res.data.message || "Request created");
      navigate("/my-requests");
    } catch {
      toast.error("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">New Request</h1>
      <p className="page-subtitle">Submit a new access request with your preferred time window</p>
      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" placeholder="e.g. Production DB Access"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Explain why you need this access..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Request To</label>
            {users.length > 0 ? (
              <select className="form-select" value={form.requestedTo}
                onChange={e => setForm({ ...form, requestedTo: e.target.value })} required>
                <option value="">Select a user</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            ) : (
              <input className="form-input" placeholder="User ID"
                value={form.requestedTo} onChange={e => setForm({ ...form, requestedTo: e.target.value })} required />
            )}
          </div>

          <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 16, marginBottom: 18, border: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              ⏰ Requested Access Window
            </p>
            <div className="form-group">
              <label className="form-label">Preferred Start Time</label>
              <input className="form-input" type="datetime-local"
                value={form.requestedStart} onChange={e => setForm({ ...form, requestedStart: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Preferred End Time</label>
              <input className="form-input" type="datetime-local"
                value={form.requestedEnd} onChange={e => setForm({ ...form, requestedEnd: e.target.value })} required />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            <Send size={15} />{loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}