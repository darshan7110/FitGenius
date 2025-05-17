// Importing necessary React hooks and libraries
import React, { useState } from "react";
import { toast } from "react-toastify"; // For toast notifications
import "./BMICalculator.css"; // Custom styling for the BMI Calculator

// Functional component for BMI Calculator
const BMICalculator = () => {
  // State variables to hold input and result values
  const [height, setHeight] = useState(""); // User's height in cm
  const [weight, setWeight] = useState(""); // User's weight in kg
  const [gender, setGender] = useState(""); // User's gender
  const [bmi, setBmi] = useState(""); // Computed BMI value

  // Function to calculate BMI when form is submitted
  const calculateBMI = (e) => {
    e.preventDefault(); // Prevent form refresh

    // Input validation: Check if all fields are filled
    if (!height || !weight || !gender) {
      toast.error("Please enter valid height, weight and gender.");
      return;
    }

    // Convert height to meters and calculate BMI
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2); // Round to 2 decimal places
    setBmi(bmiValue); // Update BMI state

    // Show BMI status via toast notifications
    if (bmiValue < 18.5) {
      toast.warning("You are underweight. Consider seeking advice from a healthcare provider.");
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      toast.success("You have normal weight. Keep maintaining a healthy lifestyle.");
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      toast.warning("You are overweight. Consider seeking advice from a healthcare provider.");
    } else {
      toast.error("You are in the obese range. It is recommended to seek advice from a healthcare specialist.");
    }
  };

  return (
    // Main container section with ID for navigation
    <section className="bmi-section" id="bmi">
      <div className="bmi-container">
        {/* BMI Input Form */}
        <div className="bmi-form">
          <h2>BMI Calculator</h2>
          <form onSubmit={calculateBMI}>
            {/* Height Input */}
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
            {/* Weight Input */}
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            {/* Gender Dropdown */}
            <div className="select-container">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <span className="custom-arrow">&#9662;</span> {/* Down arrow icon */}
            </div>
            {/* Submit Button */}
            <button type="submit" className="calculate-btn">
              Calculate BMI
            </button>
          </form>
          {/* BMI Result Display */}
          {bmi && <p className="bmi-result">Your BMI: {bmi}</p>}
        </div>

        {/* Right Side Image */}
        <div className="bmi-image">
          <img src="/bmi.jpg" alt="BMI Graphic" />
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
