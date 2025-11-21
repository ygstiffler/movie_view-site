import React from 'react';
import "../css/MovieCardSkeleton.css";

const MovieCardSkeleton = () => {
  return (
    <div className="movie-card-skeleton">
      <div className="skeleton-poster"></div>
      <div className="skeleton-info">
        <div className="skeleton-title"></div>
        <div className="skeleton-year"></div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
