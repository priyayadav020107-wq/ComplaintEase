import { useState, useEffect } from "react";
import api from "../api/axios";
import Modal from "./Modal";

// Lets the complaint's owner edit title/description. The backend only
// accepts this while the complaint is still Pending, and the pages
// that open this modal already gate the click on that same check.
export default function EditComplaintModal({ isOpen, onClose, complaint, onUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (complaint) {
      setTitle(complaint.title || "");
      setDescription(complaint.description || "");
      setError("");
    }
  }, [complaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;
    setError("");
    setSubmitting(true);
    try {
      await api.put(`/complaints/${complaint._id}`, { title, description });
      onClose();
      if (onUpdated) onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Complaint">
      {error && <p className="error-text">{error}</p>}
      <form className="complaint-form modal-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}
