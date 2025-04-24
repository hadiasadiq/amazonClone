"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="admin-sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-sidebar-nav">
        <ul>
          <li>
            <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""} onClick={toggleSidebar}>
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
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className={location.pathname === "/admin/products" ? "active" : ""}
              onClick={toggleSidebar}
            >
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
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/categories"
              className={location.pathname === "/admin/categories" ? "active" : ""}
              onClick={toggleSidebar}
            >
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
              Categories
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={location.pathname === "/admin/users" ? "active" : ""}
              onClick={toggleSidebar}
            >
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
              Users
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleSidebar}>
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Back to Store
            </Link>
          </li>
        </ul>
      </nav>
      <div className="admin-sidebar-footer" style={{ padding: "1.5rem", marginTop: "auto" }}>
        <div style={{ fontSize: "0.875rem", opacity: "0.7" }}>Logged in as:</div>
        <div style={{ fontWeight: "bold" }}>{user?.name}</div>
      </div>
    </aside>
  )
}

export default AdminSidebar
