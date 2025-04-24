"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminAPI } from "../../api/axios"
import "../../styles/admin.css"

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

      // Update users list
      setUsers(users.map((u) => (u._id === userId ? response.data.user : u)))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="admin-container">Loading users...</div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Users</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className={u._id === user._id ? "current-user" : ""}>
                  <td>{u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.isAdmin ? "Admin" : "User"}</td>
                  <td>
                    {u._id !== user._id ? (
                      <button
                        className={u.isAdmin ? "demote-button" : "promote-button"}
                        onClick={() => handleToggleAdmin(u._id)}
                      >
                        {u.isAdmin ? "Remove Admin" : "Make Admin"}
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
