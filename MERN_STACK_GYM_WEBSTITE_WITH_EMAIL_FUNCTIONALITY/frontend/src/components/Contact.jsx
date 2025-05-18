// ===== IMPORTING DEPENDENCIES =====
import axios from "axios"; // For making HTTP requests
import React, { useState } from "react"; // React core and useState for state management
import { ClipLoader } from "react-spinners"; // Spinner loader for submit button during async process
import { toast } from "react-toastify"; // For showing user-friendly alerts
import "./Contact.css"; // Importing component-specific styles

// ===== CONTACT COMPONENT =====
const Contact = () => {
  // ----- FORM INPUT STATES -----
  const [name, setName] = useState("");       // User's name
  const [email, setEmail] = useState("");     // User's email
  const [message, setMessage] = useState(""); // User's message
  const [loading, setLoading] = useState(false); // Loader state for async request

  // ===== FUNCTION TO SEND MAIL =====
  const sendMail = async (e) => {
    e.preventDefault(); // Prevents default form reload on submit
    setLoading(true);   // Enable loading spinner

    try {
      // ---- API REQUEST ----
      const { data } = await axios.post(
        "https://fitgenius-production.up.railway.app/send/mail", // ⚠️ LOCAL BACKEND API ENDPOINT
        {
          name,
          email,
          message,
        },
        {
          withCredentials: true, // Allows cookies if needed
          headers: { "Content-Type": "application/json" },
        }
      );

      // ---- RESET FORM AFTER SUCCESS ----
      setName("");
      setEmail("");
      setMessage("");

      // ---- SHOW SUCCESS MESSAGE ----
      toast.success(data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      // ---- SHOW ERROR MESSAGE ----
      toast.error(error.response?.data?.message || "Mail failed to send.");
    }
  };

  // ===== RENDER CONTACT FORM UI =====
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <h2>Contact Us</h2>

        <form className="contact-form" onSubmit={sendMail}>
          {/* ---- NAME INPUT ---- */}
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* ---- EMAIL INPUT ---- */}
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* ---- MESSAGE TEXTAREA ---- */}
          <textarea
            placeholder="Your Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          {/* ---- SUBMIT BUTTON WITH LOADER ---- */}
          <button type="submit" className="contact-btn" disabled={loading}>
            {loading ? <ClipLoader color="#fff" size={20} /> : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
