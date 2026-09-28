// Shared dropdown option lists used across the complaint form, tables and
// admin filters. Keeping them in one place means every page stays in sync.

export const CATEGORY_OPTIONS = [
  "Infrastructure",
  "Electricity",
  "Water",
  "Internet",
  "Maintenance",
  "Cleanliness",
  "Transportation",
  "Academic",
  "Technical",
  "Other",
];

export const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Rejected"];

export const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#2563eb",
  Resolved: "#39d353",
  Rejected: "#dc2626",
};
