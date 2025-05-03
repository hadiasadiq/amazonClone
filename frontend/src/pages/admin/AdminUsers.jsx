"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminAPI } from "../../api/axios"
import "../../styles/admin/adminUsers.css"

function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await adminAPI.getUsers()
        setUsers(response.data.users)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user && user._id) {
      fetchUsers()
    }
  }, [user])

  const handleToggleAdmin = async (userId) => {
    try {
      const response = await adminAPI.toggleAdminStatus(userId)
      setUsers(users.map((u) => (u._id === userId ? response.data.user : u)))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="admin-users loading">Loading users...</div>
  }

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1 className="users-title">Users</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className={u._id === user._id ? "current-user" : ""}>
                  <td className="user-id">{u._id}</td>
                  <td className="user-name">{u.name}</td>
                  <td className="user-email">{u.email}</td>
                  <td>
                    <span className={`user-role ${u.isAdmin ? "admin" : "user"}`}>{u.isAdmin ? "Admin" : "User"}</span>
                  </td>
                  <td>
                    {u._id !== user._id ? (
                      <button
                        className={u.isAdmin ? "demote-button" : "promote-button"}
                        onClick={() => handleToggleAdmin(u._id)}
                      >
                        {u.isAdmin ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="8.5" cy="7" r="4"></circle>
                              <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="8.5" cy="7" r="4"></circle>
                              <line x1="20" y1="8" x2="20" y2="14"></line>
                              <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            Make Admin
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="self-user">Current User</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
