import React, { useState } from 'react';
import { FaHome, FaUser, FaChartLine, FaCog } from 'react-icons/fa';
import { FaCalculator } from "react-icons/fa6";
import Layout from './Layout';
import Calculator from './Calculator';
import Customer from './Customer';
import Pricing from './Pricing';
import Analyse from './Analyse';
import Profile from './Profile';
import Transaction from './Transaction';
import History from "./History.js";
import { MdOutlinePayments } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { IoMdAnalytics } from "react-icons/io";
import Myqr from './Myqr.js'
import { MdLocalPolice } from "react-icons/md";
import { BsQrCodeScan } from "react-icons/bs";
import { MdAccountBalanceWallet } from "react-icons/md";

const Home = () => {

  const [selectedTab, setSelectedTab] = useState('Dashboard');

  const tabs = [
    { name: 'Calculator', icon: <FaCalculator/>, component: <Calculator/> },
    { name: 'Merchant Qr', icon: < BsQrCodeScan/>, component: <Myqr/> },
    { name: 'Profile', icon: <FaUser/>, component: <Profile/> },
    { name: 'Analyse', icon: <IoMdAnalytics/>, component: <Analyse/> },
    { name: 'Account', icon: <MdAccountBalanceWallet/>, component: <Customer/> },
    { name: 'Transcation', icon: <MdOutlinePayments />, component: <Transaction /> },
    { name: 'User History', icon: <LuHistory/>, component: <History/> },
    { name: 'Terms & Condition', icon: <MdLocalPolice/>, component: <Pricing /> },
  ];

  const renderSelectedTab = () => {
    const tab = tabs.find(t => t.name === selectedTab);
    return tab ? tab.component : null;
  };

  return (
    <div>
      {/* Render Calculator only when no tab is selected */}
      {selectedTab === 'Dashboard' && <Calculator />}
      {/* Render Layout and content dynamically */}
      <Layout
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        renderContent={renderSelectedTab}
      />
    </div>
  );
};

export default Home;





























