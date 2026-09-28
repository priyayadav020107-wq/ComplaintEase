// Vertical status timeline for a single complaint, shown on the user
// dashboard so a person can see exactly where their complaint stands.
// Built purely from the complaint's existing `status` field — no new
// backend state involved.
function getSteps(status) {
  if (status === "Rejected") {
    return [
      { label: "Complaint Submitted", state: "done" },
      { label: "Under Review", state: "done" },
      { label: "Rejected", state: "rejected" },
    ];
  }

  return [
    { label: "Complaint Submitted", state: "done" },
    { label: "Under Review", state: status === "Pending" ? "current" : "done" },
    {
      label: "In Progress",
      state: status === "Pending" ? "upcoming" : status === "In Progress" ? "current" : "done",
    },
    { label: "Resolved", state: status === "Resolved" ? "done" : "upcoming" },
  ];
}

const ICONS = { done: "\u2713", current: "\u25CF", upcoming: "\u25CB", rejected: "\u2715" };

export default function ComplaintProgressTimeline({ complaint }) {
  if (!complaint) {
    return (
      <p className="timeline-empty">File your first complaint to see its progress here.</p>
    );
  }

  const steps = getSteps(complaint.status);

  return (
    <div className="progress-timeline">
      {steps.map((step, i) => (
        <div className={`timeline-step timeline-${step.state}`} key={step.label}>
          <div className="timeline-marker">
            <span className="timeline-icon">{ICONS[step.state]}</span>
            {i < steps.length - 1 && (
              <span className={`timeline-connector${step.state === "done" ? " filled" : ""}`} />
            )}
          </div>
          <span className="timeline-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
