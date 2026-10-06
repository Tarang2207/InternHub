// import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  ArrowLeft,
  MapPin,
  Clock3,
  BriefcaseBusiness,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  IndianRupee,
  Building2,
} from "lucide-react";

import internships from "../data/internships";

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("savedInternships") || "[]");

    return saved.includes(id);
  });

  const [showApplyForm, setShowApplyForm] = useState(false);

  // Fetch internship from backend
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/internships/${id}`)
      .then((response) => {
        const data = response.data.internship;

        const formattedInternship = {
          ...data,
          id: data._id,
          logo: data.company.charAt(0).toUpperCase(),
        };

        setInternship(formattedInternship);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch internship:", error);
        setLoading(false);
      });
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="details-not-found">
        <h2>Loading internship...</h2>
      </div>
    );
  }

  // Internship not found
  if (!internship) {
    return (
      <div className="details-not-found">
        <h2>Internship not found</h2>

        <button onClick={() => navigate("/")}>Back to Internships</button>
      </div>
    );
  }

  // Save / unsave internship
  const toggleSave = () => {
    const saved = JSON.parse(localStorage.getItem("savedInternships") || "[]");

    let updatedSaved;

    if (isSaved) {
      updatedSaved = saved.filter((item) => item !== internship.id);
    } else {
      updatedSaved = [...saved, internship.id];
    }

    localStorage.setItem("savedInternships", JSON.stringify(updatedSaved));

    setIsSaved(!isSaved);
  };

  // Apply for internship
  const handleApply = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setShowApplyForm(true);
  };

  // Submit application
  const handleSubmitApplication = (e) => {
    e.preventDefault();

    alert(
      "Application form submitted! Backend integration will be added later.",
    );

    setShowApplyForm(false);
  };

  return (
    <div className="internship-details-page">
      {/* Back Button */}

      <button className="details-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        Back to internships
      </button>

      {/* Header */}

      <section className="details-header">
        <div className="company-logo-large">
          {internship.company?.charAt(0)}
        </div>

        <div className="details-header-content">
          <div className="details-title-row">
            <div>
              <h1>{internship.title}</h1>

              <p className="details-company">
                <Building2 size={17} />
                {internship.company}
              </p>
            </div>

            <button
              className={`details-bookmark ${isSaved ? "saved" : ""}`}
              onClick={toggleSave}
            >
              {isSaved ? <BookmarkCheck size={21} /> : <Bookmark size={21} />}
            </button>
          </div>

          <div className="details-meta">
            <span>
              <MapPin size={17} />
              {internship.location}
            </span>

            <span>
              <BriefcaseBusiness size={17} />
              {internship.mode}
            </span>

            <span>
              <Clock3 size={17} />
              {internship.duration}
            </span>

            <span>
              <BriefcaseBusiness size={17} />
              {internship.type}
            </span>
          </div>
        </div>

        <div className="details-stipend">
          <p>Stipend</p>

          <h2>{internship.stipend}</h2>
        </div>
      </section>

      {/* Main Layout */}

      <div className="details-layout">
        {/* Left Content */}

        <main className="details-main">
          {/* About */}

          <section className="details-section">
            <h2>About the Internship</h2>

            <p>{internship.description}</p>
          </section>

          {/* Skills */}

          <section className="details-section">
            <h2>Skills Required</h2>

            <div className="details-skills">
              {internship.skills?.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>
          </section>

          {/* Responsibilities */}

          <section className="details-section">
            <h2>Responsibilities</h2>

            <ul className="details-list">
              {internship.responsibilities?.map((item, index) => (
                <li key={index}>
                  <CheckCircle2 size={18} />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements */}

          <section className="details-section">
            <h2>Requirements</h2>

            <ul className="details-list">
              {internship.requirements?.map((item, index) => (
                <li key={index}>
                  <CheckCircle2 size={18} />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Benefits */}

          <section className="details-section">
            <h2>Benefits</h2>

            <ul className="details-list">
              {internship.benefits?.map((item, index) => (
                <li key={index}>
                  <CheckCircle2 size={18} />

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {/* Right Sidebar */}

        <aside className="details-sidebar">
          <div className="overview-card">
            <h2>Internship Overview</h2>

            <div className="overview-item">
              <span>Location</span>

              <strong>{internship.location}</strong>
            </div>

            <div className="overview-item">
              <span>Work Mode</span>

              <strong>{internship.mode}</strong>
            </div>

            <div className="overview-item">
              <span>Duration</span>

              <strong>{internship.duration}</strong>
            </div>

            <div className="overview-item">
              <span>Internship Type</span>

              <strong>{internship.type}</strong>
            </div>

            <div className="overview-item stipend-item">
              <span>Stipend</span>

              <strong>
                <IndianRupee size={17} />
                {internship.stipend}
              </strong>
            </div>

            <button className="apply-btn" onClick={handleApply}>
              Apply Now
            </button>
          </div>
        </aside>
      </div>

      {/* Apply Modal */}

      {showApplyForm && (
        <div className="apply-modal-overlay">
          <div className="apply-modal">
            <button
              className="apply-modal-close"
              onClick={() => setShowApplyForm(false)}
            >
              ×
            </button>

            {/* Modal Header */}

            <div className="apply-modal-header">
              <div className="apply-modal-icon">
                <BriefcaseBusiness size={24} />
              </div>

              <div>
                <h2>Apply for Internship</h2>

                <p>
                  {internship.title} at {internship.company}
                </p>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmitApplication}>
              {/* Resume */}

              <div className="apply-form-group">
                <label>Resume</label>

                <div className="resume-upload-box">
                  <input type="file" accept=".pdf,.doc,.docx" />

                  <span>Upload your resume</span>

                  <small>PDF, DOC or DOCX</small>
                </div>
              </div>

              {/* Cover Letter */}

              <div className="apply-form-group">
                <label>Cover Letter</label>

                <textarea
                  placeholder="Tell the recruiter why you're interested in this internship..."
                  rows="6"
                ></textarea>
              </div>

              {/* Buttons */}

              <div className="apply-form-actions">
                <button
                  type="button"
                  className="cancel-apply-btn"
                  onClick={() => setShowApplyForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="submit-apply-btn">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InternshipDetails;
