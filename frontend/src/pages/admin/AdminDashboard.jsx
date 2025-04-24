"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { adminAPI } from "../../api/axios"
import "../../styles/admin.css"

function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes, usersRes] = await Promise.all([
          adminAPI.getAdminProducts(),
          adminAPI.getAdminCategories(),
          adminAPI.getUsers(),
        ])

        setStats({
          products: productsRes.data.products.length,
          categories: categoriesRes.data.categories.length,
          users: usersRes.data.users.length,
        })
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user && user._id) {
      fetchStats()
    }
  }, [user])

  if (loading) {
    return <div className="admin-container">Loading dashboard...</div>
  }

  if (error) {
    return <div className="admin-container error">{error}</div>
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <h2>{stats.products}</h2>
          <p>Products</p>
          <Link to="/admin/products" className="admin-link">
            Manage Products
          </Link>
        </div>

        <div className="stat-card">
          <h2>{stats.categories}</h2>
          <p>Categories</p>
          <Link to="/admin/categories" className="admin-link">
            Manage Categories
          </Link>
        </div>

        <div className="stat-card">
          <h2>{stats.users}</h2>
          <p>Users</p>
          <Link to="/admin/users" className="admin-link">
            Manage Users
          </Link>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/products" className="admin-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            Add New Product
          </Link>

          <Link to="/admin/categories" className="admin-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Add New Category
          </Link>

          <Link to="/admin/users" className="admin-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
