import { STATUS_OPTIONS } from "../constants";

// Shared complaint table used by MyComplaints, AllComplaints and the
// admin dashboard's filtered results. Columns and the status cell
// (editable select vs read-only badge) are toggled via props so each
// page only opts into what it actually needs.
export default function ComplaintsTable({
  complaints,
  showFiledBy = false,
  showPriority = false,
  statusEditable = false,
  onStatusChange,
  renderActions,
}) {
  return (
    <table className="complaint-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          {showPriority && <th>Priority</th>}
          {showFiledBy && <th>Filed By</th>}
          <th>Status</th>
          <th>Filed On</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map((c) => (
          <tr key={c._id}>
            <td>{c.title}</td>
            <td>{c.category}</td>
            {showPriority && (
              <td>
                <span className={`priority-badge priority-${c.priority || "Medium"}`}>
                  {c.priority || "Medium"}
                </span>
              </td>
            )}
            {showFiledBy && <td>{c.user?.name} ({c.user?.email})</td>}
            <td>
              {statusEditable ? (
                <select value={c.status} onChange={(e) => onStatusChange(c._id, e.target.value)}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <span className={`status-badge status-${c.status.replace(/\s/g, "")}`}>
                  {c.status}
                </span>
              )}
            </td>
            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
            <td>{renderActions(c)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
