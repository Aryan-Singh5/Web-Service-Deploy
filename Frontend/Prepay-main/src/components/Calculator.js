import React, { useState, useEffect, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { FaNotesMedical } from "react-icons/fa6";
import { AuthContext } from "../context/Authcontext.js";

const Calculator = () => {
  
  const { user } = useContext(AuthContext);
  const [upino, setUpino] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [calculation, setCalculation] = useState('0');
  const [customer, setcustomer] = useState([]);
  const [filteredcustomer, setFilteredcustomer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [showTextarea, setShowTextarea] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [amountpaid,setamountpaid]  = useState();
  const [discount,setdiscount]  = useState();
  const [balance,setbalance] = useState(0);
  const [cashIn,setCashIn] = useState(0);
  const [cashOut,setCashOut]= useState(0);
  const [totalamount,settotalamount]= useState(0);
  const [selected, setSelected] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  // Handle voice input
  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTransactionDetails((prev) => `${prev} ${transcript}`); // Append new input
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

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
  

  const paymentModes = [
    { id: "cash", label: "Cash" },
    { id: "upi", label: "UPI" },
    { id: "card", label: "CARD" },
    { id: "Bank", label: "BANK" },
  ];
  console.log(user.phone);
  const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000).toString();
   // Replace this with your actual user object
  
   useEffect(() => {
    const fetchCustomer = async () => {
      if (!user?.phone) {
        console.log("User phone number is not available.");
        return;
      }
      try {
        console.log("The customer phone no is - ",user.phone);
        const response = await axios.get(`https://backendqr-wal6.onrender.com/user/${user.phone}`);
        setcustomer(response.data.customer);
        console.log("Fetched customer:", response.data.customer);
      } catch (err) {
        console.error("Error fetching customer:", err);
      
      }
    };
    fetchCustomer(); // Invoke the function immediately
    // Dependency array includes user.phone
  }, [user.phone]);

   console.log("the user id is -",user.id);
   console.log("THE CUSTOMER IS ",customer)

 
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredcustomer(
      customer.filter((customer) =>
        customer.name.toLowerCase().includes(query)
      )
    );
  };

  const handlecustomerelection = (customer) => {
    setSelectedCustomer(customer);
    setSearchQuery(customer.name);
    setFilteredcustomer([]);
  };

  const generateUPILink = React.useCallback(() => {
    if (!upino || !calculation) {
      alert("Please ensure valid UPI details and amount from calculation.");
      return "";
    }
    return `upi://pay?pa=${upino}&pn=${user.name}&am=${calculation}&cu=INR&tn=${generatedCode}`;
  }, [upino, user.name, calculation, generatedCode]);

  const handleVerification = () => {
    if (verificationCode === generatedCode) {
      setSuccess(true);
      setSelectedPayment("upi");
      setShowModal(false);
      alert("Payment Verified Successfully!");
    } else {
      alert("Incorrect verification code. Please try again.");
    }
  };

  const handleCalculation = (value) => {
    setCalculation((prev) => {
      if (prev === "0" && value !== "C" && value !== "=") {
        return value; // Replace "0" with the first clicked value
      } else if (value === "C") {
        return "0"; // Reset to "0" when clearing
      } else if (value === "=") {
        try {
          return eval(prev).toString(); // Evaluate the expression
        } catch {
          alert("Invalid calculation");
          return prev;
        }
      } else {
        return prev + value; // Append value normally
      }
    });
  };
  

  const handleQRGeneration = () => {
    const code = generateVerificationCode();
    setGeneratedCode(code);
    setShowModal(true);
  };

  const handleSaleClick = () => {
    setSelected("sale");
    setCashIn(1); // Call your `setCashIn` function here
    setCashOut(0);
  };

  const handleExpenseClick = () => {
    setSelected("expense");
    setCashOut(1); // Call your `setCashOut` function here
    setCashIn(0);
  };

  const transactionData = selectedCustomer
  ? {
      userId: user.id,
      customerno: selectedCustomer.phone,
      customername: selectedCustomer.name,
      amount: calculation,
      amountpaid:amountpaid ,
      cashin: cashIn,
      cashout: cashOut,
      paymentmode: selectedPayment,
      discount: discount,
      note:transactionDetails,
      expense: 0,
    }
  : {
      userId: user.id,
      customerno: "0",
      customername: "0",
      amount: calculation,
      amountpaid: amountpaid,
      cashin: cashIn,
      cashout: cashOut,
      paymentmode: selectedPayment,
      discount: discount,
      note:transactionDetails,
      expense: 0,
    };

console.log("Transaction Data: ", transactionData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://backendqr-wal6.onrender.com/api/transaction", transactionData);
      console.log("Transaction Created:", response.data);
      setIsModalOpen(true); // Open the modal after successful submission
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };
 
  const shareOnWhatsApp = (phone) => {
    // Structure the transaction details in a receipt format
    const message = `
  Hello,
  Your transaction has been created successfully. Below are the details:
  🧾 *Transaction Receipt* 🧾
  - Name: ₹${transactionData.customername}
  - Amount: ₹${transactionData.amount}
  - Amount Paid :  ₹${transactionData.amountpaid}
  - Payment Method: ${transactionData.paymentmode}
  - Note: ${transactionData.note}
  Thank you for using our service!
  `.trim(); // Trim to remove any extra newlines or spaces
    // Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close modal
    window.location.reload(); // Reload the page
  };

  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  return (
    <div className=" mt-20  overflow-y-auto bg-gray-100 flex flex-col items-center justify-center p-1">
      
      {/* Selected Customer Details */}
      {selectedCustomer && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-2 w-full max-w-md">
          <p className="text-gray-600 font-bold">Name: {selectedCustomer.name}</p>
          <p className="text-gray-600 font-bold">Balance: {selectedCustomer.balance}</p>
        </div>
      )}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Transaction Created</h3>
            <p>Do you want to share this transaction on WhatsApp?</p>
           
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
               onClick={() => shareOnWhatsApp(selectedCustomer.phone)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Customer Search Input */}
      <div className="w-full ">
        <label className="block mb-2 text-xl text-gray-700 font-bold ml-2">Search Customer:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Type Account name..."
        />
        {filteredcustomer.length > 0 && (
          <ul className="bg-white border rounded-lg shadow-md mt-2 max-h-40 overflow-y-auto">
            {filteredcustomer.map((customer) => (

              <li
                key={customer._id}

                onClick={() => handlecustomerelection(customer)}
                className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
              >
                {customer.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* QR Code Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Payment QR Code</h2>
            <QRCodeCanvas value={generateUPILink()} size={200} className="mx-auto" />
            <div>
            <h3 className="text-gray-600 text-sm mt-4">
            <button
             onClick={toggleCodeVisibility}
             className="mt-2 p-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
             >
            {isCodeVisible ? "Hide Code" : "Show Code"}
            </button> = {" "}
            {isCodeVisible ? (
            <span className="font-bold text-orange-500">{generatedCode}</span>
             ) : (
             <span className="font-bold text-orange-500 ml-2">******</span>
              )}
            </h3>
            </div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mt-4"
              placeholder="Enter verification code"
            />
            <button
              onClick={handleVerification}
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Verify
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Calculator */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-2">

      <div className="flex flex-wrap items-center gap-2 mb-2">
      <div>
      <input
  value={amountpaid}
  onChange={(e) => setamountpaid(e.target.value)}
  type="number"
  inputMode="numeric"  // Ensures numeric keyboard on mobile
  pattern="[0-9]*"  // Allows only numbers
  className="px-3 py-1 w-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
  placeholder="Amt. Paid"
    />

     </div>
    <div>
    <input
      value={discount}
      onChange={(e) => setdiscount(e.target.value)}
       type="number"
      inputMode="numeric"  // Ensures numeric keyboard on mobile
      pattern="[0-9]*"  // Allows only numbers
      className="px-3 py-1 w-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      placeholder="discount"
    />
    </div>
    <div>
    <FaNotesMedical 
    onClick={() => setShowTextarea(!showTextarea)}
    className="h-6 w-6"/>
    </div>
    </div>

    {showTextarea && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter transaction details..."
            value={transactionDetails}
            onChange={(e) => setTransactionDetails(e.target.value)}
          ></textarea>
          <div className="flex items-center mt-2 space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-white ${
                isListening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"
              }`}
              onClick={handleVoiceInput}
              disabled={isListening}
            >
              {isListening ? "Listening..." : "Start Voice Input"}
            </button>
          </div>
        </div>
      )}
        <div className="bg-gray-100 overflow-y-auto p-6 rounded-lg mb-2 mt-4 text-right text-xl font-mono">
        {calculation }
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["7", "8", "9", "C", "4", "5", "6", "/", "1", "2", "3", "*", "0", ".", "=", "+"].map((value) => (
            <button
              key={value}
              onClick={() => handleCalculation(value)}
              className="bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500"
            >
            {value}
            </button>
          ))}
          <button
            onClick={() => handleCalculation("-")}
            className="col-span-2 bg-orange-400 text-white py-2 rounded-lg hover:bg-red-500"
          >
            -
          </button>
          <button
            onClick={handleQRGeneration}
            className="col-span-2 bg-green-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Generate QR
          </button>

          
        {paymentModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedPayment(mode.id)}
            className={`px-6 py-2 rounded-lg font-medium  ${
              selectedPayment === mode.id
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {mode.label}
          </button>
          ))}

<div className="fixed bottom-4 left-0 w-full p-4 bg-white shadow-lg">
  <div className="flex justify-center space-x-4">
    <button
      onClick={handleSaleClick}
      className={`px-12 py-2 font-semibold rounded-lg ${
        selected === "sale" ? "bg-red-500 text-white" : "bg-[#18196c] text-white"
      } hover:bg-red-500 hover:text-white transition`}
    >
      SALE
    </button>
    <button
      onClick={handleExpenseClick}
      className={`px-12 py-2 font-semibold rounded-lg ${
        selected === "expense" ? "bg-red-500 text-white" : "bg-[#18196c] text-white"
      } hover:bg-red-500 hover:text-white transition`}
    >
      EXPENSE
    </button>
  </div>
  <button
    onClick={handleSubmit}
    className="mt-4 w-full bg-[#18196c] text-white py-3 px-4 rounded-lg font-bold hover:bg-red-600 transition"
  >
    Save
  </button>
</div>
</div>
</div>
    </div>
  );
};

export default Calculator;
