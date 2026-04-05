import { Link } from "react-router-dom";
import { IoMdPricetags } from "react-icons/io";
import { IoMdContacts } from "react-icons/io";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Prepay Smart Calculator</h1>
        <p className="text-xl text-gray-600 mb-6">Simplify Accounts and balance with Smart Calculator.</p>
        <div className="flex flex-row ml-3 mr-1 sm:flex-row gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition">Login</button>
          </Link>
          <Link to="/signup" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-green-700 transition">Signup</button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="text-center">
          <img src="/brandimg.png" alt="Calculator UI" className="w-50 h-50 mx-auto rounded-xl shadow-2xl object-cover" />
          <h2 className="text-2xl font-semibold mt-6">Smart Calculator</h2>
          <p className="text-lg text-gray-600">Accurate and efficient prepayment calculations.</p>
        </div>
        <div className="text-center">
          <img src="/dqr.png" alt="Dynamic QR Generation" className="w-50 h-50 mx-auto rounded-xl shadow-2xl object-cover" />
          <h2 className="text-2xl font-semibold mt-6">Dynamic QR Codes</h2>
          <p className="text-lg text-gray-600">Generate QR codes dynamically for seamless transactions.</p>
        </div>
        <div className="text-center">
          <img src="/analyse.png" alt="Analytics Page" className="w-50 h-50 mx-auto rounded-xl shadow-2xl object-cover" />
          <h2 className="text-2xl font-semibold mt-6">Analytics</h2>
          <p className="text-lg text-gray-600">Get insights and track your prepayments efficiently.</p>
        </div>

        <div className="text-center">
          <img src="/qrimg.png" alt="Analytics Page" className="w-50 h-50 mx-auto rounded-xl shadow-2xl object-cover" />
          <h2 className="text-2xl font-semibold mt-6">FREE QR STAND</h2>
          <p className="text-lg text-gray-600">Get a free Qr Stand with montly subscription of calculator.</p>
        </div>
      </div>
      
      <div className="text-center mb-12 bg-white p-6 rounded-xl shadow-lg w-80">
        <IoMdPricetags className="text-6xl text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Pricing</h2>
        <p className="text-lg text-gray-600">Use our application for just ₹200 per month.</p>
      </div>
      
      {/* Contact Us Section */}
      <div className="text-center mb-12 bg-white p-6 rounded-xl shadow-lg w-80">
        <IoMdContacts className="text-6xl text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
        <p className="text-lg text-gray-600">Have questions? Reach out to us anytime.</p>
        <p className="text-lg text-gray-600">Email-prepayqr@gmail.com</p>
      </div>
    </div>
  );
};

export default HomePage;
