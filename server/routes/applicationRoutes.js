const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");
const Internship = require("../models/Internship");

const router = express.Router();

// Apply for an internship
router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    upload.single("resume")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Resume must be 5 MB or smaller."
              : error.message,
        });
      }

      next();
    });
  },
  async (req, res) => {
    try {
      const { internship, coverLetter } = req.body;

      if (!internship) {
        return res.status(400).json({
          message: "Internship ID is required.",
        });
      }

      const internshipDoc = await Internship.findById(internship);

      if (!internshipDoc) {
        return res.status(404).json({
          message: "Internship not found.",
        });
      }

      const existingApplication = await Application.findOne({
        internship,
        student: req.user.id,
      });

      if (existingApplication) {
        return res.status(400).json({
          message: "You have already applied for this internship.",
        });
      }

      if (!internshipDoc.recruiter) {
        return res.status(400).json({
          message: "Internship recruiter information is missing.",
        });
      }

      const application = await Application.create({
        internship,
        student: req.user.id,
        recruiter: internshipDoc.recruiter,
        internshipSnapshot: {
          title: internshipDoc.title,
          company: internshipDoc.company,
        },
        coverLetter: coverLetter || "",
        resume: req.file ? req.file.filename : "",
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
  },
);

// Download a resume for an authorized student or recruiter
router.get("/:id/resume", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "internship",
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    const isStudent = application.student.toString() === req.user.id;

    const isRecruiter =
      application.recruiter?.toString() === req.user.id ||
      application.internship?.recruiter?.toString() === req.user.id;

    if (!isStudent && !isRecruiter) {
      return res.status(403).json({
        message: "You are not authorized to access this resume.",
      });
    }

    if (!application.resume) {
      return res.status(404).json({
        message: "No resume is attached to this application.",
      });
    }

    const filename = path.basename(application.resume);
    const filePath = path.join(__dirname, "../uploads/resumes", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Resume file not found.",
      });
    }

    return res.download(filePath);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to download resume.",
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
