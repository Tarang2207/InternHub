import { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  Mail,
  MapPin,
  FileText,
  Clock3,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecruiterApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openStatusId, setOpenStatusId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/applications/recruiter",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
    <div className="recruiter-applications-page">
      <div className="recruiter-applications-container">
        {/* Back Button */}
        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/recruiter-dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="recruiter-applications-header">
          <div className="recruiter-applications-icon">
            <BriefcaseBusiness size={25} />
          </div>

          <div>
            <h1>Applications</h1>
            <p>Review and manage applications from students.</p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="recruiter-applications-empty">
            <p>Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          /* Empty State */
          <div className="recruiter-applications-empty">
            <FileText size={42} />

            <h2>No applications yet</h2>

            <p>Applications submitted by students will appear here.</p>
          </div>
        ) : (
          /* Applications */
          <div className="recruiter-applications-list">
            {applications.map((application) => (
              <div className="recruiter-application-card" key={application._id}>
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

                  <div className="status-dropdown">
                    <button
                      className="status-dropdown-btn"
                      onClick={() =>
                        setOpenStatusId(
                          openStatusId === application._id
                            ? null
                            : application._id,
                        )
                      }
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
                            key={status}
                            className={`status-dropdown-option ${
                              application.status === status ? "selected" : ""
                            }`}
                            onClick={() => {
                              handleStatusChange(application._id, status);
                              setOpenStatusId(null);
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
    </div>
  );
};

export default RecruiterApplications;
