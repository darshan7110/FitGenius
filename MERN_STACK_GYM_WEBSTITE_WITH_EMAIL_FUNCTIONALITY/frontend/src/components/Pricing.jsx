import { Check } from "lucide-react"; // Importing check icon from Lucide UI
import React from "react";
import { useNavigate } from "react-router-dom"; // For navigating to health form page

// Pricing Component Definition
const Pricing = () => {
  const navigate = useNavigate(); // Hook to navigate between routes

  // Array of pricing plan objects
  const pricing = [
    {
      imgUrl: "/pricing.jpg", // Background image for the card
      title: "QUARTERLY",     // Plan name
      price: 18000,           // Plan price in Rs
      length: 3,              // Duration in months
    },
    {
      imgUrl: "/pricing.jpg",
      title: "HALF YEARLY",   // Slightly customized yearly health plan
      price: 34000,
      length: 6,
    },
    {
      imgUrl: "/pricing.jpg",
      title: "YEARLY",
      price: 67000,
      length: 12,
    },
  ];

  // Function to handle "Join Now" button click
  const handleJoin = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify(plan)); // Save selected plan in local storage
    navigate("/health-form"); // Redirect to health form page
  };

  return (
    // Main pricing section with id for anchor linking
    <section className="pricing" id="pricing">
      {/* Section Heading */}
      <h1>ELITE EDGE FITNESS PLANS</h1>

      {/* Container for all pricing cards */}
      <div className="wrapper">
        {pricing.map((element, index) => (
          // Individual pricing card
          <div className="card" key={element.title}>
            
            {/* Image container with overlay and badge */}
            <div className="image-wrapper">
              <img src={element.imgUrl} alt={element.title} />
              <div className="overlay" /> {/* Transparent layer for visual effect */}
              {index !== 2 && <div className="badge">20% OFF</div>} {/* Discount badge shown only on first two plans */}
            </div>

            {/* Card Title & Pricing Info */}
            <div className="title">
              <h2>{element.title.replace("_", " ")}</h2> {/* Replace underscores for better display */}
              <h3>PACKAGE</h3>
              <h4>Rs {element.price}</h4>
              <p>For {element.length} Months</p>
            </div>

            {/* Plan Benefits & Action Button */}
            <div className="description">
              <p><Check /> Equipment</p>
              <p><Check /> All Day Free Training</p>
              <p><Check /> Free Restroom</p>
              <p><Check /> 24/7 Skilled Support</p>
              <p><Check /> 20 Days Freezing Option</p>
              
              {/* Join Now Button triggers handleJoin with current plan */}
              <button className="join-btn" onClick={() => handleJoin(element)}>Join Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Exporting component to be used in other files
export default Pricing;
