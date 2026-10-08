const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for an internship
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { internship, coverLetter, resume } = req.body;

    if (!internship) {
      return res.status(400).json({
        message: "Internship ID is required.",
      });
    }

    // Check if the student has already applied
    const existingApplication = await Application.findOne({
      internship,
      student: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this internship.",
      });
    }

    const application = await Application.create({
      internship,
      student: req.user.id,
      coverLetter: coverLetter || "",
      resume: resume || "",
    });

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to submit application.",
    });
  }
});

// Get applications of logged-in student
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id,
    })
      .populate("internship")
      .sort({ createdAt: -1 });

    res.status(200).json({
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications.",
    });
  }
});

// Get applications for internships posted by logged-in recruiter
router.get("/recruiter", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "internship",
        match: { recruiter: req.user.id },
      })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    const recruiterApplications = applications.filter(
      (application) => application.internship,
    );

    res.status(200).json({
      applications: recruiterApplications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch recruiter applications.",
    });
  }
});

// Update application status by recruiter
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(req.params.id).populate(
      "internship",
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    // Check that this internship belongs to the logged-in recruiter
    if (
      !application.internship ||
      application.internship.recruiter?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this application.",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      message: "Application status updated successfully!",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update application status.",
    });
  }
});

module.exports = router;
