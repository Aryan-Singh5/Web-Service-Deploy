import React from 'react';

const Layout = ({ tabs, selectedTab, setSelectedTab, renderContent }) => {

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white bg-black p-2 rounded-lg"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 md:relative md:translate-x-0 w-64 bg-[#18196c] text-white p-4 flex flex-col shadow-lg h-screen overflow-y-auto`}
      >
        <div className="text-2xl font-bold mb-8">Home Panel</div>
        <button
          className="text-white absolute top-4 right-4 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
            </svg>
                </button>
              <ul className="flex flex-col w-full">
              {tabs.map(tab => (
            <li
              key={tab.name}
              className={`flex items-center space-x-2 p-3 rounded-lg mb-2 cursor-pointer ${
                selectedTab === tab.name
                  ? 'bg-[#f6931e] text-white'
                  : 'hover:bg-[#f6931e] hover:text-white'
              }`}
              onClick={() => setSelectedTab(tab.name)}
                >
              {tab.icon}
              <span>{tab.name}</span>
              </li>
              ))}
             </ul>
             </div>

      <div className="flex-1 p-4">{renderContent()}</div>
    </div>
  );
};

export default Layout;
