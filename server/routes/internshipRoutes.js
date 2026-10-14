const express = require("express");
const Internship = require("../models/Internship");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const mongoose = require("mongoose");
const Application = require("../models/Application");

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

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const internships = await Internship.find({
        recruiter: req.user.id,
      }).sort({ createdAt: -1 });

      res.status(200).json({
        internships,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch your internships.",
      });
    }
  },
);

// Get a single internship by ID
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        message: "Internship not found.",
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
// PUT /api/internships/:id - Update internship (Recruiter owner only)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // 1. Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ message: "Invalid internship ID format." });
      }

      const allowedFields = [
        "title",
        "company",
        "location",
        "mode",
        "duration",
        "stipend",
        "type",
        "skills",
        "description",
        "responsibilities",
        "requirements",
        "benefits",
      ];

      const updateData = {};

      Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
          updateData[key] = req.body[key];
        }
      });

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: "No valid fields provided for update.",
        });
      }

      // 3. Perform atomic update scoped by internship ID AND recruiter ID
      const updatedInternship = await Internship.findOneAndUpdate(
        { _id: id, recruiter: req.user.id },
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updatedInternship) {
        return res.status(404).json({
          message: "Internship not found or unauthorized.",
        });
      }

      return res.status(200).json({
        message: "Internship updated successfully!",
        internship: updatedInternship,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error updating internship.",
        error: error.message,
      });
    }
  },
);

// DELETE /api/internships/:id - Delete internship (Recruiter owner only)

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    const session = await mongoose.startSession();

    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          message: "Invalid internship ID format.",
        });
      }

      let internshipNotFound = false;

      await session.withTransaction(async () => {
        const internship = await Internship.findOne({
          _id: id,
          recruiter: req.user.id,
        }).session(session);

        if (!internship) {
          internshipNotFound = true;
          return;
        }

        // Preserve recruiter ownership and internship details
        // for all existing applications.
        await Application.updateMany(
          { internship: internship._id },
          {
            $set: {
              recruiter: internship.recruiter,
              internshipSnapshot: {
                title: internship.title,
                company: internship.company,
              },
            },
          },
          { session },
        );

        // Delete only the internship document.
        const result = await Internship.deleteOne(
          {
            _id: internship._id,
            recruiter: req.user.id,
          },
          { session },
        );

        if (result.deletedCount !== 1) {
          throw new Error(
            "Internship deletion failed; transaction must roll back.",
          );
        }
      });

      if (internshipNotFound) {
        return res.status(404).json({
          message: "Internship not found or unauthorized.",
        });
      }

      return res.status(200).json({
        message:
          "Internship deleted successfully. Existing applications and resumes have been preserved.",
      });
    } catch (error) {
      console.error("Internship deletion error:", error);

      return res.status(500).json({
        message:
          "Server error deleting internship. No partial transaction changes should remain.",
      });
    } finally {
      await session.endSession();
    }
  },
);

module.exports = router;
