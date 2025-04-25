"use client"

// Import necessary modules and components
import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminAPI, categoryAPI } from "../../api/axios"
import "../../styles/admin.css"

function AdminProducts() {
  const { user } = useAuth() // Get the authenticated user from context
  const [products, setProducts] = useState([]) // State to store products
  const [categories, setCategories] = useState([]) // State to store categories
  const [loading, setLoading] = useState(true) // State to manage loading state
  const [error, setError] = useState("") // State to store error messages

  // Form state
  const [showForm, setShowForm] = useState(false) // State to toggle the form visibility
  const [editingProduct, setEditingProduct] = useState(null) // State to track the product being edited
  const [formData, setFormData] = useState({
    name: "", // Product name
    price: "", // Product price
    description: "", // Product description
    category: "", // Product category
    size:'',
    featured: false, // Whether the product is featured
    images: [""], // Array of product image URLs
  })

  // Fetch products and categories when the component mounts or user changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true) // Start loading
        // Fetch products and categories concurrently
        const [productsRes, categoriesRes] = await Promise.all([
          adminAPI.getAdminProducts(),
          categoryAPI.getAllCategories(),
        ])

        setProducts(productsRes.data.products) // Set fetched products
        setCategories(categoriesRes.data.categories) // Set fetched categories
      } catch (err) {
        setError("Failed to load products data") // Handle errors
        console.error(err)
      } finally {
        setLoading(false) // Stop loading
      }
    }

    if (user && user._id) {
      fetchData() // Fetch data only if the user is authenticated
    }
  }, [user])

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // Update form data
    })
  }

  // Handle changes to image fields
  const handleImageChange = (e, index) => {
    const newImages = [...formData.images]
    newImages[index] = e.target.value
    setFormData({ ...formData, images: newImages }) // Update images array
  }

  // Add a new image field
  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] })
  }

  // Remove an image field
  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  // Reset the form to its initial state
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      size:'', // change 2
      category: "",
      featured: false,
      images: [""],
    })
    setEditingProduct(null) // Clear the editing product
  }

  // Handle adding a new product
  const handleAddProduct = () => {
    setShowForm(true) // Show the form
    resetForm() // Reset the form
  }

  // Handle editing an existing product
  const handleEditProduct = (product) => {
    setShowForm(true) // Show the form
    setEditingProduct(product) // Set the product being edited
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      size: product.size, // change 3
      featured: product.featured,
      images: product.images.length > 0 ? product.images : [""],
    })
  }

  // Handle form submission for adding or editing a product
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price), // Ensure price is a number
      }

      let response

      if (editingProduct) {
        // Update the product if editing
        response = await adminAPI.updateProduct(editingProduct.id, productData)

        // Update the product in the list
        setProducts(products.map((p) => (p.id === editingProduct.id ? response.data.product : p)))
      } else {
        // Create a new product
        response = await adminAPI.createProduct(productData)

        // Add the new product to the list
        setProducts([...products, response.data.product])
      }

      setShowForm(false) // Hide the form
      resetForm() // Reset the form
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product") // Handle errors
      console.error(err)
    }
  }

  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await adminAPI.deleteProduct(id) // Delete the product

      // Remove the product from the list
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product") // Handle errors
      console.error(err)
    }
  }

  // Show a loading message while data is being fetched
  if (loading) {
    return <div className="admin-container">Loading products...</div>
  }

  return (
    <div className="admin-container">
      {/* Header section */}
      <div className="admin-header">
        <h1>Manage Products</h1>
        <button className="admin-button" onClick={handleAddProduct}>
          Add New Product
        </button>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Product form */}
      {showForm && (
        <div className="admin-form-container">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            {/* Form fields */}
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
            <div className="form-group">
              <label htmlFor="size">size</label>  {/*/ change 4 */}
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              />
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

            {/* Form actions */}
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

      {/* Products table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Size</th> {/** change 2 */}
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
                  <td>{product.size}</td> {/* change 2*/}
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
