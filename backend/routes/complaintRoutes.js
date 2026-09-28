const express = require("express");
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect, adminOnly } = require("../middleware/auth");

// All complaint routes require a logged-in user
router.use(protect);

router.route("/").post(createComplaint).get(getComplaints);

router.route("/:id").get(getComplaintById).put(updateComplaint).delete(deleteComplaint);

// Only admins can change a complaint's status
router.put("/:id/status", adminOnly, updateComplaintStatus);

module.exports = router;
