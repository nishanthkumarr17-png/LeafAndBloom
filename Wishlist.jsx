import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { getPlantImageProps } from "./plantImageUtils.js";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(saved);
    } catch {
      setWishlist([]);
      localStorage.removeItem("wishlist");
    }
  }, []);

  function removeItem(id) {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }

  return (
    <div className="page-shell">
      <div className="section-heading">
        <p className="section-kicker">Saved picks</p>
        <h1>Wishlist</h1>
        <p className="section-subcopy">
          Keep your favorite plants in one place and come back when you are ready.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="heart-icon-big">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Save the plants you want to bring home later.</p>

          <button type="button" onClick={() => navigate("/")}>
            Browse Plants
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((item) => (
            <div className="product-card" key={item.id}>
              <img {...getPlantImageProps(item.image, item.name, item.imagePosition)} />

              <div className="cardcontent">
                <div className="product-heading">
                  <p>{item.name}</p>
                  <span className="price">₹ {item.price}</span>
                </div>

                <div className="plant-meta">
                  <span>{item.light}</span>
                  <span>{item.size}</span>
                </div>

                <div className="care-note">
                  <FaHeart />
                  <span>Saved for later</span>
                </div>

                <div className="actions">
                  <button
                    type="button"
                    className="details-btn"
                    onClick={() => navigate(`/plants/${item.id}`)}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    className="buynow-1"
                    onClick={() => navigate("/checkout", { state: item })}
                  >
                    <FaShoppingCart style={{ marginRight: "6px" }} />
                    Buy Now
                  </button>

                  <button
                    type="button"
                    className="delete-icon-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
