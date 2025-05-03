const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const Category = require("../models/Category")
const User = require("../models/User")

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  // Get userId from headers
  const userId = req.headers["user-id"]

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized", success: false })
  }

  try {
    const user = await User.findById(userId)
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only.", success: false })
    }
    next()
  } catch (err) {
    return res.status(500).json({ message: "Server Error", success: false })
  }
}

// Apply admin middleware to all routes
router.use(isAdmin)

// ===== PRODUCT ROUTES =====

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
    res.json({ products, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Create a product
router.post("/products", async (req, res) => {
  try {
    const { name, price, description, category, size, featured, images } = req.body // change 2

    // Generate a unique ID
    const lastProduct = await Product.findOne().sort({ id: -1 })
    const id = lastProduct ? lastProduct.id + 1 : 1

    const product = new Product({
      id,
      name,
      price,
      description,
      category,
      size, // change 2
      featured: featured || false,
      images: images || ["/placeholder.svg"],
      rating: 0,
      reviews: 0,
    })

    await product.save()
    res.status(201).json({ message: "Product created successfully", product, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message, success: false })
  }
})

// Update a product
router.put("/products/:id", async (req, res) => {
  try {
    const { name, price, description, category, featured, images } = req.body
    const productId = req.params.id

    const product = await Product.findOneAndUpdate(
      { id: productId },
      { name, price, description, category, featured, images },
      { new: true },
    )

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false })
    }

    res.json({ message: "Product updated successfully", product, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Delete a product
router.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findOneAndDelete({ id: productId })

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false })
    }

    res.json({ message: "Product deleted successfully", success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// ===== CATEGORY ROUTES =====

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find()
    res.json({ categories, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Create a category
router.post("/categories", async (req, res) => {
  try {
    const { name, image } = req.body

    // Generate a unique ID
    const id = name.toLowerCase().replace(/\s+/g, "-")

    // Check if category with this ID already exists
    const existingCategory = await Category.findOne({ id })
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists", success: false })
    }

    const category = new Category({
      id,
      name,
      image: image || "/images/categories/default.jpg",
    })

    await category.save()
    res.status(201).json({ message: "Category created successfully", category, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message, success: false })
  }
})

// Update a category
router.put("/categories/:id", async (req, res) => {
  try {
    const { name, image } = req.body
    const categoryId = req.params.id

    const category = await Category.findOneAndUpdate({ id: categoryId }, { name, image }, { new: true })

    if (!category) {
      return res.status(404).json({ message: "Category not found", success: false })
    }

    res.json({ message: "Category updated successfully", category, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Delete a category
router.delete("/categories/:id", async (req, res) => {
  try {
    const categoryId = req.params.id

    // Check if any products use this category
    const productsWithCategory = await Product.findOne({ category: categoryId })
    if (productsWithCategory) {
      return res.status(400).json({
        message: "Cannot delete category that has products. Remove or reassign products first.",
        success: false,
      })
    }

    const category = await Category.findOneAndDelete({ id: categoryId })

    if (!category) {
      return res.status(404).json({ message: "Category not found", success: false })
    }

    res.json({ message: "Category deleted successfully", success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// ===== USER ROUTES =====

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -confirmpassword")
    res.json({ users, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Toggle admin status
router.put("/users/:id/toggle-admin", async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false })
    }

    // Toggle admin status
    user.isAdmin = !user.isAdmin
    await user.save()

    res.json({
      message: `User ${user.isAdmin ? "promoted to" : "demoted from"} admin successfully`,
      user: { ...user.toObject(), password: undefined, confirmpassword: undefined },
      success: true,
    })
  } catch (err) {
    console.error(err) // Log the error for debugging
    res.status(500).json({ message: "Server Error", success: false })
  }
})
module.exports = router
