import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getSimilarMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import { motion } from 'framer-motion';
import '../css/MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, similarData] = await Promise.all([
          getMovieDetails(id),
          getSimilarMovies(id)
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="movie-details-page"
    >
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>
      
      {movie && <MovieDetails movie={movie} />}

      {similarMovies.length > 0 && (
        <div className="similar-movies">
          <h2>You Might Also Like</h2>
          <div className="similar-movies-grid">
            {similarMovies.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MovieDetailsPage;
