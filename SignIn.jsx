import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (name.trim() === "") {
      alert("Enter name first");
      return;
    }

    localStorage.setItem("username", name.trim());
    alert("Login successful");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <p className="section-kicker">PlantNest account</p>
        <h1>Welcome back</h1>
        <p>Sign in to manage your wishlist and plant orders.</p>

        <form className="form">
          <label>Name</label>
          <input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /><br />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" /><br />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" /><br />

          <button type="button" onClick={handleLogin}>Sign In</button>
        </form><br />

        <div className="login-text">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
