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

module.exports = router;
