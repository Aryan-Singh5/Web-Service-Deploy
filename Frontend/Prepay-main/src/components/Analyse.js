import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext.js";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Analyse = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [paymentModeStats, setPaymentModeStats] = useState([]);
  const [totals, setTotals] = useState({ credit: 0, debit: 0, count: 0 });
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, activeTab]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `https://backendqr-wal6.onrender.com/api/transactions/${user.id}`
      );

      if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else if (response.data?.transactions) {
        setTransactions(response.data.transactions);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const filterTransactions = () => {
    const now = new Date();
    const todayDate = now.toISOString().split("T")[0];
    const lastWeekDate = new Date();
    lastWeekDate.setDate(now.getDate() - 7);

    const filteredData =
      activeTab === "today"
        ? transactions.filter(
            (transaction) =>
              new Date(transaction.createdAt).toISOString().split("T")[0] ===
              todayDate
          )
        : activeTab === "week"
        ? transactions.filter(
            (transaction) =>
              new Date(transaction.createdAt) >= lastWeekDate &&
              new Date(transaction.createdAt) <= now
          )
        : transactions;

    setFilteredTransactions(filteredData);
    analyzeStats(filteredData);
  };
  const analyzeStats = (data) => {
    const daily = {};
    const paymentModes = {};
    let totalCredit = 0;
    let totalDebit = 0;
    data.forEach((transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      daily[date] = daily[date] || { cashin: 0, cashout: 0 };
      daily[date].cashin += transaction.cashin || 0;
      daily[date].cashout += transaction.cashout || 0;
      paymentModes[transaction.paymentmode] =
        (paymentModes[transaction.paymentmode] || 0) +
        (transaction.amountpaid || 0);
      // Calculate totals
      totalCredit += transaction.cashin || 0;
      totalDebit += transaction.cashout || 0;
    });

    setDailyStats(Object.entries(daily));
    setPaymentModeStats(paymentModes);
    setTotals({ credit: totalCredit, debit: totalDebit, count: data.length });
  };
  // Prepare data for charts
  const dailyChartData = {
    labels: dailyStats.map(([date]) => date),
    datasets: [
      {
        label: "Cash In",
        data: dailyStats.map(([_, { cashin }]) => cashin),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Cash Out",
        data: dailyStats.map(([_, { cashout }]) => cashout),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const paymentModeChartData = {
    labels: Object.keys(paymentModeStats),
    datasets: [
      {
        label: "Payment Modes",
        data: Object.values(paymentModeStats),
        backgroundColor: [
          "#f39c12",
          "#8e44ad",
          "#2ecc71",
          "#e74c3c",
          "#3498db",
        ],
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Analyse Transactions</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "today"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("today")}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "week"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("week")}
        >
          Week
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Summary</h3>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-lg font-bold text-green-600">Total Credit</p>
            <p className="text-2xl font-semibold">{totals.credit}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <p className="text-lg font-bold text-red-600">Total Debit</p>
            <p className="text-2xl font-semibold">{totals.debit}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow">
            <p className="text-lg font-bold text-blue-600">Total Sales</p>
            <p className="text-2xl font-semibold">{totals.count}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Stats</h3>
          <Bar data={dailyChartData} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Payment Modes</h3>
          <Pie data={paymentModeChartData} />
        </div>
      </div>
    </div>
  );
};

export default Analyse;
