import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import '../styles/SignUp.css'
import { useAuth } from "../context/AuthContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }

  //  if(phone.length !== 11 ){
  //     setError("Phone Numbe must have to be 11 Digits...");
  //     return;
  //   }

   setLoading(true);
    // send data to backend
    try {
      const response = await API.post("/register", { name, email,  password,confirmpassword, }); // change 0
      if (response.data.success) {
        // login(response.data.user);
        navigate("/login");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="SignUp-container">
      <div className="auth-box">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="confirmpassword"
            placeholder="ConfirmPassword"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;