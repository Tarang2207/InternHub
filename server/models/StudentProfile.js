const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    college: {
      type: String,
      trim: true,
      default: "",
    },

    degree: {
      type: String,
      trim: true,
      default: "",
    },

    branch: {
      type: String,
      trim: true,
      default: "",
    },

    graduationYear: {
      type: Number,
      min: 2000,
      max: 2100,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    portfolio: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
