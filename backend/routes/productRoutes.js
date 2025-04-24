const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const Category = require("../models/Category")

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
    res.json({ products, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Get product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id })
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false })
    }
    res.json({ product, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Get products by category
router.get("/products/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
    res.json({ products, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find()
    res.json({ categories, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

// Get featured products
router.get("/products/featured", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true })
    res.json({ products: featuredProducts, success: true })
  } catch (err) {
    res.status(500).json({ message: "Server Error", success: false })
  }
})

module.exports = router
