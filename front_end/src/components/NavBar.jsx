import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import "../css/Navbar.css";

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering auth state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  // Only render the auth button when component is mounted
  if (!mounted) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie Review</Link>
      </div>
      <div className="navbar-content">
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/favorites" className="nav-link">Favorites</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
        <button 
          className={`auth-button ${isAuthenticated ? 'logout' : 'login'}`}
          onClick={handleAuthClick}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;