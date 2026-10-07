import { LogIn, UserPlus, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-choice-page">
      <div className="auth-choice-card">
        <div className="auth-choice-logo">
          <BriefcaseBusiness size={30} />
        </div>

        <h1>Welcome to InternHub</h1>

        <p>
          Find internships, build your skills, and take the next step toward
          your career.
        </p>

        <div className="auth-choice-buttons">
          <button
            onClick={() => navigate("/login")}
            className="auth-choice-login"
          >
            <LogIn size={18} />
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="auth-choice-signup"
          >
            <UserPlus size={18} />
            Sign Up
          </button>
        </div>

        <span className="auth-choice-note">
          Join students and recruiters on InternHub
        </span>
      </div>
    </div>
  );
};

export default AuthChoice;
