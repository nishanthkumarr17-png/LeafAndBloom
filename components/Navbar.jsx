import React from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaComments, FaHome, FaShoppingCart, FaUser } from "react-icons/fa";

function Navbar({ showDropdown, onToggleDropdown, onLogout, username }) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <h2>Leaf & Bloom</h2>
        </Link>
      </div>

      <div className="right">
        <Link to="/">
          <span><FaHome style={{ marginRight: "4px" }} /></span>
          Plants
        </Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/orders">
          <span><FaShoppingCart style={{ marginRight: "4px" }} /></span>
          Orders
        </Link>
        <Link to="/community">
          <span><FaComments style={{ marginRight: "4px" }} /></span>
          Community
        </Link>
        <Link to="/care-guide">
          <span><FaBookOpen style={{ marginRight: "4px" }} /></span>
          Care Guide
        </Link>

        <div className="account-dropdown" onClick={onToggleDropdown}>
          <span><FaUser style={{ marginRight: "4px" }} /></span>
          Account

          {showDropdown && (
            <div className="dropdown-menu">
              {username ? (
                <>
                  <p className="username">{username}</p>
                  <button type="button" onClick={onLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/signin">Sign In</Link>
                  <Link to="/signup">Create Account</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
