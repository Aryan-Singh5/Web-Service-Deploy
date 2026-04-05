import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Pay from './components/Pay';
import Home from "./components/Home";
import Subscribe from "./components/Subscribe";
import Pricing from "./components/Pricing";
import Main from "./components/Main";
import { AuthProvider, AuthContext } from "./context/Authcontext";
import Transaction from "./components/Transaction";

const ProtectedRoute = ({ element }) => {
  const { user } = React.useContext(AuthContext);
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RedirectToHome />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pay" element={<ProtectedRoute element={<Pay />} />} />
          <Route path="/price" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/transcation" element={<ProtectedRoute element={<Transaction />} />} />
          <Route path="/subscribe" element={<ProtectedRoute element={<Subscribe />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const RedirectToHome = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <Navigate to="/home" /> : <Main />;
};

export default App;
