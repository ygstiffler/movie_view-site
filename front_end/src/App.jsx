import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MovieProvider } from './contexts/MovieContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import About from './pages/About';
import MovieDetailsPage from './pages/MovieDetailsPage';
import './css/App.css';

// Simple loading component
const Loader = () => (
  <div className="loader-container">
    <div className="loader"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Main App Component
function AppContent() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Add a small delay to show loading state (for demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <ProtectedRoute>
                  <MovieDetailsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Root Redirect */}
            <Route
              path="/"
              element={
                localStorage.getItem('token') ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            
            {/* 404 - Not Found */}
            <Route
              path="*"
              element={
                <div className="not-found">
                  <h2>404 - Page Not Found</h2>
                  <p>The page you are looking for doesn't exist or has been moved.</p>
                  <button
                    onClick={() => window.history.back()}
                    className="back-button"
                  >
                    Go Back
                  </button>
                </div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

// App Wrapper
function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <AppContent />
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;






