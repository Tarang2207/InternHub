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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [user, setUser] = useState(null);

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
          <button className="sidebar-item active">
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button className="sidebar-item">
            <BriefcaseBusiness size={19} />
            My Internships
          </button>

          <button className="sidebar-item">
            <FileText size={19} />
            Applications
          </button>

          <button className="sidebar-item">
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

            <h2>0</h2>

            <h4>Total Applicants</h4>

            <p>Across all internships</p>
          </div>

          <div className="recruiter-stat-card orange">
            <div className="stat-icon">
              <FileText size={23} />
            </div>

            <h2>0</h2>

            <h4>Applications</h4>

            <p>Needs review</p>
          </div>
        </div>

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

            <button className="post-internship-btn">
              <Plus size={18} />
              Post New Internship
            </button>
          </div>
        ) : (
          <div className="recruiter-internship-grid">
            {internships.map((internship) => (
              <div className="recruiter-internship-card" key={internship._id}>
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
                <span className="internship-type-badge">{internship.type}</span>

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

            {/* Empty/Add More Box */}
            <div className="add-internship-box">
              <div className="add-internship-icon">
                <Plus size={30} />
              </div>

              <h3>Post another internship</h3>

              <p>
                Reach more students by adding another internship opportunity.
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
      </main>
    </div>
  );
};

export default RecruiterDashboard;
