import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/Authcontext.js";
import { FaDownload } from "react-icons/fa6";
import { MdFileUpload } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

const Transaction = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = async () => {
    console.log("THE user id in transcation component",user.id);
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backendqr-wal6.onrender.com/api/transactions/${user.id}`
      );
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions); // Default to all transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const filterTransactions = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfWeek.getDate() - now.getDay());

    if (filter === "today") {
      setFilteredTransactions(
        transactions.filter((transaction) =>
          new Date(transaction.createdAt) >= startOfDay
        )
      );
    } else if (filter === "week") {
      setFilteredTransactions(
        transactions.filter((transaction) =>
          new Date(transaction.createdAt) >= startOfWeek
        )
      );
    } else if (filter === "date" && selectedDate) {
      const chosenDate = new Date(selectedDate);
      setFilteredTransactions(
        transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          return (
            transactionDate.getFullYear() === chosenDate.getFullYear() &&
            transactionDate.getMonth() === chosenDate.getMonth() &&
            transactionDate.getDate() === chosenDate.getDate()
          );
        })
      );
    } else {
      setFilteredTransactions(transactions);
    }
  };

  useEffect(() => {
    filterTransactions();
  }, [filter, selectedDate, transactions]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Your Transactions
      </h1>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`p-2 rounded-lg ${
            filter === "today"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setFilter("today")}
        >
          Today
        </button>
        <button
          className={`p-2 rounded-lg ${
            filter === "week"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setFilter("week")}
        >
          Week
        </button>
        <div>
          <input
            type="date"
            className="p-2 rounded-lg border border-gray-300"
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setFilter("date");
            }}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && <div className="text-center">Loading...</div>}

      {/* No Transactions Message */}
      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center text-gray-600">
          No transactions found for the selected filter.
        </div>
      )}

      {/* Transactions List */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-4 bg-white shadow rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {transaction.customername}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  ₹{transaction.amount}
                </p>
                <p className="text-sm text-gray-600">
                  Paid-{transaction.amountpaid} <br />
                  {transaction.paymentmode} -{" "}
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>

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

              <button
                className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={() => setSelectedTransaction(transaction)}
              >
                Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Transaction Details
            </h2>
            <p>
              <strong>Customer Name:</strong>{" "}
              {selectedTransaction.customername}
            </p>
            <p>
              <strong>Amount:</strong> ₹{selectedTransaction.amount}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹{selectedTransaction.amountpaid}
            </p>
            <p>
              <strong>Payment Mode:</strong> {selectedTransaction.paymentmode}
            </p>
            <p>
              <strong>Discount:</strong> {selectedTransaction.discount}
            </p>
            <p>
              <strong>Note:</strong> {selectedTransaction.note}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedTransaction.createdAt).toLocaleString()}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setSelectedTransaction(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default Transaction;
