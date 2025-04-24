"use client"

import { Link } from "react-router-dom"
import "../styles/product-card.css"

function ProductCard({ product }) {

  const handleAddToCart = (e) => {
    alert("Added to cart!");
  };

  return (
    <div className="product-card">
      <Link to={`#`} className="product-link">
        <div className="product-image">
          <img src={product.images[0] || "/placeholder.svg"} alt={product.name} />
      
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">${product.price.toFixed(2)}</div>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "star filled" : "star"}>
                  ★
                </span>
              ))}
            </div>
            <span className="review-count">({product.reviews})</span>
          </div>
        </div>
      </Link>

      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard
