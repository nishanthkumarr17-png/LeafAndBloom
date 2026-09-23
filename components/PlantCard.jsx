import React from "react";
import { FaEye, FaHeart, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { getPlantImageProps } from "../plantImageUtils.js";

function PlantCard({
  plant,
  isWishlisted,
  onToggleWishlist,
  onOpenDetails,
  onBuyNow
}) {
  return (
    <div className="product-card">
      <div className="img-container">
        <img {...getPlantImageProps(plant.image, plant.name, plant.imagePosition)} />
        <span className="product-badge">{plant.category}</span>
        <button
          type="button"
          aria-label="Toggle wishlist"
          className={`heart-icon ${isWishlisted ? "active" : ""}`}
          onClick={() => onToggleWishlist(plant)}
        >
          <FaHeart />
        </button>
      </div>

      <div className="cardcontent">
        <div className="product-heading">
          <p>{plant.name}</p>
          <span className="price">₹ {plant.price}</span>
        </div>

        <div className="plant-meta">
          <span>{plant.light}</span>
          <span>{plant.size}</span>
        </div>

        <p className="plant-copy">{plant.description}</p>

        <div className="product-footer">
          <div className="care-note">
            <FaLeaf />
            <span>Healthy nursery-grown plant</span>
          </div>

          <div className="actions product-actions-split">
            <button type="button" className="details-btn" onClick={() => onOpenDetails(plant)}>
              <FaEye />
              View Details
            </button>

            <button type="button" className="buynow" onClick={() => onBuyNow(plant)}>
              <FaShoppingCart />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantCard;
