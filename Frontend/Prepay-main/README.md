mongodb+srv://raunak1:DOGTAIL1234@dynamic.ui5a0.mongodb.net/?retryWrites=true&w=majority&appName=dynamic

 {/* Render Customer List */}
      {loading ? (
        <p className="text-center">Loading Accounts...</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="text-center text-gray-500">No Account available.</p>
      ) : (
        <ul className="space-y-4">
          {filteredCustomers.map((customer) => (
            <li
              key={customer.phoneNo}
              className="bg-white p-4 shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{customer.name}</p>
                <p className="text-xs text-gray-500">{customer.email}</p>
                <p className="text-xs text-gray-500">Phone: {customer.phoneNo}</p>
                <p className="text-xs text-gray-500">Category: {customer.category}</p>
                <p className="text-xs text-gray-500">Balance: {customer.balance}</p>
                <p className="text-xs text-gray-500">Address: {customer.address}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => console.log("Edit clicked", customer)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => console.log("Delete clicked", customer.phoneNo)}
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

