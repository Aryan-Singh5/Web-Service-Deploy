import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/Authcontext.js";
import { FaDownload } from "react-icons/fa6";
import { MdFileUpload } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

import axios from "axios";

function History() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);

  console.log("In History component =", user.id);

  // Fetch all customers for the user
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      axios
        .get(`https://backendqr-wal6.onrender.com/api/user/${user.id}/customers`)
        .then((response) => {
          const filtered = response.data.filter((customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSuggestions(filtered);
        })
        .catch((error) => {
          console.error("Error fetching customers:", error);
        });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, user.id]);

  // Fetch transactions of the selected customer
  useEffect(() => {
    if (selectedCustomer) {
      axios
        .get(
          `https://backendqr-wal6.onrender.com/api/customer-transactions?userId=${user.id}&phone=${selectedCustomer.phone}`
        )
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        });
    }
  }, [selectedCustomer, user.id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Customer Transactions</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search customer by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="border bg-white rounded shadow-md max-h-40 overflow-y-auto">
          {suggestions.map((customer, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setSelectedCustomer(customer);
                setSearchTerm("");
                setSuggestions([]);
              }}
            >
              {customer.name} ({customer.phone})
            </li>
          ))}
        </ul>
      )}

      {/* Display Transactions */}
      {selectedCustomer && (
  <div className="mt-6">
    <h2 className="text-lg font-semibold text-gray-800">
      Transactions for {selectedCustomer.name}
    </h2>
    {transactions.length > 0 ? (
      <div className="mt-4 space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-800">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Amount:</span>
                <span className="text-gray-800">{transaction.amount}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Type:</span>
                 {/* Conditional Rendering for Icons */}
                 {transaction.cashin === 1 && (
                                <span className="text-green-500 mr-2">
                                  <IoMdDownload className="h-6 w-6" />
                                </span>
                              )}
                              {transaction.cashout === 1 && (
                                <span className="text-red-500 mr-2">
                                  <MdFileUpload className="h-6 w-6" />
                                </span>
                              )}
              </div>
             
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Payment Mode:</span>
                <span className="text-gray-800 capitalize">
                  {transaction.paymentmode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Amount Paid:</span>
                <span className="text-gray-800 capitalize">
                  {transaction.amountpaid}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600 mt-4">No transactions found.</p>
    )}
  </div>
)}
    </div>
  );
}

export default History;
