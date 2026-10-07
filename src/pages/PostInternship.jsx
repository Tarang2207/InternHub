import { useState } from "react";
import { BriefcaseBusiness, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostInternship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    mode: "Remote",
    duration: "",
    stipend: "",
    type: "Internship",
    skills: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const internshipData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        responsibilities: formData.responsibilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        requirements: formData.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        benefits: formData.benefits
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await axios.post(
        "http://localhost:5000/api/internships",
        internshipData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Internship posted successfully! 🎉");

      navigate("/recruiter-dashboard");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to post internship.");
    }
  };

  return (
    <div className="post-internship-page">
      <div className="post-internship-container">
        {/* Header */}
        <div className="post-internship-header">
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/recruiter-dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="post-internship-title">
            <div className="post-internship-icon">
              <BriefcaseBusiness size={26} />
            </div>

            <div>
              <h1>Post New Internship</h1>
              <p>Create an internship opportunity for students.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="post-internship-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            <p>Enter the basic details of the internship.</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Internship Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Frontend Developer Intern"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company"
                  placeholder="e.g. TechNova"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Pune"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mode</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 6 Months"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stipend</label>
                <input
                  type="text"
                  name="stipend"
                  placeholder="e.g. ₹18,000/month"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Internship Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>

              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="React, JavaScript, CSS"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2>Internship Details</h2>
            <p>Tell students more about this opportunity.</p>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe the internship..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Responsibilities</label>

              <textarea
                name="responsibilities"
                placeholder="Build UI, work with APIs, collaborate with developers..."
                value={formData.responsibilities}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>

              <textarea
                name="requirements"
                placeholder="Basic knowledge of React, JavaScript..."
                value={formData.requirements}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Benefits</label>

              <textarea
                name="benefits"
                placeholder="Certificate, flexible working hours..."
                value={formData.benefits}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="post-form-actions">
            <button
              type="button"
              className="cancel-post-btn"
              onClick={() => navigate("/recruiter-dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-post-btn">
              Post Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternship;
