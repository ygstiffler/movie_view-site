import React from 'react';
import { FaFilm, FaHeart, FaRegStar, FaStar, FaStarHalfAlt, FaLinkedin } from 'react-icons/fa';
import { FaTwitter, FaYoutube, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

// Star Rating Component
const StarRating = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="rating-stars">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="star-icon" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="star-icon" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="star-icon" />
      ))}
      <span className="rating-text">{rating.toFixed(1)}</span>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <FaFilm className="logo-icon" />
            <span>Movie<span>Review</span></span>
          </div>
          <p className="footer-description">
            Your ultimate destination for honest movie reviews, ratings, and recommendations. Discover your next favorite film today!
          </p>
          <div className="social-links">
            <a href="https://x.com/Yg_Stiffler" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com/in/harrison-chapeta-649b3635b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com/ygstiffler" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/favorites">My Favorites</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
          <div className="rating-container">
            <span style={{ marginRight: '10px' }}>Rate Us:</span>
            <StarRating rating={4.5} />
          </div>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul className="footer-links">
            <li><Link to="/movies/popular">Popular</Link></li>
            <li><Link to="/movies/top-rated">Top Rated</Link></li>
            <li><Link to="/movies/upcoming">Upcoming</Link></li>
            <li><Link to="/movies/now-playing">Now Playing</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to get the latest movie news and reviews</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Your email address" 
              aria-label="Email for newsletter subscription"
              required 
            />
            <button type="submit" className="subscribe-btn">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} MovieReview. All rights reserved.
        </div>
        <div className="footer-credits">
          Made with <FaHeart className="heart-icon" /> by MovieReview Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;