import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Added Routes
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkoutSessions from "./components/WorkoutSessions";
import Gallery from "./components/Gallery";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import BMICalculator from "./components/BMICalculator";
import Footer from "./components/Footer";
import HealthForm from "./components/HealthForm";
import axios from "axios";

const Home = () => (
  <>
    <section id="home"><Hero /></section>
<section id="workout"><WorkoutSessions /></section>
<section id="gallery"><Gallery /></section>
<section id="pricing"><Pricing /></section>
<section id="contact"><Contact /></section>
<section id="bmi"><BMICalculator /></section>
  </>
);

const App = () => {
  useEffect(() => {
    axios.get("http://localhost:4000/api/visit").catch(console.error);
  }, []);

  return (
   
    <Router>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/health-form" element={<HealthForm />} />
      </Routes>
      <ToastContainer theme="dark" position="top-center" />
      <Footer/>
    </Router>
  );
};

export default App;
