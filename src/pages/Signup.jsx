import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, User, Mail, Lock, BriefcaseBusiness } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role,
        },
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="signup-page">
      {/* Background decoration */}
      <div className="signup-circle circle-one"></div>
      <div className="signup-circle circle-two"></div>
      <div className="signup-circle circle-three"></div>

      <div className="signup-container">
        {/* Left Section */}
        <div className="signup-intro">
          <div className="brand-logo">
            <span>Intern</span>Hub
          </div>

          <div className="intro-content">
            <p className="intro-small">YOUR CAREER STARTS HERE</p>

            <h1>
              Find opportunities.
              <br />
              <span>Build your future.</span>
            </h1>

            <p className="intro-description">
              Discover internships, connect with companies, build your skills
              and take the next step toward your dream career.
            </p>

            <div className="intro-feature">
              <div className="feature-icon">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h3>Thousands of opportunities</h3>
                <p>Find internships that match your skills.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Card */}
        <div className="signup-card">
          <div className="signup-heading">
            <h2>Create your account</h2>

            <p>Start discovering opportunities today.</p>
          </div>

          <form onSubmit={handleSignup}>
            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>

              <div className="input-wrapper">
                <User size={18} />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label>I am a</label>

              <div className="role-options">
                <button
                  type="button"
                  className={`role-option ${
                    role === "student" ? "active" : ""
                  }`}
                  onClick={() => setRole("student")}
                >
                  🎓
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  className={`role-option ${
                    role === "recruiter" ? "active" : ""
                  }`}
                  onClick={() => setRole("recruiter")}
                >
                  💼
                  <span>Recruiter</span>
                </button>
              </div>
            </div>

            <button type="submit" className="signup-submit">
              Create Account
              <span>→</span>
            </button>
          </form>

          {message && <div className="signup-message">{message}</div>}

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
