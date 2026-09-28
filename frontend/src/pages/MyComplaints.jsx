import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axios";
import ComplaintsTable from "../components/ComplaintsTable";
import EditComplaintModal from "../components/EditComplaintModal";
import Toast from "../components/Toast";

// User-side complaint list (moved here from the old Dashboard page).
// Columns: title, category, status, filed on, actions.
// Edit/Delete are only allowed while the complaint is still Pending;
// otherwise a toast pop explains why and nothing opens.
export default function MyComplaints() {
  const { refreshKey } = useOutletContext() || {};
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editTarget, setEditTarget] = useState(null);

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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleEditClick = (complaint) => {
    if (complaint.status !== "Pending") {
      setToast("Only complaints with Pending status can be edited.");
      return;
    }
    setEditTarget(complaint);
  };

  const handleDelete = async (complaint) => {
    if (complaint.status !== "Pending") {
      setToast("Only complaints with Pending status can be deleted.");
      return;
    }
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${complaint._id}`);
      fetchComplaints();
    } catch (err) {
      setToast(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  if (loading) return <div className="page">Loading complaints...</div>;

  return (
    <div className="page page-wide my-complaints-page">
      <div className="page-header">
        <h2>My Complaints</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <ComplaintsTable
          complaints={complaints}
          renderActions={(c) => (
            <div className="row-actions">
              <button type="button" className="btn-edit" onClick={() => handleEditClick(c)}>
                Edit
              </button>
              <button type="button" className="btn-danger" onClick={() => handleDelete(c)}>
                Delete
              </button>
            </div>
          )}
        />
      )}

      <EditComplaintModal
        isOpen={!!editTarget}
        complaint={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={fetchComplaints}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
