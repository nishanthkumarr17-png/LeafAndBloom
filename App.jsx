import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp.jsx";
import SignIn from "./SignIn.jsx";
import Plants from "./Plants.jsx";
import Wishlist from "./Wishlist.jsx";
import PlantOrders from "./PlantOrders.jsx";
import PlantCheckout from "./PlantCheckout.jsx";
import Community from "./Community.jsx";
import CareGuide from "./CareGuide.jsx";
import PlantAssistant from "./PlantAssistant.jsx";
import PlantDetails from "./PlantDetails.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const [showDropdown, setShowDropdown] = useState(false);
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    alert("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <div>
        <Navbar
          showDropdown={showDropdown}
          onToggleDropdown={() => setShowDropdown((value) => !value)}
          onLogout={handleLogout}
          username={username}
        />

        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/plants/:plantId" element={<PlantDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<PlantOrders />} />
          <Route path="/checkout" element={<PlantCheckout />} />
          <Route path="/community" element={<Community />} />
          <Route path="/care-guide" element={<CareGuide />} />
          <Route path="/" element={<Plants />} />
        </Routes>

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <p className="section-kicker">Leaf & Bloom</p>
              <h3>Plant styling, gifting, and care for everyday homes.</h3>
            </div>

            <div className="footer-contact-grid">
              <div className="footer-contact-card">
                <strong>Contact</strong>
                <span>+91 7338456163</span>
                <span>hello@leafandbloom.in</span>
              </div>

              <div className="footer-contact-card">
                <strong>Visit</strong>
                <span></span>
                <span></span>
              </div>

              
            </div>
          </div>
        </footer>

        <PlantAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;
