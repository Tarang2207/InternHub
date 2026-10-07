import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  CalendarDays,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setApplications(response.data.applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Under Review":
        return "status-review";

      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-default";
    }
  };

  return (
    <div className="my-applications-container">
      {/* Back */}
      <button className="applications-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Header */}
      <div className="applications-header">
        <h1>My Applications</h1>
        <p>Track the internships you have applied for.</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="applications-loading">Loading applications...</div>
      )}

      {/* Empty */}
      {!loading && applications.length === 0 && (
        <div className="applications-empty">
          <div className="empty-icon">
            <BriefcaseBusiness size={32} />
          </div>

          <h2>No applications yet</h2>

          <p>You haven't applied for any internship yet.</p>

          <button onClick={() => navigate("/")} className="find-internship-btn">
            Find Internships
          </button>
        </div>
      )}

      {/* Application Cards */}
      {!loading && applications.length > 0 && (
        <div className="applications-grid">
          {applications.map((application) => {
            const internship = application.internship;

            return (
              <div className="application-card" key={application._id}>
                {/* Top Section */}
                <div className="application-card-top">
                  <div className="application-company-logo">
                    {internship?.company?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="application-title-section">
                    <h2>{internship?.title}</h2>

                    <p className="application-company">{internship?.company}</p>

                    <div className="application-meta">
                      {internship?.location && (
                        <span>
                          <MapPin size={15} />
                          {internship.location}
                        </span>
                      )}

                      {internship?.mode && (
                        <span>
                          <BriefcaseBusiness size={15} />
                          {internship.mode}
                        </span>
                      )}

                      {internship?.duration && (
                        <span>
                          <Clock3 size={15} />
                          {internship.duration}
                        </span>
                      )}

                      {internship?.stipend && (
                        <span>
                          <IndianRupee size={15} />
                          {internship.stipend}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`application-status ${getStatusClass(
                      application.status,
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                {/* Divider */}
                <div className="application-divider"></div>

                {/* Bottom Section */}
                <div className="application-card-bottom">
                  <div className="application-date">
                    <CalendarDays size={16} />
                    Applied on{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>

                  <div className="application-actions">
                    {application.resume && (
                      <div className="resume-info">
                        <FileText size={16} />
                        Resume attached
                      </div>
                    )}

                    <button
                      className="view-internship-btn"
                      onClick={() => navigate(`/internship/${internship?._id}`)}
                    >
                      View Internship
                      <ExternalLink size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
