import React, { useState } from "react";
import { toast } from "react-toastify";
import "./BMICalculator.css";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [bmi, setBmi] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();

    if (!height || !weight || !gender) {
      toast.error("Please enter valid height, weight and gender.");
      return;
    }

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

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
    <section className="bmi-section" id="bmi">
      <div className="bmi-container">
        <div className="bmi-form">
          <h2>BMI Calculator</h2>
          <form onSubmit={calculateBMI}>
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
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
              <span className="custom-arrow">&#9662;</span>
            </div>
            <button type="submit" className="calculate-btn">
              Calculate BMI
            </button>
          </form>
          {bmi && <p className="bmi-result">Your BMI: {bmi}</p>}
        </div>

        <div className="bmi-image">
          <img src="/bmi.jpg" alt="BMI Graphic" />
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
