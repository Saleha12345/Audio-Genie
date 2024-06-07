import React from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import bgImage from "../img/bg.jpg";

const HomePage = () => {
  return (
    <div>
      <header>
        <img src={require("../img/logo.png")} alt="Audio Genie Logo" />
        <nav>
          <ul className="menu-items">
            <li id="active">
              <a href="#">Home</a>
            </li>
            <li>
              <a href="/Pricing">Pricing</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li className="cta-button" id="btn" style={{ color: "white" }}>
              <Link to="/signup">Register Now</Link>
            </li>
            <li
              className="login-button" id="btn"
              style={{
                border: "1px solid blue",
                color: "#0019B5",
                backgroundColor: "white",
              }}
            >
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="hero-content">
            <h4>Audio Genie</h4>
            <h1>Elevating Audio Clarity: Transforming Mixed Sounds into Distinct Tracks</h1>
            <p>Effortlessly separate voices and sounds in your recordings. Perfect for podcasts, radio, and music production.</p>
            <a href="#" className="cta-button" >Try Now</a>
          </div>
        </section>

        <section className="card-section">
          <article className="card">
            <img src={require("../img/card1.png")} alt="Garbled speech" />
            <h2>Speech Separation</h2>
            <p>Isolate individual speakers in mixed audio files effortlessly. Extract distinct tracks, apply noise reduction, and categorize by gender for a clear and customized audio experience.</p>
          </article>

          <article className="card">
            <img src={require("../img/card2.png")} alt="Speech analysis" />
            <h2>Speech Analysis & Mute</h2>
            <p>Analyze voice characteristics, mute specific speakers, and preview extracted voices before download. Gain control over your audio recordings with detailed visualizations.</p>

          </article>

          <article className="card">
            <img src={require("../img/card3.png")} alt="Audio Search" />
            <h2>Audio Search</h2>
            <p>Efficiently search for keywords or phrases in audio files. Get results with timestamps, context, and highlighted matches, enhancing your ability to find relevant content.</p>

          </article>
        </section>
      </main>
      <footer>
        <div>
          <img src={require("../img/logo.png")} alt="Audio Genie Logo" />
        </div>
        <div>
          <p>&copy; 2023 Audio Genie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
