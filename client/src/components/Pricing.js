// Import necessary React components and styles
import "../styles/SubscriptionPlan.css"; // Import your stylesheet for this component
import { Link } from "react-router-dom";
import React, { useState } from "react";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div className="subscription-plan-container">
      {/* Header */}
      <div className="header">
        <div className="logo-container">
          <img src={require("../img/logo.png")} alt="Logo" className="logo" />
          <div className="logo-text">Audio Genie</div>
        </div>

        <div className="header-links">
          <a href="/">Home</a>
          <a href="/Pricing">Pricing</a>
          <a href="#">About</a>
          <a href="/signup">
            <span className="log_btn">SignUp</span>
          </a>
          <a href="/login">
            <span
              className="login-button"
              id="btn"
              style={{
                border: "1px solid blue",
                color: "#0019B5",
                backgroundColor: "white",
              }}
            >
              Login
            </span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Your All-in-One Audio Solution</h1>
        <p>
          Select the Perfect Plan to Elevate Your Sound Experience to New
          Heights and Unleash Your Audio Creativity
        </p>

        {/* Subscription Plan Cards */}
        <div className="subscription-cards">
          {/* Free Plan Card */}
          <div className="subscription-card free-plan">
            <h2 className="free_text">Basic</h2>
            <p className="price">Rs 300</p>
            <ul className="list">
              <li>
                <i class="fa-solid fa-check" style={{ color: "blue" }}></i> 5
                Audio File Uploads
              </li>
              <li>
                <i class="fa-solid fa-check" style={{ color: "blue" }}></i> 10
                Audio Separation Requests
              </li>
              <li>
                <i class="fa-solid fa-check" style={{ color: "blue" }}></i>{" "}
                Explore Audio Genie for a week, no cost required
              </li>
            </ul>
            <Link
              className="button-link"
              to={{
                pathname: "/signup", // Include signupDetails and selectedPlan
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Standard Plan Card */}
          <div className="subscription-card standard-plan">
            <div className="best-value-box">Best Value</div>
            <h2 className="stand_text">Standard</h2>
            <p className="price_stand">
              Rs 950 <span>/month</span>
            </p>
            <ul>
              <li>
                <i class="fa-solid fa-check" style={{ color: "white" }}></i>{" "}
                Unlimited Audio File Uploads
              </li>
              <li>
                <i class="fa-solid fa-check" style={{ color: "white" }}></i> 50
                Audio Separation Requests per Month
              </li>
              <li>
                <i class="fa-solid fa-check" style={{ color: "white" }}></i> 15
                Speech analysis requests (Premium tool)
              </li>
            </ul>

            <Link
              className="button-link-stan"
              to={{
                pathname: "/signup", // Include signupDetails and selectedPlan
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Premium Plan Card */}
          <div className="subscription-card premium-plan">
            <h2 className="prem_text">Premium</h2>
            <p className="price">
              Rs 3,000 <span>/month</span>
            </p>
            <ul>
              <li>
                <i class="fa-solid fa-check" style={{ color: "blue" }}></i>{" "}
                Unlimited Audio File Uploads
              </li>
              <li>
                <i class="fa-solid fa-check" style={{ color: "blue" }}></i> 200
                Audio Separation Requests
              </li>
              <li>
                <i class="fa-solid fa-check" style={{ color: "blue" }}></i> Full
                Access to Premium Features, including Speech Analysis
              </li>
            </ul>
            <Link
              className="button-link"
              to={{
                pathname: "/signup", // Include signupDetails and selectedPlan
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
