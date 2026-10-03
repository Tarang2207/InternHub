import { useNavigate } from "react-router-dom";

function InternshipCard({
  internship,
  onSelect,
  isSelected,
  isSaved,
  onBookmark,
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`internship-card ${isSelected ? "selected-card" : ""}`}
      onClick={() => onSelect(internship)}
    >
      <button
        className={`bookmark-btn ${isSaved ? "saved" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onBookmark(internship.id);
        }}
        title={isSaved ? "Remove bookmark" : "Save internship"}
      >
        {isSaved ? "🔖" : "🔗"}
      </button>
      <div className="company-logo">{internship.logo}</div>

      <div className="internship-info">
        <h3>{internship.title}</h3>

        <div className="job-meta">
          <span>📍 {internship.location}</span>
          <span>💼 {internship.mode}</span>
          <span>⏱ {internship.duration}</span>
        </div>

        <p className="stipend">{internship.stipend}</p>

        <div className="skills">
          {internship.skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        className="apply-btn"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/internship/${internship.id}`);
        }}
      >
        View Details
      </button>
    </div>
  );
}

export default InternshipCard;
