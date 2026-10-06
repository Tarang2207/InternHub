import { useEffect, useState } from "react";
import { BookmarkX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import internships from "../data/internships";

function SavedInternships() {
  const navigate = useNavigate();

  const [savedInternships, setSavedInternships] = useState([]);

  useEffect(() => {
    const savedIds = JSON.parse(
      localStorage.getItem("savedInternships") || "[]",
    );

    const saved = internships.filter((internship) =>
      savedIds.includes(internship.id),
    );

    setSavedInternships(saved);
  }, []);

  const removeSaved = (id) => {
    const savedIds = JSON.parse(
      localStorage.getItem("savedInternships") || "[]",
    );

    const updatedIds = savedIds.filter((savedId) => savedId !== id);

    localStorage.setItem("savedInternships", JSON.stringify(updatedIds));

    setSavedInternships((prev) =>
      prev.filter((internship) => internship.id !== id),
    );
  };

  return (
    <div className="saved-page">
      <div className="saved-header">
        <button className="saved-back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Back to internships
        </button>

        <h1>Saved Internships</h1>

        <p>Internships you've saved for later.</p>
      </div>

      {savedInternships.length === 0 ? (
        <div className="saved-empty">
          <div className="saved-empty-icon">
            <BookmarkX size={32} />
          </div>

          <h2>No saved internships yet</h2>

          <p>Save interesting internships and come back to them later.</p>

          <button onClick={() => navigate("/")}>Explore Internships</button>
        </div>
      ) : (
        <div className="saved-grid">
          {savedInternships.map((internship) => (
            <div className="saved-card" key={internship.id}>
              <div className="saved-card-top">
                <div className="saved-company-logo">
                  {internship.company?.charAt(0)}
                </div>

                <button
                  className="remove-saved-btn"
                  onClick={() => removeSaved(internship.id)}
                  title="Remove from saved"
                >
                  <BookmarkX size={19} />
                </button>
              </div>

              <div className="saved-card-content">
                <p className="saved-company">{internship.company}</p>

                <h2>{internship.title}</h2>

                <p className="saved-location">
                  {internship.location} • {internship.mode}
                </p>

                <div className="saved-tags">
                  <span>{internship.duration}</span>
                  <span>{internship.type}</span>
                </div>

                <div className="saved-card-bottom">
                  <strong>{internship.stipend}</strong>

                  <button
                    onClick={() => navigate(`/internship/${internship.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedInternships;
