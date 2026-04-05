import React, { useContext, useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { AuthContext } from "../context/Authcontext.js";

const Myqr = () => {
  const { user } = useContext(AuthContext);
  const [upino, setUpino] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.phone) return;
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://backendqr-wal6.onrender.com/profile/${user.phone}`);
        const data = await response.json();
        if (response.ok) {
          setUpino(data.upino);
          console.log(data.upino);
        } else {
          console.error("Error fetching user details:", data.message);
        }
      } catch (error) {
        console.error("Server error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [user?.phone]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Loading user details...</p>
      </div>
    );
  }

  if (!upino) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">User details not available.</p>
      </div>
    );
  }
  const qrData = `upi://pay?pa=${upino}&pn=${user.username || "User"}&cu=INR`;
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 pt-20">
      <div className="bg-white mt-6 rounded-3xl shadow-2xl p-6 sm:p-8 w-11/12 sm:w-96 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 sm:mb-6">
          Scan & Pay with PrePay
        </h1>
        <div className="flex justify-center mb-4 sm:mb-6">
          <QRCodeCanvas value={qrData} size={150} bgColor="#ffffff" fgColor="#000000" />
        </div>
        <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4">
          UPI ID: <span className="font-semibold text-blue-500">{upino}</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          Use any UPI app like <span className="font-medium">PhonePe</span>,{" "}
          <span className="font-medium">Google Pay</span>, or{" "}
          <span className="font-medium">Paytm</span> to scan the QR code and complete your payment.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-200">
          Scan QR Code
        </button>
      </div>
    </div>
  );
};

export default Myqr;
