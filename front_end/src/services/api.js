const API_KEY = "09b14a8f384fbe0f0c18350397f1a741";
const BASE_URL = "https://api.themoviedb.org/3";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.status_message || 'Something went wrong');
  }
  return response.json();
};

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await handleResponse(response);
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    const data = await handleResponse(response);
    return data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar`
    );
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&page=${page}`
    );
    const data = await handleResponse(response);
    return data.results;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
};
