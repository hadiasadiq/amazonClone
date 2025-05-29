"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminAPI, categoryAPI } from "../../api/axios"
import "../../styles/admin/adminProducts.css"

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
    size: "",
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
      size: "",
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
      //age: product.age,// age put in product//
      description: product.description,
      category: product.category,
      size: product.size,
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
        setProducts(products.map((p) => (p.id === editingProduct.id ? response.data.product : p)))
      } else {
        response = await adminAPI.createProduct(productData)
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
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product")
      console.error(err)
    }
  }

  if (loading) {
    return <div className="admin-products loading">Loading products...</div>
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1 className="products-title">Products</h1>
        <button className="add-product-btn" onClick={handleAddProduct}>
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Product
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="product-form-container">
          <h2 className="product-form-title">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="product-form">
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
           
            {/* age lie same upr wala paste */}

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

            <div className="form-group">
              <label htmlFor="size">Size</label>
              <input type="text" id="size" name="size" value={formData.size} onChange={handleInputChange} required />
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-button" onClick={addImageField}>
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
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

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              {/* <th>Age</th> */}
              <th>Category</th>
              <th>Size</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td className="product-name">{product.name}</td>
                  <td>{product.description.substring(0, 50)}...</td>
                  <td className="product-price">${product.price.toFixed(2)}</td>
                  <td>
                    <span className="product-category">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </span>
                  </td>
                  <td>{product.size}</td>
                  <td>
                    {product.featured ? (
                      <span className="product-featured">Yes</span>
                    ) : (
                      <span className="product-not-featured">No</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => handleEditProduct(product)} title="Edit">
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteProduct(product.id)} title="Delete">
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
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
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
