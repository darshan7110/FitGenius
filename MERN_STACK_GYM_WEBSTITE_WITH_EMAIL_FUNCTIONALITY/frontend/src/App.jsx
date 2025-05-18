// Main React import
import React, { useEffect } from "react";

// React Router imports for routing between pages
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Toast notification component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import default toast styles

// Import global stylesheet
import "./App.css";

// Import custom components used in the application
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkoutSessions from "./components/WorkoutSessions";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import BMICalculator from "./components/BMICalculator";
import Footer from "./components/Footer";
import HealthForm from "./components/HealthForm";

// Axios for HTTP requests
import axios from "axios";

// Home component: Includes all homepage sections
const Home = () => (
  <>
    {/* Section: Hero Banner */}
    <section id="home"><Hero /></section>

    {/* Section: Workout Sessions */}
    <section id="workout"><WorkoutSessions /></section>

    {/* Section: Gallery of images */}
    <section id="gallery"><Gallery /></section>

    {/* Section: Pricing plans */}
    <section id="pricing"><Pricing /></section>

    {/* Section: Contact form */}
    <section id="contact"><Contact /></section>

    {/* Section: BMI Calculator */}
    <section id="bmi"><BMICalculator /></section>
  </>
);

// Main App component
const App = () => {
  useEffect(() => {
    // API call to count or track visits
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/visit`).catch(console.error);
  }, []);

  return (
    <Router>
      {/* Navbar is always visible */}
      <Navbar />

      {/* Define application routes here */}
      <Routes>
        {/* Route for Home Page */}
        <Route path="/" element={<Home />} />

        {/* Route for Health Form Page */}
        <Route path="/health-form" element={<HealthForm />} />
      </Routes>

      {/* Toast notifications for alerts/messages */}
      <ToastContainer theme="dark" position="top-center" />

      {/* Footer is always visible */}
      <Footer />
    </Router>
  );
};

// Export App component as default
export default App;
