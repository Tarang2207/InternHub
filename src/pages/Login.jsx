import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, BriefcaseBusiness } from "lucide-react";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");

      console.log("Login response:", response.data);

      // console.log("Login response:", JSON.stringify(response.data, null, 2));
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-circle login-circle-one"></div>
      <div className="login-circle login-circle-two"></div>
      <div className="login-circle login-circle-three"></div>

      <div className="login-container">
        {/* Left Section */}
        <div className="login-intro">
          <div className="login-brand">
            <span>Intern</span>Hub
          </div>

          <div className="login-intro-content">
            <p className="login-intro-small">WELCOME BACK</p>

            <h1>
              Your next
              <br />
              <span>opportunity awaits.</span>
            </h1>

            <p className="login-description">
              Continue exploring internships, connect with companies and take
              another step toward your dream career.
            </p>

            <div className="login-feature">
              <div className="login-feature-icon">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h3>Discover. Apply. Grow.</h3>
                <p>Your career journey starts here.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-heading">
            <h2>Welcome back</h2>

            <p>Login to continue to InternHub.</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="login-form-group">
              <label>Email Address</label>

              <div className="login-input-wrapper">
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
            <div className="login-form-group">
              <div className="login-password-label">
                <label>Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setMessage("Password reset will be available soon.")
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="login-input-wrapper">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-submit">
              Login
              <span>→</span>
            </button>
          </form>

          {message && <div className="login-message">{message}</div>}

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="signup-text">
            Don't have an account? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
