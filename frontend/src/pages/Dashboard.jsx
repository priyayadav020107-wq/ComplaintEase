import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ComplaintProgressTimeline from "../components/ComplaintProgressTimeline";
import StatusRings from "../components/StatusRings";
import ComplaintsTable from "../components/ComplaintsTable";
import { STATUS_OPTIONS, CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_COLORS } from "../constants";

// User dashboard: a progress timeline for a selected complaint, plus a
// status-rings breakdown of all their complaints.
// Admin dashboard: stats cards, a status bar chart, and search/filter
// over every complaint in the system.
export default function Dashboard() {
  const { user } = useAuth();
  const { refreshKey } = useOutletContext() || {};
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User-only: which complaint the progress timeline is showing
  const [selectedComplaintId, setSelectedComplaintId] = useState("");

  // Admin-only search & filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const isAdmin = user?.role === "admin";

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints, refreshKey]);

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = complaints.filter((c) => c.status === s).length;
    return acc;
  }, {});

  const pieData = STATUS_OPTIONS.map((s) => ({
    label: s,
    value: statusCounts[s] || 0,
    color: STATUS_COLORS[s] || "#94a3b8",
  }));

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  if (loading) return <div className="page">Loading dashboard...</div>;

  // ---------- User dashboard ----------
  if (!isAdmin) {
    const userTotal = complaints.length;
    // Backend already returns complaints sorted newest first.
    const selectedComplaint =
      complaints.find((c) => c._id === selectedComplaintId) || complaints[0] || null;

    return (
      <div className="page page-wide">
        <div className="page-header">
          <h2>Dashboard</h2>
        </div>
        {error && <p className="error-text">{error}</p>}

        <div className="user-dashboard-grid">
          <div className="dashboard-stats-card">
            <div className="progress-card-header">
              <h3>Complaint Progress</h3>
              {complaints.length > 1 && (
                <select
                  className="timeline-select"
                  value={selectedComplaint?._id || ""}
                  onChange={(e) => setSelectedComplaintId(e.target.value)}
                >
                  {complaints.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              )}
            </div>
            <ComplaintProgressTimeline complaint={selectedComplaint} />
          </div>

          <div className="dashboard-stats-card">
            <h3>Status Overview</h3>
            <StatusRings data={pieData} total={userTotal} />
          </div>
        </div>
      </div>
    );
  }

  // ---------- Admin dashboard ----------
  const total = complaints.length;

  const filteredComplaints = complaints.filter((c) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      c.title.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || c.priority === priorityFilter;
    const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h2>Admin Dashboard</h2>
      </div>
      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Complaints</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{statusCounts["Pending"] || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{statusCounts["In Progress"] || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Resolved</span>
          <span className="stat-value">{statusCounts["Resolved"] || 0}</span>
        </div>
      </div>

      <div className="dashboard-chart-card">
        <h3>Complaints by Status</h3>
        <div className="bar-chart">
          {STATUS_OPTIONS.map((s) => {
            const count = statusCounts[s] || 0;
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div className="bar-row" key={s}>
                <span className="bar-label">{s}</span>
                <div className="bar-track">
                  <div
                    className={`bar-fill status-${s.replace(/\s/g, "")}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filteredComplaints.length === 0 ? (
        <p>No complaints match your search/filters.</p>
      ) : (
        <ComplaintsTable
          complaints={filteredComplaints}
          showFiledBy
          showPriority
          statusEditable
          onStatusChange={handleStatusChange}
          renderActions={(c) => (
            <button type="button" className="btn-danger" onClick={() => handleDelete(c._id)}>
              Delete
            </button>
          )}
        />
      )}
    </div>
  );
}
