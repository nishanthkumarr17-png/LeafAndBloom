import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getPlantImageProps } from "./plantImageUtils.js";

function PlantOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9001/orders")
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="page-shell">
      <div className="section-heading">
        <p className="section-kicker">Delivered with care</p>
        <h1>Plant Orders</h1>
        <p className="section-subcopy">
          Track the plants you have already brought home and revisit your recent picks.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-wishlist">
          <h2>No plant orders yet</h2>
          <p>Your next room refresh can start with one healthy plant.</p>

          <button type="button" onClick={() => navigate("/")}>
            Browse Plants
          </button>
        </div>
      ) : (
        <div>
          {orders.map((item) => (
            <div className="ordercard" key={item._id || `${item.title}-${item.date}`}>
              <img {...getPlantImageProps(item.image, item.title || "Ordered plant", item.imagePosition)} width={100} />

              <div>
                <h3>{item.title}</h3>
                <p>{item.category}</p>
                <p>{item.light}</p>
                <p>₹ {item.price}</p>
                <p>Order Date: {item.date}</p>
                <p>{item.address}</p>
                <p>Payment: {item.payment}</p>
              </div>

              <span className="status">Confirmed</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantOrders;
