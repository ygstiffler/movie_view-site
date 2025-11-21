import React, { useState, useEffect } from 'react';
import { getMovieDetails } from '../services/api';
import '../css/MovieDetails.css';

const MovieDetails = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <div className="movie-details-loading">Loading...</div>;
  if (error) return <div className="movie-details-error">{error}</div>;
  if (!movie) return null;

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="movie-details-content">
          <div className="movie-poster">
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.png'} 
              alt={movie.title} 
            />
          </div>
          <div className="movie-info">
            <h2>{movie.title} <span>({new Date(movie.release_date).getFullYear()})</span></h2>
            
            <div className="movie-meta">
              <div className="rating">
                <span className="rating-value">{movie.vote_average.toFixed(1)}</span>
                <span className="rating-max">/10</span>
                <span className="vote-count">({movie.vote_count} votes)</span>
              </div>
              <div className="runtime">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </div>
            </div>

            <div className="genres">
              {movie.genres?.map(genre => (
                <span key={genre.id} className="genre-tag">{genre.name}</span>
              ))}
            </div>

            <h3>Overview</h3>
            <p className="overview">{movie.overview || 'No overview available.'}</p>

            {movie.homepage && (
              <a 
                href={movie.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="official-site"
              >
                Visit Official Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
