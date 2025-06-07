import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to navigate pages

  


  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { email, password });
      localStorage.setItem("token", response.data.token); // Store token
      alert("Login successful!");
      navigate("/home"); // Redirect to Home Page
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>Sign In</button>
      <p>New user? <Link to="/Signup">Register here</Link></p>
    </div>
  );
};

const styles = {
  container: { 
    width: "300px", 
    margin: "50px auto", 
    textAlign: "center", 
    padding: "20px", 
    border: "1px solid #ccc", 
    borderRadius: "8px" },
    input: { 
        display: "block", 
        width: "100%", 
        padding: "10px", 
        margin: "10px 0" 
    },
  button: { 
    backgroundColor: "#007BFF", 
    color: "#fff", 
    padding: "10px", 
    border: "none", 
    cursor: "pointer", 
    width: "100%" },
};

export default Login;