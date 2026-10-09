const express = require("express");
const StudentProfile = require("../models/StudentProfile");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// GET logged-in student's profile
router.get("/", authMiddleware, roleMiddleware("student"), async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(200).json({
        profile: null,
      });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Get student profile error:", error);
    res.status(500).json({
      message: "Failed to fetch student profile.",
    });
  }
});

// CREATE or UPDATE logged-in student's profile
router.put("/", authMiddleware, roleMiddleware("student"), async (req, res) => {
  try {
    const {
      college,
      degree,
      branch,
      graduationYear,
      skills,
      bio,
      github,
      linkedin,
      portfolio,
    } = req.body;

    const profileData = {
      college,
      degree,
      branch,
      graduationYear:
        graduationYear === "" || graduationYear == null
          ? null
          : Number(graduationYear),
      skills,
      bio,
      github,
      linkedin,
      portfolio,
    };

    if (
      profileData.graduationYear !== null &&
      (!Number.isInteger(profileData.graduationYear) ||
        profileData.graduationYear < 2000 ||
        profileData.graduationYear > 2100)
    ) {
      return res.status(400).json({
        message: "Please provide a valid graduation year.",
      });
    }

    if (
      skills !== undefined &&
      (!Array.isArray(skills) ||
        !skills.every((skill) => typeof skill === "string"))
    ) {
      return res.status(400).json({
        message: "Skills must be an array of strings.",
      });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileData, $setOnInsert: { user: req.user.id } },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      message: "Student profile saved successfully.",
      profile,
    });
  } catch (error) {
    console.error("Save student profile error:", error);
    res.status(500).json({
      message: "Failed to save student profile.",
    });
  }
});

module.exports = router;
