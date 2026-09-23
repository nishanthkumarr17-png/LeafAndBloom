import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSignup = () => {
    if (name.trim() === "") {
      alert("Enter name first");
      return;
    }

    localStorage.setItem("username", name.trim());
    alert("Account created successfully");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <p className="section-kicker">Start growing with us</p>
        <h1>Create Account</h1>
        <p>Join PlantNest to save favorites and order healthy plants faster.</p>

        <form className="form">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /><br />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" /><br />

          <label>Password</label>
          <input type="password" placeholder="Create a password" /><br />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" /><br />

          <button type="button" onClick={handleSignup}>Create Account</button>
        </form>

        <div className="login-text">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
