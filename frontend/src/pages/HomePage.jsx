"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Carousel from "../components/Carousel"
import ProductCard from "../components/ProductCard"
import { productAPI, categoryAPI } from "../api/axios"
import "../styles/home-page.css"

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [carouselData, setCarouselData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          productAPI.getAllProducts(),
          categoryAPI.getAllCategories(),
        ])

        setProducts(productsRes.data.products)
        setCategories(categoriesRes.data.categories)

        // Set carousel data
        setCarouselData([
          {
            id: 1,
            title: "Summer Collection",
            subtitle: "50% Off Selected Items",
            image: "/image/Banners/b1.jpg",
            link: "/products?category=clothing",
          },
          {
            id: 2,
            title: "New Electronics",
            subtitle: "Latest Gadgets & Accessories",
            image: "/image/banners/electronics.jfif",
            link: "/products?category=electronics",
          },
          {
            id: 3,
            title: "Home Essentials",
            subtitle: "Create Your Perfect Space",
            image: "/image/banners/homeessential.jfif",
            link: "/products?category=home",
          },
        ])
      } catch (err) {
        setError("Failed to load data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products based on selected category
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <Carousel slides={carouselData} />
      </section>

      <section className="featured-products section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="" className="view-all">
              View All
            </Link>
          </div>

          <div className="products-grid">
            {products
              .filter((product) => product.featured)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="sectionContainer">
        <section className="section">
          <h2>Categories</h2>
          <div className="categories-grid">
            <button
              className={`category-button ${!selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              Show All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="section">
          <h2>Products</h2>
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        </section>
      </div>

      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <h2>New Season Arrivals</h2>
            <p>Check out all the new trends and styles for 2023</p>
            <Link to="#" className="btn btn-secondary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="newsletter-section section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest updates on new products and upcoming sales</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
