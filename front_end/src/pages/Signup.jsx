import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await axios.post("http://localhost:5000/auth/register", { email, password });
      alert("Registration successful!");
      window.location.href = "/Login"; // Redirect to login after registration
    } catch (error) {
      console.error("Sign-Up failed:", error);
      if(error.response && error.response.data && error.response.data.message) {
        alert("Error signing up: " + error.response.data.message);
      }else{
           alert("Error signing up. Try again.");
      }
   
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
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
      <button onClick={handleSignUp} style={styles.button}>Register</button>
      <p>Already have an account? <Link to="/Login">Login here</Link></p>
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
    borderRadius: "8px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "10px 0",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};

export default SignUp;