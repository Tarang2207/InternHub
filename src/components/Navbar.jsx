import { Link } from "react-router-dom";

function Navbar() {
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
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/signup" className="signup-btn">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
