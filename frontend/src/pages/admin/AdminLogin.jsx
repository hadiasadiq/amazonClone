"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/admin/admin-login.css"

function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Simple admin validation - in a real app, this would be a server request
    if (email === "admin@example.com" && password === "admin123") {
      // Store admin info in localStorage
      localStorage.setItem(
        "adminInfo",
        JSON.stringify({
          isAdmin: true,
          name: "Admin User",
          email: email,
        }),
      )
      navigate("/admin/dashboard")
    } else {
      setError("Invalid admin credentials")
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
