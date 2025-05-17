import React, { useState } from "react";
import { Link } from "react-router-dom"; // For future routing if needed
import "./Navbar.css"; // External CSS styling

// Navbar component definition
const Navbar = () => {
  // State to manage whether mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function for hamburger menu
  const handleToggle = () => {
    setIsOpen(!isOpen); // Flip the isOpen state
  };

  // Closes the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    // Main navbar container
    <nav className="navbar">
      <div className="navbar-container">
        {/* Website Logo */}
        <h1 className="logo">FitGenius</h1>

        {/* Navigation links: will expand/collapse on small screens */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          {/* Each link scrolls to a specific section of the page */}
          <a href="#home" onClick={handleLinkClick}>Home</a>
          <a href="#workout" onClick={handleLinkClick}>Workouts</a>
          <a href="#gallery" onClick={handleLinkClick}>Gallery</a>
          <a href="#pricing" onClick={handleLinkClick}>Pricing</a>
          <a href="#contact" onClick={handleLinkClick}>Contact</a>
          <a href="#bmi" onClick={handleLinkClick}>BMI Calculator</a>
        </div>

        {/* Hamburger icon for mobile menu */}
        <div
          className={`hamburger ${isOpen ? "active" : ""}`}
          onClick={handleToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

// Exporting Navbar component for use in other parts of the app
export default Navbar;
