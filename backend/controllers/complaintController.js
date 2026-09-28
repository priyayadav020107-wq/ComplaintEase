const Complaint = require("../models/Complaint");

// @route   POST /api/complaints
// @desc    File a new complaint
// @access  Private (any logged-in user)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      user: req.user._id,
    });

    return res.status(201).json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Error creating complaint", error: error.message });
  }
};

// @route   GET /api/complaints
// @desc    Get complaints - a normal user sees only their own,
//          an admin sees everyone's
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(complaints);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};

// @route   GET /api/complaints/:id
// @desc    Get a single complaint by id
// @access  Private (owner or admin)
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const isOwner = complaint.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this complaint" });
    }

    return res.status(200).json(complaint);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching complaint", error: error.message });
  }
};

// @route   PUT /api/complaints/:id
// @desc    Edit a complaint's title/description
// @access  Private (owner only, and only while status is Pending)
const updateComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const isOwner = complaint.user.toString() === req.user._id.toString();
    if (!isOwner) {
      return res.status(403).json({ message: "Not authorized to edit this complaint" });
    }

    if (complaint.status !== "Pending") {
      return res.status(403).json({
        message: "Only complaints with Pending status can be edited",
      });
    }

    if (title !== undefined) complaint.title = title;
    if (description !== undefined) complaint.description = description;

    const updated = await complaint.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Error updating complaint", error: error.message });
  }
};

// @route   PUT /api/complaints/:id/status
// @desc    Update a complaint's status and admin remarks
// @access  Private (admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;

    const updated = await complaint.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Error updating complaint", error: error.message });
  }
};

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint
// @access  Private (owner, only while Pending, or admin any time)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const isOwner = complaint.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && (!isOwner || complaint.status !== "Pending")) {
      return res.status(403).json({
        message: "You can only delete your own complaints while they are still Pending",
      });
    }

    await complaint.deleteOne();
    return res.status(200).json({ message: "Complaint deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting complaint", error: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
