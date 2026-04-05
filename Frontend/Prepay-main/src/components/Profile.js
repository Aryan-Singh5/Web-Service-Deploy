import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/Authcontext';

const Profile = () => {
  const { user } = useContext(AuthContext); // Access logged-in user details
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phoneNo: '',
    address: '',
    upino: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const phoneNo=user.phone;
  console.log("THE ANSWER IS -",phoneNo)
 
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://backendqr-wal6.onrender.com/profile/${phoneNo}`);
      setProfileData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`https://backendqr-wal6.onrender.com/profile/${phoneNo}`, profileData);
      setProfileData(response.data);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={profileData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-100">{profileData.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email:</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-100">{profileData.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Phone:</label>
            <p className="p-2 border rounded-lg bg-gray-100">{profileData.phoneNo}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Address:</label>
            {editMode ? (
              <input
                type="text"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-100">{profileData.address}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">UPI No:</label>
            {editMode ? (
              <input
                type="text"
                name="upino"
                value={profileData.upino}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <p className="p-2 border rounded-lg bg-gray-100">{profileData.upino}</p>
            )}
          </div>

          <div className="flex justify-between">
            {editMode ? (
              <button
                onClick={updateProfile}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </button>
            )}
            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
