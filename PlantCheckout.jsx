import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getPlantImageProps } from "./plantImageUtils.js";

function setActivePlant(plant) {
  localStorage.setItem("plantnest-active-plant", JSON.stringify(plant));
  window.dispatchEvent(new CustomEvent("plantnest:set-active-plant", { detail: plant }));
}

function PlantCheckout() {
  const location = useLocation();
  const plant = location.state;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "Card"
  });

  const [paymentMode, setPaymentMode] = useState("card");

  useEffect(() => {
    if (plant) {
      setActivePlant(plant);
    }
  }, [plant]);

  if (!plant) {
    return (
      <div className="page-shell">
        <div className="empty-wishlist">
          <h2>No plant selected</h2>
          <p>Please choose a plant before opening checkout.</p>
          <button type="button" onClick={() => navigate("/")}>
            Browse Plants
          </button>
        </div>
      </div>
    );
  }

  const price = Number(plant.price || 0);
  const delivery = 99;
  const total = price + delivery;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function placeOrder() {
    axios
      .post("https://leafandbloom.onrender.com/orders", {
        ...form,
        payment: paymentMode,
        title: plant.name,
        category: plant.category,
        size: plant.size,
        light: plant.light,
        price,
        total,
        image: plant.image,
        date: new Date().toLocaleDateString()
      })
      .then(() => {
        alert("Plant order placed successfully");
        navigate("/orders");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <div className="delivery-card">
          <p className="section-kicker">Shipping details</p>
          <h2>Complete your order</h2>

          <div className="row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input name="email" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="row">
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>PIN Code *</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="delivery-card">
          <p className="section-kicker">Payment</p>
          <h2>Choose a payment method</h2>

          <div className="payment-tabs">
            <button
              type="button"
              className={paymentMode === "card" ? "tab active" : "tab"}
              onClick={() => setPaymentMode("card")}
            >
              Card
            </button>

            <button
              type="button"
              className={paymentMode === "netbanking" ? "tab active" : "tab"}
              onClick={() => setPaymentMode("netbanking")}
            >
              Net Banking
            </button>

            <button
              type="button"
              className={paymentMode === "upi" ? "tab active" : "tab"}
              onClick={() => setPaymentMode("upi")}
            >
              UPI
            </button>
          </div>

          {paymentMode === "card" && (
            <div className="payment-form">
              <label>Card Number *</label>
              <input type="text" />

              <label>Cardholder Name *</label>
              <input type="text" />

              <div className="row">
                <div>
                  <label>Expiry Date *</label>
                  <input type="text" />
                </div>

                <div>
                  <label>CVV *</label>
                  <input type="text" />
                </div>
              </div>
            </div>
          )}

          {paymentMode === "netbanking" && (
            <div className="payment-form">
              <label>Select Bank *</label>
              <select>
                <option>SBI</option>
                <option>HDFC</option>
                <option>ICICI</option>
              </select>
            </div>
          )}

          {paymentMode === "upi" && (
            <div className="payment-form">
              <label>UPI ID *</label>
              <input type="text" />
            </div>
          )}
        </div>
      </div>

      <div className="checkout-right">
        <div className="summary-card">
          <p className="section-kicker">Order summary</p>
          <h2>Plant Summary</h2>

          <div className="summary-content">
            <div className="summary-top">
              <img {...getPlantImageProps(plant.image, plant.name, plant.imagePosition)} />

              <div className="summary-details">
                <h3>{plant.name}</h3>
                <p>{plant.category}</p>
                <p>{plant.light}</p>
                <span className="price">₹ {price}</span>
              </div>
            </div>

            <div className="summary-middle">
              <hr />

              <div className="summary-row">
                <span>Plant Price</span>
                <span>₹ {price}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Charge</span>
                <span>₹ {delivery}</span>
              </div>

              <hr />

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹ {total}</span>
              </div>
            </div>

            <div className="summary-bottom">
              <button type="button" className="place-order-btn" onClick={placeOrder}>
                Place Order
              </button>

              <p className="terms">
                Plants are packed securely and shipped with care instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantCheckout;
