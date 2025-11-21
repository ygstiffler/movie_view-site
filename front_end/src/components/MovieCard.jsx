import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import "../css/MovieCard.css";

function MovieCard({ movie }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-poster">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.png'
          }
          alt={movie.title}
          loading="lazy"
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? <FaHeart /> : <FaRegHeart />}
          </button>
          <div className="movie-rating">
            <FaStar className="star-icon" />
            <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span className="year">{movie.release_date?.split("-")[0] || 'N/A'}</span>
          {movie.vote_average > 0 && (
            <span className="rating">
              <FaStar className="inline-star" />
              {movie.vote_average?.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;