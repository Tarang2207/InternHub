import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  UserRound,
  Home,
  BriefcaseBusiness,
} from "lucide-react";

const emptyProfile = {
  college: "",
  degree: "",
  branch: "",
  graduationYear: "",
  skills: [],
  bio: "",
  github: "",
  linkedin: "",
  portfolio: "",
};

function StudentDashboard() {
  const [profile, setProfile] = useState(emptyProfile);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [savedInternships, setSavedInternships] = useState([]);
  const [savedInternshipsLoading, setSavedInternshipsLoading] = useState(true);

  const profileFields = [
    profile.college,
    profile.degree,
    profile.branch,
    profile.graduationYear,
    profile.skills?.length > 0 ? profile.skills : "",
    profile.bio,
    profile.github,
    profile.linkedin,
    profile.portfolio,
  ];
  const completedFields = profileFields.filter(
    (field) => field !== "" && field !== null && field !== undefined,
  ).length;
  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/student-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.profile) {
          const savedProfile = response.data.profile;

          setProfile({
            ...emptyProfile,
            ...savedProfile,
            graduationYear: savedProfile.graduationYear ?? "",
          });

          setSkillsInput((savedProfile.skills || []).join(", "));
        }
      } catch (error) {
        console.error("Fetch student profile error:", error);
        setMessage(error.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setApplicationsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchSavedInternships = async () => {
      try {
        const savedIds = JSON.parse(
          localStorage.getItem("savedInternships") || "[]",
        );

        if (savedIds.length === 0) {
          setSavedInternships([]);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/internships",
        );

        const allInternships = response.data.internships || [];

        const savedItems = allInternships.filter((internship) =>
          savedIds.includes(String(internship._id || internship.id)),
        );

        setSavedInternships(savedItems);
      } catch (error) {
        console.error("Failed to fetch saved internships:", error);
      } finally {
        setSavedInternshipsLoading(false);
      }
    };

    fetchSavedInternships();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const updatedProfile = {
        ...profile,
        graduationYear: profile.graduationYear
          ? Number(profile.graduationYear)
          : null,
        skills: skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await axios.put(
        "http://localhost:5000/api/student-profile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfile({
        ...emptyProfile,
        ...response.data.profile,
        graduationYear: response.data.profile.graduationYear ?? "",
      });

      setSkillsInput((response.data.profile.skills || []).join(", "));

      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error("Save student profile error:", error);
      setMessage(error.response?.data?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="student-dashboard-layout">
      <aside className="student-sidebar">
        <div className="student-logo">
          <span className="student-logo-icon">
            <GraduationCap size={25} />
          </span>
          <span>InternHub</span>
        </div>

        <nav className="student-sidebar-nav">
          <div className="student-sidebar-item active">
            <UserRound size={19} />
            <span>Student Profile</span>
          </div>
        </nav>

        <button
          type="button"
          className="student-sidebar-home"
          onClick={() => navigate("/")}
        >
          <Home size={19} />
          <span>Back to Home</span>
        </button>
      </aside>

      <main className="student-dashboard-main">
        <header className="student-top-header">
          <div>
            <h2>Student Dashboard</h2>
            <p>Manage your profile and professional information.</p>
          </div>

          <div className="student-profile-circle">
            <UserRound size={22} />
          </div>
        </header>
        <section className="student-welcome-banner">
          <div>
            <h1>Your Student Profile</h1>
            <p>
              Keep your education, skills, and professional links up to date.
            </p>
          </div>
          <GraduationCap size={38} />
        </section>
        {/* Profile Completion Card */}
        <div className="student-completion-card">
          <div className="student-completion-info">
            <div>
              <p>Profile Completion</p>
              <h3>{profileCompletion}%</h3>
            </div>

            <div className="student-completion-icon">
              <UserRound size={24} />
            </div>
          </div>

          <div
            className="student-completion-track"
            role="progressbar"
            aria-valuenow={profileCompletion}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className="student-completion-fill"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>

          <p className="student-completion-hint">
            {profileCompletion === 100
              ? "Your profile is complete!"
              : "Complete your profile to help recruiters learn more about you."}
          </p>
        </div>
        {/* Application Summary */}
        <div className="student-application-summary">
          <div className="student-application-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <div>
            <p>Total Applications</p>
            <h3>{applicationsLoading ? "..." : applications.length}</h3>
          </div>
        </div>
        {/* My Applications Section */}
        <section className="student-applications-section">
          <div className="student-applications-heading">
            <h3>My Applications</h3>
            <span>{applications.length} total</span>
          </div>

          {applicationsLoading ? (
            <p className="student-applications-message">
              Loading applications...
            </p>
          ) : applications.length === 0 ? (
            <div className="student-applications-empty">
              <BriefcaseBusiness size={32} />
              <h4>No applications yet</h4>
              <p>
                Apply for internships to track your application status here.
              </p>
            </div>
          ) : (
            <div className="student-applications-list">
              {applications.map((application) => (
                <div className="student-application-item" key={application._id}>
                  <div className="student-application-details">
                    <h4>{application.internship?.title || "Internship"}</h4>

                    <p>
                      Applied on{" "}
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "Date unavailable"}
                    </p>
                  </div>

                  <span
                    className={`student-application-status status-${(
                      application.status || "Applied"
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {application.status || "Applied"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved Internships Section */}
        <section className="student-saved-section">
          <div className="student-saved-heading">
            <h3>Saved Internships</h3>
            <span>{savedInternships.length} saved</span>
          </div>

          {savedInternshipsLoading ? (
            <p className="student-applications-message">
              Loading saved internships...
            </p>
          ) : savedInternships.length === 0 ? (
            <div className="student-applications-empty">
              <BriefcaseBusiness size={32} />
              <h4>No saved internships yet</h4>
              <p>Bookmark internships you like, and they will appear here.</p>
            </div>
          ) : (
            <div className="student-saved-list">
              {savedInternships.map((internship) => (
                <div
                  className="student-saved-item"
                  key={internship._id || internship.id}
                >
                  <div className="student-saved-details">
                    <h4>{internship.title || "Internship"}</h4>
                    <p>{internship.company || "Company not specified"}</p>
                    <span>
                      {internship.location || "Location not specified"}
                      {" · "}
                      {internship.mode || "Mode not specified"}
                    </span>
                  </div>

                  <button
                    className="student-saved-view-button"
                    onClick={() => navigate("/saved")}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="student-profile-section">
          <div className="student-section-header">
            <div>
              <h2>Profile Information</h2>
              <p>Update the details you want recruiters to know.</p>
            </div>
          </div>

          <div className="student-profile-card">
            {loading ? (
              <p className="student-status-message" role="status">
                Loading student profile...
              </p>
            ) : (
              <>
                {message && (
                  <p
                    className={`student-status-message ${
                      message === "Profile saved successfully!"
                        ? "success"
                        : "error"
                    }`}
                    role="status"
                  >
                    {message}
                  </p>
                )}

                <form className="student-profile-form" onSubmit={handleSave}>
                  <label className="student-form-group">
                    College
                    <input
                      name="college"
                      value={profile.college}
                      onChange={handleChange}
                      placeholder="Enter your college name"
                    />
                  </label>

                  <label className="student-form-group">
                    Degree
                    <input
                      name="degree"
                      value={profile.degree}
                      onChange={handleChange}
                      placeholder="e.g. BE"
                    />
                  </label>

                  <label className="student-form-group">
                    Branch
                    <input
                      name="branch"
                      value={profile.branch}
                      onChange={handleChange}
                      placeholder="e.g. ENTC"
                    />
                  </label>

                  <label className="student-form-group">
                    Graduation Year
                    <input
                      name="graduationYear"
                      type="number"
                      min="2000"
                      max="2100"
                      value={profile.graduationYear}
                      onChange={handleChange}
                      placeholder="e.g. 2027"
                    />
                  </label>

                  <label className="student-form-group student-full-width">
                    Skills
                    <input
                      value={skillsInput}
                      onChange={(event) => setSkillsInput(event.target.value)}
                      placeholder="C++, React, JavaScript"
                    />
                    <span className="student-field-hint">
                      Separate each skill with a comma.
                    </span>
                  </label>

                  <label className="student-form-group student-full-width">
                    Bio
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      placeholder="Write a short introduction about yourself"
                      rows={4}
                    />
                  </label>

                  <label className="student-form-group">
                    GitHub URL
                    <input
                      name="github"
                      type="url"
                      value={profile.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                    />
                  </label>

                  <label className="student-form-group">
                    LinkedIn URL
                    <input
                      name="linkedin"
                      type="url"
                      value={profile.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </label>

                  <label className="student-form-group student-full-width">
                    Portfolio URL
                    <input
                      name="portfolio"
                      type="url"
                      value={profile.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </label>

                  <div className="student-form-actions student-full-width">
                    <button
                      type="submit"
                      className="student-save-btn"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;
