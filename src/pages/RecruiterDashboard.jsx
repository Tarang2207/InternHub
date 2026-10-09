import { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  UserCircle,
  LogOut,
  MapPin,
  Clock3,
  Monitor,
  IndianRupee,
  Plus,
  Pencil,
  Trash2,
  Users,
  Activity,
  Home,
  Mail,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [openStatusId, setOpenStatusId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchInternships = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/internships/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInternships(response.data.internships);
      } catch (error) {
        console.error("Failed to fetch internships:", error);
      }
    };

    fetchInternships();

    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/applications/recruiter",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setApplications(response.data.applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this internship?",
    );

    const handleStatusChange = async (applicationId, newStatus) => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `http://localhost:5000/api/applications/${applicationId}/status`,
          {
            status: newStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setApplications((prev) =>
          prev.map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status: response.data.application.status,
                }
              : application,
          ),
        );
      } catch (error) {
        console.error(error);

        alert(
          error.response?.data?.message ||
            "Failed to update application status.",
        );
      }
    };

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/internships/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Internship deleted successfully! 🗑️");

      setInternships((prev) =>
        prev.filter((internship) => internship._id !== id),
      );
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to delete internship.");
    }
  };

  const pendingApplications = applications.filter(
    (application) =>
      application.status === "Applied" || application.status === "Under Review",
  ).length;

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: response.data.application.status,
              }
            : application,
        ),
      );

      setOpenStatusId(null);
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error.response?.data?.message || "Failed to update application status.",
      );
    }
  };

  const statusOptions = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
  ];
  return (
    <div className="recruiter-dashboard-layout">
      {/* Sidebar */}
      <aside className="recruiter-sidebar">
        <div className="recruiter-logo">
          <div className="recruiter-logo-icon">
            <BriefcaseBusiness size={24} />
          </div>

          <span>InternHub</span>
        </div>

        <nav className="recruiter-sidebar-nav">
          <button
            className={`sidebar-item ${
              activeSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "internships" ? "active" : ""
            }`}
            onClick={() => setActiveSection("internships")}
          >
            <BriefcaseBusiness size={19} />
            My Internships
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "applications" ? "active" : ""
            }`}
            onClick={() => setActiveSection("applications")}
          >
            <FileText size={19} />
            Applications
          </button>
          <button
            className={`sidebar-item ${
              activeSection === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <UserCircle size={19} />
            Profile
          </button>
        </nav>

        <button className="sidebar-home" onClick={() => navigate("/")}>
          <Home size={19} />
          Back to Home
        </button>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="recruiter-dashboard-main">
        {activeSection === "dashboard" && (
          <>
            {/* Top Header */}
            <div className="recruiter-top-header">
              <div>
                <h2>Welcome back, {user?.name || "Recruiter"} 👋</h2>

                <p>Manage your internships and applications.</p>
              </div>

              <div className="recruiter-profile-circle">
                {user?.name?.charAt(0).toUpperCase() || "R"}
              </div>
            </div>

            {/* Welcome Banner */}
            <div className="recruiter-welcome-banner">
              <div>
                <span>Recruiter Portal</span>

                <h1>Recruiter Dashboard</h1>

                <p>
                  Manage your internships, track applications, and find talented
                  candidates.
                </p>
              </div>

              <div className="welcome-banner-icon">
                <BriefcaseBusiness size={70} />
              </div>
            </div>

            {/* Stats */}
            <div className="recruiter-stats-grid">
              <div className="recruiter-stat-card blue">
                <div className="stat-icon">
                  <BriefcaseBusiness size={23} />
                </div>

                <h2>{internships.length}</h2>

                <h4>Total Internships</h4>

                <p>Posted by you</p>
              </div>

              <div className="recruiter-stat-card green">
                <div className="stat-icon">
                  <Activity size={23} />
                </div>

                <h2>{internships.length}</h2>

                <h4>Active Internships</h4>

                <p>Currently live</p>
              </div>

              <div className="recruiter-stat-card purple">
                <div className="stat-icon">
                  <Users size={23} />
                </div>

                <h2>{applications.length}</h2>

                <h4>Total Applicants</h4>

                <p>Across all internships</p>
              </div>

              <div className="recruiter-stat-card orange">
                <div className="stat-icon">
                  <FileText size={23} />
                </div>

                <h2>{pendingApplications}</h2>

                <h4>Applications</h4>

                <p>Needs review</p>
              </div>
            </div>
          </>
        )}

        {activeSection === "internships" && (
          <>
            {/* Internship Section */}
            <div className="recruiter-section-header">
              <div>
                <h2>My Internships</h2>
                <p>Internships posted by you</p>
              </div>
            </div>

            {/* Internship Cards */}
            {internships.length === 0 ? (
              <div className="recruiter-empty-box">
                <BriefcaseBusiness size={45} />

                <h3>No internships yet</h3>

                <p>
                  Start by posting your first internship and find talented
                  candidates.
                </p>

                <button
                  className="post-internship-btn"
                  onClick={() => navigate("/post-internship")}
                >
                  <Plus size={18} />
                  Post New Internship
                </button>
              </div>
            ) : (
              <div className="recruiter-internship-grid">
                {internships.map((internship) => (
                  <div
                    className="recruiter-internship-card"
                    key={internship._id}
                  >
                    {/* Card Header */}
                    <div className="recruiter-card-header">
                      <div className="company-logo">
                        {internship.company?.charAt(0).toUpperCase()}
                      </div>

                      <div className="company-info">
                        <h3>{internship.title}</h3>
                        <p>{internship.company}</p>
                      </div>

                      <span className="active-badge">Active</span>
                    </div>

                    {/* Details */}
                    <div className="recruiter-card-details">
                      <div>
                        <MapPin size={17} />
                        <span>{internship.location}</span>
                      </div>

                      <div>
                        <Monitor size={17} />
                        <span>{internship.mode}</span>
                      </div>

                      <div>
                        <Clock3 size={17} />
                        <span>{internship.duration}</span>
                      </div>

                      <div>
                        <IndianRupee size={17} />
                        <span>{internship.stipend}</span>
                      </div>
                    </div>

                    {/* Type */}
                    <span className="internship-type-badge">
                      {internship.type}
                    </span>

                    {/* Actions */}
                    <div className="recruiter-card-actions">
                      <button
                        className="edit-internship-btn"
                        onClick={() =>
                          navigate(`/edit-internship/${internship._id}`)
                        }
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        className="delete-internship-btn"
                        onClick={() => handleDelete(internship._id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add More Box */}
                <div className="add-internship-box">
                  <div className="add-internship-icon">
                    <Plus size={30} />
                  </div>

                  <h3>Post another internship</h3>

                  <p>
                    Reach more students by adding another internship
                    opportunity.
                  </p>

                  <button
                    className="secondary-post-btn"
                    onClick={() => navigate("/post-internship")}
                  >
                    <Plus size={17} />
                    Post New Internship
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === "applications" && (
          <div className="recruiter-applications-dashboard-view">
            <div className="recruiter-section-header">
              <div>
                <h2>Applications</h2>
                <p>Manage applications received for your internships</p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="recruiter-applications-empty">
                <FileText size={42} />

                <h2>No applications yet</h2>

                <p>Applications submitted by students will appear here.</p>
              </div>
            ) : (
              <div className="recruiter-applications-list">
                {applications.map((application) => (
                  <div
                    className="recruiter-application-card"
                    key={application._id}
                  >
                    {/* Applicant Header */}
                    <div className="recruiter-application-top">
                      <div className="recruiter-student-info">
                        <div className="recruiter-student-avatar">
                          {application.student?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h2>{application.student?.name}</h2>

                          <div className="application-email">
                            <Mail size={14} />
                            {application.student?.email}
                          </div>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="status-dropdown">
                        <button
                          type="button"
                          className="status-dropdown-btn"
                          onClick={() => {
                            setOpenStatusId((prev) =>
                              prev === application._id ? null : application._id,
                            );
                          }}
                        >
                          <span>{application.status}</span>

                          <span
                            className={`status-arrow ${
                              openStatusId === application._id ? "open" : ""
                            }`}
                          >
                            ▾
                          </span>
                        </button>

                        {openStatusId === application._id && (
                          <div className="status-dropdown-menu">
                            {statusOptions.map((status) => (
                              <button
                                type="button"
                                key={status}
                                className={`status-dropdown-option ${
                                  application.status === status
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleStatusChange(application._id, status);
                                }}
                              >
                                <span>{status}</span>

                                {application.status === status && (
                                  <span className="status-check">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Internship Information */}
                    <div className="recruiter-application-job">
                      <div className="application-job-heading">
                        <div className="application-job-icon">
                          <BriefcaseBusiness size={18} />
                        </div>

                        <div>
                          <h3>{application.internship?.title}</h3>

                          <p>{application.internship?.company}</p>
                        </div>
                      </div>

                      <div className="application-job-details">
                        <span>
                          <MapPin size={14} />
                          {application.internship?.location}
                        </span>

                        <span>
                          <Clock3 size={14} />
                          {application.internship?.duration}
                        </span>

                        <span>{application.internship?.mode}</span>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="application-cover-letter">
                      <div className="section-small-title">
                        <FileText size={15} />
                        <h4>Cover Letter</h4>
                      </div>

                      <p>
                        {application.coverLetter || "No cover letter provided."}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="recruiter-application-footer">
                      <div className="application-date">
                        <CalendarDays size={14} />

                        <span>
                          Applied on{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <button className="view-resume-btn">
                        <FileText size={15} />
                        View Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "profile" && (
          <div className="recruiter-profile-section">
            <div className="recruiter-section-header">
              <div>
                <h2>Profile</h2>
                <p>Manage your recruiter account information</p>
              </div>
            </div>

            {!isEditingProfile ? (
              <div className="recruiter-profile-card">
                <div className="recruiter-profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "R"}
                </div>

                <div className="recruiter-profile-info">
                  <h2>{user?.name || "Recruiter"}</h2>

                  <p>{user?.email || "No email available"}</p>

                  <span>Recruiter</span>
                </div>

                <button
                  className="edit-profile-btn"
                  onClick={() => {
                    setProfileForm({
                      name: user?.name || "",
                    });

                    setIsEditingProfile(true);
                  }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="recruiter-profile-card">
                <div className="recruiter-profile-info">
                  <h2>Edit Profile</h2>

                  <div className="profile-form">
                    <div className="profile-form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="profile-form-group">
                      <label>Email</label>
                      <input type="email" value={user?.email || ""} disabled />
                    </div>

                    <div className="profile-form-group">
                      <label>Role</label>
                      <input type="text" value="Recruiter" disabled />
                    </div>
                  </div>

                  <div className="profile-form-actions">
                    <button
                      className="cancel-profile-btn"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </button>

                    <button
                      className="save-profile-btn"
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");

                          const response = await axios.put(
                            "http://localhost:5000/api/auth/profile",
                            {
                              name: profileForm.name,
                            },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );

                          setUser(response.data.user);

                          localStorage.setItem(
                            "user",
                            JSON.stringify(response.data.user),
                          );

                          setIsEditingProfile(false);

                          alert("Profile updated successfully!");
                        } catch (error) {
                          console.error("Profile update error:", error);

                          alert(
                            error.response?.data?.message ||
                              "Failed to update profile.",
                          );
                        }
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterDashboard;
