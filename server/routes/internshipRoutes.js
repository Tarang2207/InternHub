const express = require("express");
const Internship = require("../models/Internship");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create a new internship
router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const internship = await Internship.create({
        ...req.body,
        recruiter: req.user.id,
      });

      res.status(201).json({
        message: "Internship created successfully!",
        internship,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to create internship.",
      });
    }
  },
);

// Get all internships
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      internships,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch internships.",
    });
  }
});

// Get a single internship by ID
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found.",
      });
    }

    if (internship.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own internships.",
      });
    }

    res.status(200).json({
      internship,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch internship.",
    });
  }
});

// Update an internship
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const internship = await Internship.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!internship) {
        return res.status(404).json({
          message: "Internship not found.",
        });
      }

      res.status(200).json({
        message: "Internship updated successfully!",
        internship,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update internship.",
      });
    }
  },
);

// Delete an internship
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const internship = await Internship.findByIdAndDelete(req.params.id);

      if (!internship) {
        return res.status(404).json({
          message: "Internship not found.",
        });
      }

      if (internship.recruiter.toString() !== req.user.id) {
        return res.status(403).json({
          message: "You can only delete your own internships.",
        });
      }

      res.status(200).json({
        message: "Internship deleted successfully!",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to delete internship.",
      });
    }
  },
);
module.exports = router;
