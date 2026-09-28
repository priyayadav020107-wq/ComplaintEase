import { useState } from "react";
import api from "../api/axios";
import Modal from "./Modal";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS } from "../constants";

// Same "file a complaint" logic that used to live on its own page,
// now opened as a modal from the "+ New Complaint" button so the user
// never leaves the page they were on.
export default function NewComplaintModal({ isOpen, onClose, onCreated }) {
  const defaultCategory = CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1]; // "Other"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(defaultCategory);
    setPriority("Medium");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/complaints", { title, description, category, priority });
      resetForm();
      onClose();
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="File a New Complaint">
      {error && <p className="error-text">{error}</p>}
      <form className="complaint-form modal-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </Modal>
  );
}
