const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: [
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
      ],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    // The user who filed the complaint
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional note added by an admin when resolving/updating status
    adminRemarks: {
      type: String,
      default: "",
    },
  },
  // validateModifiedOnly avoids re-validating untouched fields (like an
  // older complaint's category) whenever the document is re-saved after
  // the category list above changes.
  { timestamps: true, validateModifiedOnly: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
