"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminAPI, categoryAPI } from "../../api/axios"
import "../../styles/admin.css"

function AdminProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    featured: false,
    images: [""],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          adminAPI.getAdminProducts(),
          categoryAPI.getAllCategories(),
        ])

        setProducts(productsRes.data.products)
        setCategories(categoriesRes.data.categories)
      } catch (err) {
        setError("Failed to load products data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (user && user._id) {
      fetchData()
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleImageChange = (e, index) => {
    const newImages = [...formData.images]
    newImages[index] = e.target.value
    setFormData({ ...formData, images: newImages })
  }

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] })
  }

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      featured: false,
      images: [""],
    })
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    setShowForm(true)
    resetForm()
  }

  const handleEditProduct = (product) => {
    setShowForm(true)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      featured: product.featured,
      images: product.images.length > 0 ? product.images : [""],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
      }

      let response

      if (editingProduct) {
        response = await adminAPI.updateProduct(editingProduct.id, productData)

        // Update products list
        setProducts(products.map((p) => (p.id === editingProduct.id ? response.data.product : p)))
      } else {
        response = await adminAPI.createProduct(productData)

        // Add new product to list
        setProducts([...products, response.data.product])
      }

      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product")
      console.error(err)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await adminAPI.deleteProduct(id)

      // Remove product from list
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="admin-container">Loading products...</div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <button className="admin-button" onClick={handleAddProduct}>
          Add New Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="admin-form-container">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured">Featured Product</label>
            </div>

            <div className="form-group">
              <label>Product Images</label>
              {formData.images.map((image, index) => (
                <div key={index} className="image-input-group">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(e, index)}
                    placeholder="Image URL"
                  />
                  {formData.images.length > 1 && (
                    <button type="button" className="remove-button" onClick={() => removeImageField(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-button" onClick={addImageField}>
                Add Another Image
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                {editingProduct ? "Update Product" : "Add Product"}
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
              <th>Price</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{categories.find((c) => c.id === product.category)?.name || product.category}</td>
                  <td>{product.featured ? "Yes" : "No"}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => handleEditProduct(product)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProducts
