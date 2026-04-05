import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/Authcontext.js";
import axios from "axios";

const Customer = () => {
  const { user } = useContext(AuthContext);
  const [customer, setCustomer] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
 
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    category: "",
    balance: 0,
    customeraddress: "",
    newPhone: "",
  });
  const [editCustomerPhone, setEditCustomerPhone] = useState(null);
  const [loading, setLoading] = useState(false);

  const phone = user.phone;
  console.log(phone)

  const fetchCustomer = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://backendqr-wal6.onrender.com/customer/${phone}`);
      setCustomer(response.data.customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [phone]);

  const filteredCustomers =
    selectedCategory === "All"
      ? customer
      : customer.filter((cust) => cust.category === selectedCategory);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    try {
      if (editCustomerPhone) {
        await axios.put(
          `https://backendqr-wal6.onrender.com/user/${phone}/customer/${editCustomerPhone}`,
          formData
        );
      } else {
        await axios.post(`https://backendqr-wal6.onrender.com/user/${phone}/customer`, formData);
      }
      fetchCustomer();
      setFormData({ name: "", phoneNo: "", category: "", balance: 0, customeraddress: "", newPhone: "" });
      setEditCustomerPhone(null);
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleDelete = async (customerPhone) => {
    console.log(customerPhone);

    if (!phone) return;
    try {
      await axios.delete(`https://backendqr-wal6.onrender.com/user/${phone}/customer/${customerPhone}`);
      fetchCustomer();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      phoneNo: customer.phoneNo,
      category: customer.category,
      balance: customer.balance,
      customeraddress: customer.customeraddress,
      newPhone: "",
    });
    setEditCustomerPhone(customer.phone);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Accounts Management</h1>
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 shadow rounded-lg space-y-4 mb-8"
      >
        <h2 className="text-lg font-semibold">
          {editCustomerPhone ? "Edit Account" : "Add New Account"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
  <label className="block text-sm font-medium mb-1">Category</label>
  <input
    type="text"
    list="categories" // Reference the datalist ID
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
  />
  <datalist id="categories">
    <option value="Customer" />
    <option value="Seller" />
    <option value="Family" />
    <option value="Friend" />
    <option value="Wholeseller" />
    <option value="Expense" />
    <option value="Staff" />
    <option value="Helper" />
  </datalist>
</div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone No</label>
            <input
              type="text"
              value={formData.phoneNo}
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
              disabled={!!editCustomerPhone}
            />
          </div>

          {editCustomerPhone && (
            <div>
              <label className="block text-sm font-medium mb-1">New Phone No (optional)</label>
              <input
                type="text"
                value={formData.newPhone}
                onChange={(e) => setFormData({ ...formData, newPhone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Balance</label>
            <input
              type="number"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            value={formData.customeraddress}
            onChange={(e) => setFormData({ ...formData,customeraddress: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {editCustomerPhone ? "Update Customer" : "Add Customer"}
          </button>
          {editCustomerPhone && (
            <button
              type="button"
              onClick={() => {
                setFormData({ name: "", phone: "", category: "", balance: 0, customeraddress: "", newPhone: "" });
                setEditCustomerPhone(null);
              }}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Accounts</h2>
        <div className="flex space-x-4 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-blue-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center">Loading Accounts...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-center text-gray-500">No Account available.</p>
        ) : (
          <ul className="space-y-4">
            {filteredCustomers.map((customer) => (
              <li
                key={customer.phone}
                className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium">{customer.name}</p>
                  <p className="text-xs text-black">Phone: {customer.phone}</p>
                  <p className="text-xs text-black">Category: {customer.category}</p>
                  <p className="text-xs font-boldtext-black">Balance: {customer.balance}</p>
                  <p className="text-xs text-black">Address: {customer.customeraddress}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(customer)} // Fix here
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.phone)} // Fix here
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Customer;
