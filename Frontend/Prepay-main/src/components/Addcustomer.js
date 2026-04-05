import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/Authcontext'; // Import the AuthContext

const AddCustomer = () => {
  const { user } = useContext(AuthContext); // Access the user data from AuthContext
  const [customer, setcustomer] = useState([]);
  const [formData, setFormData] = useState({
    name: '', // Store the name input
    phoneNo: '',
    balance: 0,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const phone = user?.phone; // Get the user's phone from context

  // Fetch all customer for the logged-in user
  const fetchcustomer = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const response = await axios.get(`{phone}`);
      setcustomer(response.data.customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {https://backendqr-wal6.onrender.com//user/$
      setLoading(false);
    }
  };

  // Call fetchcustomer when the component mounts
  useEffect(() => {
    fetchcustomer();
  }, [phone]); // Only re-fetch when phone changes

  // Handle input changes for the customer search
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      phoneNo: '',
      balance: 0, // Reset phoneNo and balance on name change
    }));
    setDropdownVisible(true); // Show dropdown when typing
  };

  // Handle selecting a customer from the dropdown
  const handleSelectCustomer = (customer) => {
    setFormData({
      name: customer.name,
      phoneNo: customer.phone,
      balance: customer.balance,
    });
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-semibold  mb-2">Select Customer</h1>

      {/* Input field for customer name */}
      <div className="relative">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter customer name"
          className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Dropdown with auto-suggestions based on customer name */}
        {dropdownVisible && formData.name && !loading && customer.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-auto">
            {customer
              .filter((customer) =>
                customer.name.toLowerCase().includes(formData.name.toLowerCase())
              )
              .map((customer, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 p-3"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  {customer.name}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Loading state */}
      {loading && <p className="text-center text-gray-500 mt-2">Loading customer...</p>}

      {/* Display customer details once selected */}
      {formData.phoneNo && (
        <div className="mt-6">
          <p className="text-lg font-medium">Phone Number:</p>
          <p className="text-xl text-gray-700">{formData.phoneNo}</p>

          <p className="mt-4 text-lg font-medium">Balance:</p>
          <p className="text-xl text-gray-700">{formData.balance}</p>
        </div>
      )}
    </div>
  );
};

export default AddCustomer;
