import { Check } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const pricing = [
    {
      imgUrl: "/pricing.jpg",
      title: "QUARTERLY",
      price: 18000,
      length: 3,
    },
    {
      imgUrl: "/pricing.jpg",
      title: "HEAL_YEARLY",
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

  const handleJoin = (plan) => {
    localStorage.setItem("selectedPlan", JSON.stringify(plan)); // Store full plan
    navigate("/health-form");
  };

  return (
    <section className="pricing" id="pricing">
      <h1>ELITE EDGE FITNESS PLANS</h1>
      <div className="wrapper">
        {pricing.map((element, index) => (
          <div className="card" key={element.title}>
            <div className="image-wrapper">
              <img src={element.imgUrl} alt={element.title} />
              <div className="overlay" />
              {index !== 2 && <div className="badge">20% OFF</div>}
            </div>
            <div className="title">
              <h2>{element.title.replace("_", " ")}</h2>
              <h3>PACKAGE</h3>
              <h4>Rs {element.price}</h4>
              <p>For {element.length} Months</p>
            </div>
            <div className="description">
              <p><Check /> Equipment</p>
              <p><Check /> All Day Free Training</p>
              <p><Check /> Free Restroom</p>
              <p><Check /> 24/7 Skilled Support</p>
              <p><Check /> 20 Days Freezing Option</p>
              <button className="join-btn" onClick={() => handleJoin(element)}>Join Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
