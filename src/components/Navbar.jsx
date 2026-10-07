import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Intern<span>Hub</span>
      </div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Internships</a>
        <a href="/saved">Saved</a>
        <a href="#">Companies</a>
        <a href="#">About</a>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
