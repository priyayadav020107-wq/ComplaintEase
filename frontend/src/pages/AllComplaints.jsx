import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axios";
import ComplaintsTable from "../components/ComplaintsTable";

// Admin's complaint list - this is the original Dashboard table logic,
// unchanged, just moved to its own page with the new Priority column
// and the updated category list (see constants.js).
export default function AllComplaints() {
  const { refreshKey } = useOutletContext() || {};
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div className="page">Loading complaints...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>All Complaints</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ComplaintsTable
          complaints={complaints}
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
