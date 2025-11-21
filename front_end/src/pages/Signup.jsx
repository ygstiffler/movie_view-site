import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import httpClient from '../services/httpClient';
import '../css/Auth.css';

const Signup = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await httpClient.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      if (response.data?.token) {
        login(response.data.token);
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setError('Failed to sign up with Google. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Failed to sign up with Google');
  };

  useEffect(() => {
    let score = 0;
    const requirements = {
      minLength: formData.password.length >= 8,
      hasNumber: /\d/.test(formData.password),
      hasSpecialChar: /[!@#$%^&*(),.?\":{}|<>]/.test(formData.password),
      hasUppercase: /[A-Z]/.test(formData.password)
    };

    Object.values(requirements).forEach(met => met && score++);
    setPasswordScore(score);
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordScore < 3) {
      setError('Please choose a stronger password (at least 3 out of 4 requirements)');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await httpClient.post('/auth/register', {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setError('');
      navigate('/', {
        state: {
          registrationSuccess: true,
          email: formData.email
        },
        replace: true
      });

    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
        (err.response?.data?.errors?.[0]?.msg) || 
        'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordScore === 0) return 'from-red-500 to-red-600';
    if (passwordScore === 1) return 'from-orange-500 to-orange-600';
    if (passwordScore === 2) return 'from-yellow-500 to-yellow-600';
    if (passwordScore === 3) return 'from-emerald-500 to-emerald-600';
    return 'from-green-500 to-green-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordScore === 0) return 'Very Weak';
    if (passwordScore === 1) return 'Weak';
    if (passwordScore === 2) return 'Fair';
    if (passwordScore === 3) return 'Good';
    return 'Strong';
  };

  return (
    <div className="signup-page min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="min-h-screen w-full flex flex-col lg:flex-row relative z-10">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className={`w-full max-w-md transition-all duration-700 transform ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-10">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-purple-200">Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-200 transition-all duration-200 underline decoration-2 underline-offset-2">
                      Sign in
                    </Link>
                  </p>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-200 text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <FaTimes className="text-red-400" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group">
                    <div className="auth-input-container relative group">
                    <FaUser className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 ${focusedField === 'username' ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Username"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                  <div className="form-group">
                    <div className="auth-input-container relative group">
                    <FaEnvelope className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 ${focusedField === 'email' ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Email address"
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                  <div className="form-group">
                    <div className="auth-input-container relative group">
                    <FaLock className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 ${focusedField === 'password' ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Password"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                  <div className="form-group">
                    <div className="auth-input-container relative group">
                    <FaLock className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 ${focusedField === 'confirmPassword' ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Confirm Password"
                      required
                      className="auth-input"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                  {formData.password && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Password Strength</span>
                        <span className={`text-sm font-medium ${passwordScore >= 3 ? 'text-green-400' : passwordScore >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getPasswordStrengthColor()} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${(passwordScore / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                    whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                    className={`btn-primary ${isLoading ? 'disabled' : ''}`}
                  >
                    {isLoading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </motion.button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center">
                    </div>
                  </div>

                  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <div className="google-btn-container">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        theme="filled_black"
                        size="large"
                        text="signup_with"
                        shape="rectangular"
                        logo_alignment="left"
                      />
                    </div>
                  </GoogleOAuthProvider>
                </form>

                  <div className="text-center text-xs text-gray-400 leading-relaxed">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors duration-200 underline decoration-1 underline-offset-2">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors duration-200 underline decoration-1 underline-offset-2">
                      Privacy Policy
                    </a>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
