// src/api/healthAPI.js
const API_URL = import.meta.env.VITE_API_URL;

export const submitHealthData = async (formData) => {
  const response = await fetch(`${API_URL}/healthdata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error("Failed to submit health data");
  }

  return response.json();
};
