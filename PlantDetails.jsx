import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaLeaf, FaShoppingCart, FaSun, FaTint } from "react-icons/fa";
import plants from "./plantsData.js";
import { getPlantImageProps } from "./plantImageUtils.js";
import PlantCard from "./components/PlantCard.jsx";
import ReviewSection from "./components/ReviewSection.jsx";
import {
  getBeginnerTip,
  getHumidityTip,
  getPetSafetyText,
  getWateringTip
} from "./plantCareUtils.js";

function setActivePlant(plant) {
  localStorage.setItem("plantnest-active-plant", JSON.stringify(plant));
  window.dispatchEvent(new CustomEvent("plantnest:set-active-plant", { detail: plant }));
}

function PlantDetails() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const plant = useMemo(() => plants.find((item) => item.id === plantId), [plantId]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(saved);
    } catch {
      localStorage.removeItem("wishlist");
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    if (plant) {
      setActivePlant(plant);
    }
  }, [plant]);

  const relatedPlants = useMemo(() => {
    if (!plant) {
      return [];
    }

    return plants
      .filter((item) => item.id !== plant.id && (item.category === plant.category || item.light === plant.light))
      .slice(0, 3);
  }, [plant]);

  if (!plant) {
    return (
      <div className="page-shell">
        <div className="empty-wishlist">
          <h2>Plant not found</h2>
          <p>The plant you opened is not available right now.</p>
          <button type="button" onClick={() => navigate("/")}>
            Back to collection
          </button>
        </div>
      </div>
    );
  }

  function toggleWishlist(item) {
    const exists = wishlist.some((savedPlant) => savedPlant.id === item.id);
    const updatedWishlist = exists
      ? wishlist.filter((savedPlant) => savedPlant.id !== item.id)
      : [...wishlist, item];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  }

  function isWishlisted(id) {
    return wishlist.some((savedPlant) => savedPlant.id === id);
  }

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero">
        <button type="button" className="back-link-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Back
        </button>

        <div className="detail-grid">
          <div className="detail-image-shell">
            <img {...getPlantImageProps(plant.image, plant.name, plant.imagePosition)} />
          </div>

          <div className="detail-copy">
            <p className="section-kicker">{plant.category}</p>
            <h1>{plant.name}</h1>
            <p className="detail-description">{plant.description}</p>

            <div className="detail-price-row">
              <strong>₹ {plant.price}</strong>
              <span>{plant.size} size</span>
            </div>

            <div className="detail-chip-row">
              <span>{plant.light}</span>
              <span>{plant.size}</span>
              <span>{plant.difficulty}</span>
            </div>

            <div className="detail-action-row">
              <button
                type="button"
                className="hero-primary"
                onClick={() => navigate("/checkout", { state: plant })}
              >
                <FaShoppingCart />
                Buy Now
              </button>

              <button
                type="button"
                className={`detail-wishlist-btn ${isWishlisted(plant.id) ? "active" : ""}`}
                onClick={() => toggleWishlist(plant)}
              >
                <FaHeart />
                {isWishlisted(plant.id) ? "Saved" : "Save to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-head">
          <div>
            <p className="section-kicker">Care snapshot</p>
            <h2>How to keep this plant happy</h2>
          </div>
        </div>

        <div className="detail-care-grid">
          <article className="detail-care-card">
            <FaTint />
            <h3>Watering</h3>
            <p>{getWateringTip(plant)}</p>
          </article>
          <article className="detail-care-card">
            <FaSun />
            <h3>Light</h3>
            <p>{plant.name} does best in {plant.light.toLowerCase()}. Best placement: {plant.placement.toLowerCase()}.</p>
          </article>
          <article className="detail-care-card">
            <FaLeaf />
            <h3>Beginner note</h3>
            <p>{getBeginnerTip(plant)}</p>
          </article>
        </div>

        <div className="detail-tip-panel">
          <div>
            <p className="section-kicker">Care tips</p>
            <h3>Quick routine for {plant.name}</h3>
          </div>

          <ul className="detail-tip-list">
            <li>
              <strong>Water check</strong>
              <span>{getWateringTip(plant)}</span>
            </li>
            <li>
              <strong>Light placement</strong>
              <span>{plant.placement}. Avoid sudden moves once the plant settles.</span>
            </li>
            <li>
              <strong>Humidity</strong>
              <span>{getHumidityTip(plant)}.</span>
            </li>
            <li>
              <strong>Pet note</strong>
              <span>{getPetSafetyText(plant)}.</span>
            </li>
          </ul>
        </div>

        <div className="detail-spec-grid">
          <div className="detail-spec-card">
            <strong>Humidity</strong>
            <span>{getHumidityTip(plant)}</span>
          </div>
          <div className="detail-spec-card">
            <strong>Pet Safety</strong>
            <span>{getPetSafetyText(plant)}</span>
          </div>
          <div className="detail-spec-card">
            <strong>Soil</strong>
            <span>{plant.soil}</span>
          </div>
          <div className="detail-spec-card">
            <strong>Fertilizer</strong>
            <span>{plant.fertilizer}</span>
          </div>
          <div className="detail-spec-card">
            <strong>Temperature</strong>
            <span>{plant.temperature}</span>
          </div>
          <div className="detail-spec-card">
            <strong>Best Placement</strong>
            <span>{plant.placement}</span>
          </div>
        </div>
      </section>

      <ReviewSection plantId={plant.id} plantName={plant.name} />

      <section className="detail-section">
        <div className="detail-section-head">
          <div>
            <p className="section-kicker">You may also like</p>
            <h2>Similar plants for your space</h2>
          </div>
        </div>

        <div className="product-grid">
          {relatedPlants.map((item) => (
            <PlantCard
              key={item.id}
              plant={item}
              isWishlisted={isWishlisted(item.id)}
              onToggleWishlist={toggleWishlist}
              onOpenDetails={(selectedPlant) => navigate(`/plants/${selectedPlant.id}`)}
              onBuyNow={(selectedPlant) => {
                setActivePlant(selectedPlant);
                navigate("/checkout", { state: selectedPlant });
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default PlantDetails;
