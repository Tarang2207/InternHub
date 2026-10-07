import { useEffect, useState } from "react";
import { BriefcaseBusiness, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditInternship = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/internships/${id}`,
        );

        const internship = response.data.internship;

        setFormData({
          title: internship.title || "",
          company: internship.company || "",
          location: internship.location || "",
          mode: internship.mode || "Remote",
          duration: internship.duration || "",
          stipend: internship.stipend || "",
          type: internship.type || "Internship",
          skills: internship.skills?.join(", ") || "",
          description: internship.description || "",
          responsibilities: internship.responsibilities?.join(", ") || "",
          requirements: internship.requirements?.join(", ") || "",
          benefits: internship.benefits?.join(", ") || "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load internship.");
        navigate("/recruiter-dashboard");
      }
    };

    fetchInternship();
  }, [id, navigate]);

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

      await axios.put(
        `http://localhost:5000/api/internships/${id}`,
        internshipData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Internship updated successfully! 🎉");

      navigate("/recruiter-dashboard");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to update internship.");
    }
  };

  return (
    <div className="post-internship-page">
      <div className="post-internship-container">
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
              <h1>Edit Internship</h1>
              <p>Update the details of your internship opportunity.</p>
            </div>
          </div>
        </div>

        <form className="post-internship-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>

            <p>Update the basic details of the internship.</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Internship Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Frontend Developer Intern"
                  value={formData.title}
                  onChange={handleChange}
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
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Internship Details</h2>

            <p>Update the details students will see.</p>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe the internship..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="form-group">
              <label>Responsibilities</label>

              <textarea
                name="responsibilities"
                placeholder="Build UI, work with APIs..."
                value={formData.responsibilities}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>

              <textarea
                name="requirements"
                placeholder="Basic knowledge of React..."
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

          <div className="post-form-actions">
            <button
              type="button"
              className="cancel-post-btn"
              onClick={() => navigate("/recruiter-dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="submit-post-btn">
              Update Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternship;
