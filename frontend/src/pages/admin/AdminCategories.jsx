"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminAPI } from "../../api/axios"
import "../../styles/admin.css"

function AdminCategories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await adminAPI.getAdminCategories()
        setCategories(response.data.categories)
      } catch (err) {
        setError("Failed to load categories")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user && user._id) {
      fetchCategories()
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      image: "",
    })
    setEditingCategory(null)
  }

  const handleAddCategory = () => {
    setShowForm(true)
    resetForm()
  }

  const handleEditCategory = (category) => {
    setShowForm(true)
    setEditingCategory(category)
    setFormData({
      name: category.name,
      image: category.image,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const categoryData = {
        ...formData,
      }

      let response

      if (editingCategory) {
        response = await adminAPI.updateCategory(editingCategory.id, categoryData)

        // Update categories list
        setCategories(categories.map((c) => (c.id === editingCategory.id ? response.data.category : c)))
      } else {
        response = await adminAPI.createCategory(categoryData)

        // Add new category to list
        setCategories([...categories, response.data.category])
      }

      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category")
      console.error(err)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      await adminAPI.deleteCategory(id)

      // Remove category from list
      setCategories(categories.filter((c) => c.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="admin-container">Loading categories...</div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Categories</h1>
        <button className="admin-button" onClick={handleAddCategory}>
          Add New Category
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="admin-form-container">
          <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Category Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="/images/categories/your-category.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="category-thumbnail"
                    />
                  </td>
                  <td>{category.name}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => handleEditCategory(category)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteCategory(category.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCategories
