import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">FitGenius</h1>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <a href="#home" onClick={handleLinkClick}>Home</a>
          <a href="#workout" onClick={handleLinkClick}>Workouts</a>
          <a href="#gallery" onClick={handleLinkClick}>Gallery</a>
          <a href="#pricing" onClick={handleLinkClick}>Pricing</a>
          <a href="#contact" onClick={handleLinkClick}>Contact</a>
          <a href="#bmi" onClick={handleLinkClick}>BMI Calculator</a>
        
        </div>

        <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={handleToggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
