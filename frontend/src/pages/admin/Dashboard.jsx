"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/admin/AdminLayout"
import { ShoppingBag, Users, Tag, TrendingUp } from "lucide-react"
import { products } from "../../data/products"
import API from "../../api/axios"
import "../../styles/admin/dashboard.css"

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentOrders: [],
  })

  useEffect(() => {
    // Fetch users count
    const fetchUsers = async () => {
      try {
        const response = await API.get("/users")
        return response.data.length || 0
      } catch (error) {
        console.error("Error fetching users:", error)
        return 0
      }
    }

    // Set stats with data
    const loadStats = async () => {
      const usersCount = await fetchUsers()

      // Get unique categories from products
      const uniqueCategories = [...new Set(products.map((product) => product.category))]

      setStats({
        totalProducts: products.length,
        totalCategories: uniqueCategories.length,
        totalUsers: usersCount,
        // Mock recent orders data
        recentOrders: [
          { id: 1, customer: "John Doe", date: "2025-04-24", total: 129.99, status: "Delivered" },
          { id: 2, customer: "Jane Smith", date: "2025-04-23", total: 89.95, status: "Processing" },
          { id: 3, customer: "Robert Johnson", date: "2025-04-22", total: 199.99, status: "Shipped" },
          { id: 4, customer: "Emily Davis", date: "2025-04-21", total: 149.5, status: "Delivered" },
        ],
      })
    }

    loadStats()
  }, [])

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon categories">
              <Tag size={24} />
            </div>
            <div className="stat-details">
              <h3>Categories</h3>
              <p className="stat-value">{stats.totalCategories}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <h3>Revenue</h3>
              <p className="stat-value">$5,240.20</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Orders</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
