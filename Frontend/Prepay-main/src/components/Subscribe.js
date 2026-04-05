import React, { useEffect } from "react";

const Subscribe = () => {
  useEffect(() => {
    // Dynamically load the Razorpay subscription button script
    const script = document.createElement("script");
    script.src = "https://cdn.razorpay.com/static/widget/subscription-button.js";
    script.async = true;
    script.dataset.subscription_button_id = "pl_PhSgdKEVhSl4ds"; // Replace with your actual button ID
    script.dataset.button_theme = "rzp-dark-standard";
    script.onload = () => console.log("Razorpay script loaded successfully.");
    script.onerror = () => console.error("Error loading Razorpay script.");

    // Append the script to the form
    const formElement = document.getElementById("razorpay-subscribe-form");
    if (formElement) {
      formElement.appendChild(script);
    }

    return () => {
      // Clean up: Remove the script when the component is unmounted
      if (formElement) {
        formElement.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Subscribe to Our Service</h1>
      <form
        id="razorpay-subscribe-form"
        className="bg-white p-6 shadow rounded-lg text-center"
      >
        {/* Razorpay subscription button will be rendered here */}
      </form>
    </div>
  );
};

export default Subscribe;
