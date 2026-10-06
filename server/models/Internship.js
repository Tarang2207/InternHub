const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    stipend: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      default: "Internship",
    },

    skills: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Internship", internshipSchema);
