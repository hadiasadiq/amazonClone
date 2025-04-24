import axios from "axios"

// Create base API instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include user ID in headers for authenticated requests
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user._id) {
      config.headers["User-ID"] = user._id
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Auth endpoints
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
}

// Product endpoints
export const productAPI = {
  getAllProducts: () => API.get("/products"),
  getProductById: (id) => API.get(`/products/${id}`),
  getProductsByCategory: (categoryId) => API.get(`/products/category/${categoryId}`),
  getFeaturedProducts: () => API.get("/products/featured"),
}

// Category endpoints
export const categoryAPI = {
  getAllCategories: () => API.get("/categories"),
}

// Admin endpoints
export const adminAPI = {
  // Products
  getAdminProducts: () => API.get("/admin/products"),
  createProduct: (data) => API.post("/admin/products", data),
  updateProduct: (id, data) => API.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),

  // Categories
  getAdminCategories: () => API.get("/admin/categories"),
  createCategory: (data) => API.post("/admin/categories", data),
  updateCategory: (id, data) => API.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/admin/categories/${id}`),

  // Users
  getUsers: () => API.get("/admin/users"),
  toggleAdminStatus: (id) => API.put(`/admin/users/${id}/toggle-admin`),
}

export default API
