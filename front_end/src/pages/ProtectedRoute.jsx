import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check if token exists

  return token ? children : <Navigate to="/login" replace/>; // Redirect if not logged in
};

export default ProtectedRoute;
