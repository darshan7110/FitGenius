import React from "react";

// Hero component represents the landing section of the home page
const Hero = () => {

  // Placeholder function for handling button click, you can add navigation logic here later
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    // Hero section with id="home" used for navigation (like anchor scroll)
    <section className="hero" id="home">
      <div className="content">
        
        {/* Title section with bold motivational words */}
        <div className="title">
          <h1>LET'S</h1>
          <h1>GET</h1>
          <h1>MOVING</h1>
        </div>

        {/* Subtitle for motivation tagline */}
        <div className="sub-title">
          <p>Your Journey to Fitness Starts Here</p>
          <p>Unleash Your Potential</p>
        </div>

        {/* Call-to-action buttons */}
        <div className="hero-buttons">
      <button className="primary-btn" onClick={() => scrollToSection('pricing')}>
        Start Your Journey
      </button>
      <button className="secondary-btn" onClick={() => scrollToSection('workout')}>
        Discover Your Plan
      </button>
    </div>
      </div>
    </section>
  );
};

export default Hero; // Exporting the Hero component for use in other parts of the project
